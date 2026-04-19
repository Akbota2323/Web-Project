from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Category, Place, Booking, Favorite
from .serializers import (
    RegisterSerializer,
    PlaceSearchSerializer,
    CategorySerializer,
    PlaceSerializer,
    BookingSerializer,
    FavoriteSerializer,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "message": "User created successfully.",
                "username": user.username,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
def search_places(request):
    params_serializer = PlaceSearchSerializer(data=request.query_params)
    if not params_serializer.is_valid():
        return Response(params_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = params_serializer.validated_data
    qs = Place.objects.all()

    if data.get("query"):
        qs = qs.filter(
            Q(name__icontains=data["query"]) | Q(description__icontains=data["query"])
        )

    if data.get("category"):
        qs = qs.filter(category__name=data["category"])

    if data.get("min_rating") is not None:
        qs = qs.filter(rating__gte=data["min_rating"])

    serializer = PlaceSerializer(qs, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


class PlaceListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        places = Place.objects.all()
        serializer = PlaceSerializer(places, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({"detail": "Admin only."}, status=status.HTTP_403_FORBIDDEN)

        serializer = PlaceSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlaceDetailView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            return Place.all_objects.get(pk=pk)
        except Place.DoesNotExist:
            return None

    def get(self, request, pk):
        place = self.get_object(pk)
        if not place:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PlaceSerializer(place, context={"request": request})
        return Response(serializer.data)

    def put(self, request, pk):
        place = self.get_object(pk)
        if not place:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PlaceSerializer(place, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        place = self.get_object(pk)
        if not place:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        place.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BookingListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Booking.objects.get(pk=pk, user=user)
        except Booking.DoesNotExist:
            return None

    def get(self, request, pk):
        booking = self.get_object(pk, request.user)
        if not booking:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(BookingSerializer(booking).data)

    def delete(self, request, pk):
        booking = self.get_object(pk, request.user)
        if not booking:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        booking.status = "cancelled"
        booking.save()
        return Response({"detail": "Booking cancelled."})


class FavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related("place")
        serializer = FavoriteSerializer(favorites, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        place_id = request.data.get("place_id")

        try:
            place = Place.all_objects.get(pk=place_id)
        except Place.DoesNotExist:
            return Response({"detail": "Place not found."}, status=status.HTTP_404_NOT_FOUND)

        favorite, created = Favorite.objects.get_or_create(user=request.user, place=place)

        if not created:
            favorite.delete()
            return Response({"detail": "Removed from favorites.", "favorited": False})

        return Response(
            {"detail": "Added to favorites.", "favorited": True},
            status=status.HTTP_201_CREATED,
        )
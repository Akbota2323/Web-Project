from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Place, Booking, Favorite
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user



class PlaceSearchSerializer(serializers.Serializer):
    query = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, allow_blank=True)
    min_rating = serializers.FloatField(required=False, min_value=0, max_value=5)


class CategorySerializer(serializers.ModelSerializer):
    place_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "description", "icon", "place_count"]

    def get_place_count(self, obj):
        return obj.places.filter(is_active=True).count()


class PlaceSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = [
            "id",
            "name",
            "description",
            "address",
            "category",
            "category_id",
            "latitude",
            "longitude",
            "image_url",
            "rating",
            "price_range",
            "working_hours",
            "is_active",
            "created_at",
            "is_favorited",
        ]

    def get_is_favorited(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, place=obj).exists()
        return False


class BookingSerializer(serializers.ModelSerializer):
    place_name = serializers.CharField(source="place.name", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    place_image = serializers.CharField(source="place.image_url", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "place",
            "place_name",
            "place_image",
            "username",
            "tour_date",
            "num_people",
            "status",
            "notes",
            "created_at",
        ]
        read_only_fields = ["user", "status", "created_at"]


class FavoriteSerializer(serializers.ModelSerializer):
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "place", "added_at"]



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
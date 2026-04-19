from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import (
    register_view,
    LogoutView,
    search_places,
    category_list,
    PlaceListCreateView,
    PlaceDetailView,
    BookingListCreateView,
    BookingDetailView,
    FavoriteView,
)

urlpatterns = [
    path("register/", register_view, name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),

    path("categories/", category_list, name="category-list"),
    path("places/search/", search_places, name="place-search"),
    path("places/", PlaceListCreateView.as_view(), name="place-list-create"),
    path("places/<int:pk>/", PlaceDetailView.as_view(), name="place-detail"),

    path("bookings/", BookingListCreateView.as_view(), name="booking-list-create"),
    path("bookings/<int:pk>/", BookingDetailView.as_view(), name="booking-detail"),

    path("favorites/", FavoriteView.as_view(), name="favorite-list-toggle"),
]
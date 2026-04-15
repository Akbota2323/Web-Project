from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.register),
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/logout/', views.logout),

    # Places
    path('places/', views.PlaceListCreateView.as_view()),
    path('places/<int:pk>/', views.PlaceDetailView.as_view()),
    path('places/search/', views.search_places),

    # Categories
    path('categories/', views.category_list),

    # Bookings
    path('bookings/', views.BookingListCreateView.as_view()),
    path('bookings/<int:pk>/', views.BookingDetailView.as_view()),

    # Favorites
    path('favorites/', views.FavoriteView.as_view()),
]
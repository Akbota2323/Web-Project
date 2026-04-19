from django.db import models
from django.contrib.auth.models import User
from .managers import PublishedPlaceManager


class Category(models.Model):
    CATEGORY_CHOICES = [
        ("food", "Food & Restaurants"),
        ("nature", "Nature & Parks"),
        ("culture", "Culture & Museums"),
        ("entertainment", "Entertainment"),
    ]
    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default="📍")

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.get_name_display()


class Place(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    address = models.CharField(max_length=300)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="places"
    )  # FK #1
    latitude = models.FloatField(default=43.2220)
    longitude = models.FloatField(default=76.8512)
    image_url = models.URLField(blank=True)
    rating = models.FloatField(default=0.0)
    price_range = models.CharField(max_length=10, default="$$")
    working_hours = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Custom manager
    objects = PublishedPlaceManager()
    all_objects = models.Manager()  # fallback to all

    class Meta:
        ordering = ["-rating"]

    def __str__(self):
        return self.name


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bookings"
    )  # FK #2
    place = models.ForeignKey(
        Place, on_delete=models.CASCADE, related_name="bookings"
    )  # FK #3
    tour_date = models.DateField()
    num_people = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} — {self.place.name} on {self.tour_date}"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    place = models.ForeignKey(
        Place, on_delete=models.CASCADE, related_name="favorited_by"
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "place")

    def __str__(self):
        return f"{self.user.username} ♥ {self.place.name}"

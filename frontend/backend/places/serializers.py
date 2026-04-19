from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Place, Booking, Favorite


# ── 2 × serializers.Serializer ─────────────────────────────────────────────

class RegisterSerializer(serializers.Serializer):
    """Plain Serializer #1 — user registration"""
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already taken.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class PlaceSearchSerializer(serializers.Serializer):
    """Plain Serializer #2 — search / filter params"""
    query = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, allow_blank=True)
    min_rating = serializers.FloatField(required=False, min_value=0, max_value=5)


# ── 2 × serializers.ModelSerializer ────────────────────────────────────────

class CategorySerializer(serializers.ModelSerializer):
    """ModelSerializer #1"""
    place_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'place_count']

    def get_place_count(self, obj):
        return obj.places.filter(is_active=True).count()


class PlaceSerializer(serializers.ModelSerializer):
    """ModelSerializer #2"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = [
            'id', 'name', 'description', 'address',
            'category', 'category_id',
            'latitude', 'longitude', 'image_url',
            'rating', 'price_range', 'working_hours',
            'is_active', 'created_at', 'is_favorited'
        ]

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, place=obj).exists()
        return False


class BookingSerializer(serializers.ModelSerializer):
    place_name = serializers.CharField(source='place.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'place', 'place_name', 'username',
            'tour_date', 'num_people', 'status', 'notes', 'created_at'
        ]
        read_only_fields = ['user', 'status', 'created_at']


class FavoriteSerializer(serializers.ModelSerializer):
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'place', 'added_at']
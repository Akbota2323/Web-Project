from django.db import models

class PublishedPlaceManager(models.Manager):
    """Returns only active (published) places"""
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)

    def by_category(self, category_name):
        return self.get_queryset().filter(category__name=category_name)
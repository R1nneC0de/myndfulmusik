from django.contrib import admin

# Register your models here.
from .models import Song, Review, Comment, CustomSong

admin.site.register(Song)
admin.site.register(Review)
admin.site.register(Comment)
admin.site.register(CustomSong)
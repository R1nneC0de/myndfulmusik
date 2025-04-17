from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SongViewSet, ReviewViewSet, CommentViewSet, CustomSongViewSet

router = DefaultRouter()
router.register(r'songs', SongViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'customsongs', CustomSongViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

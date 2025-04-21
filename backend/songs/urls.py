from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SongViewSet, ReviewViewSet, CommentViewSet, CustomSongViewSet, spotify_callback, trending_songs

router = DefaultRouter()
router.register(r'songs', SongViewSet, basename='songs')
router.register(r'reviews', ReviewViewSet, basename='reviews')
router.register(r'comments', CommentViewSet, basename='comments')   
router.register(r'customsongs', CustomSongViewSet, basename='customsongs')  

urlpatterns = [
    path('', include(router.urls)),
    path('spotify/callback/', spotify_callback),
    path('trending/', trending_songs),

]

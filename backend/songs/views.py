from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Song, Review, Comment, CustomSong
from .serializers import SongSerializer, ReviewSerializer, CommentSerializer, CustomSongSerializer

from rest_framework.permissions import IsAuthenticated

class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CustomSongViewSet(viewsets.ModelViewSet):
    queryset = CustomSong.objects.all()
    serializer_class = CustomSongSerializer

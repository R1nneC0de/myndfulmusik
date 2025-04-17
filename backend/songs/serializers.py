from rest_framework import serializers
from .models import Song, Review, Comment, CustomSong

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user', 'timestamp']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class CustomSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomSong
        fields = '__all__'

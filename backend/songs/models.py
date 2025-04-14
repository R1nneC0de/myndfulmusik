from django.db import models

# Create your models here.
from users.models import CustomUser

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.CharField(max_length=255, blank=True)
    genre = models.CharField(max_length=100)
    release_date = models.DateField()
    length = models.DurationField()

    def __str__(self):
        return f"{self.title} by {self.artist}"

class Review(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    rating = models.IntegerField()
    review_text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.song.title}"

class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    comment_text = models.TextField()
    comment_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username}"

class CustomSong(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    custom_song_title = models.CharField(max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)
    audio_file = models.FileField(upload_to='custom_songs/')

    def __str__(self):
        return f"{self.custom_song_title} by {self.user.username}"
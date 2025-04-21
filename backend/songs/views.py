from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework import viewsets
from django.db import connection
from rest_framework.permissions import IsAuthenticated
from .serializers import SongSerializer
from .models import Song, Review, Comment, CustomSong
from .serializers import ReviewSerializer, CommentSerializer, CustomSongSerializer
from rest_framework.parsers import MultiPartParser, FormParser
import datetime

class SongViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SongSerializer

    def list(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, title, artist, album, genre, release_date, length FROM songs_song")
            rows = cursor.fetchall()
            songs = [
                {
                    'id': row[0],
                    'title': row[1],
                    'artist': row[2],
                    'album': row[3],
                    'genre': row[4],
                    'release_date': row[5],
                    'length': row[6]
                }
                for row in rows
            ]
        return Response(songs)
    
    def create(self, request):
        data = request.data
        title = data.get('title')
        artist = data.get('artist')
        album = data.get('album')
        genre = data.get('genre')
        release_date = data.get('release_date')
        length = data.get('length')
        length = f"{length} seconds"

        with connection.cursor() as cursor:
            # Check if the song already exists by title and artist
            cursor.execute("""
                SELECT id FROM songs_song WHERE title = %s AND artist = %s
            """, [title, artist])
            existing = cursor.fetchone()

            if existing:
                return Response({'id': existing[0]}, status=200)  # song already exists

            # If not, insert the new song
            cursor.execute("""
                INSERT INTO songs_song (title, artist, album, genre, release_date, length)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            """, [title, artist, album, genre, release_date, length])
            song_id = cursor.fetchone()[0]

        return Response({'id': song_id}, status=201)
    
    def retrieve(self, request, pk=None):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, title, artist, album, genre, release_date, length
                FROM songs_song WHERE id = %s
            """, [pk])
            row = cursor.fetchone()

            if not row:
                return Response({"error": "Song not found"}, status=404)

            song = {
                'id': row[0],
                'title': row[1],
                'artist': row[2],
                'album': row[3],
                'genre': row[4],
                'release_date': row[5],
                'length': row[6]
            }
        return Response(song)



class ReviewViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT r.id, r.rating, r.review_text, r.timestamp, r.song_id, u.id, u.username, s.title
                FROM songs_review r
                JOIN users_customuser u ON r.user_id = u.id
                JOIN songs_song s ON r.song_id = s.id
                ORDER BY r.timestamp DESC
            """)
            rows = cursor.fetchall()

            reviews = [
                {
                    "id": row[0],
                    "rating": row[1],
                    "review_text": row[2],
                    "timestamp": row[3],
                    "song": row[4],
                    "user": {
                        "id": row[5],
                        "username": row[6]
                    },
                    "song_title": row[7]
                }
                for row in rows
            ]
        return Response(reviews)


    def create(self, request):
        user_id = request.user.id
        song_id = request.data.get("song")
        rating = request.data.get("rating")
        review_text = request.data.get("review_text")

        if not all([song_id, rating, review_text]):
            return Response({"error": "Missing fields"}, status=400)

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO songs_review (rating, review_text, song_id, user_id, timestamp)
                VALUES (%s, %s, %s, %s, NOW())
            """, [rating, review_text, song_id, user_id])

        return Response({"message": "Review submitted successfully"}, status=201)
    
    def destroy(self, request, pk=None):
        user_id = request.user.id
        with connection.cursor() as cursor:
            # Ensure the review exists and belongs to the current user
            cursor.execute("SELECT user_id FROM songs_review WHERE id = %s", [pk])
            row = cursor.fetchone()

            if not row:
                return Response({"error": "Review not found"}, status=404)
            if row[0] != user_id:
                return Response({"error": "Unauthorized to delete this review"}, status=403)

            # If valid, delete the review
            cursor.execute("DELETE FROM songs_review WHERE id = %s", [pk])

        return Response({"message": "Review deleted"}, status=204)



class CommentViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT c.id, c.comment_text, c.comment_timestamp, c.review_id, c.user_id, u.username
                FROM songs_comment c
                JOIN users_customuser u ON c.user_id = u.id
                ORDER BY c.comment_timestamp DESC
            """)
            rows = cursor.fetchall()

            comments = [
                {
                    "id": row[0],
                    "comment_text": row[1],
                    "comment_timestamp": row[2],
                    "review": row[3],
                    "user": {
                        "id": row[4],
                        "username": row[5]
                    }
                }
                for row in rows
            ]
        return Response(comments)

    def create(self, request):
        user_id = request.user.id
        review_id = request.data.get("review")
        comment_text = request.data.get("comment_text")

        if not all([review_id, comment_text]):
            return Response({"error": "Missing fields"}, status=400)

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO songs_comment (comment_text, comment_timestamp, review_id, user_id)
                VALUES (%s, NOW(), %s, %s)
            """, [comment_text, review_id, user_id])

        return Response({"message": "Comment added successfully"}, status=201)
    
    def destroy(self, request, pk=None):
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM songs_review WHERE id = %s", [pk])
        return Response({"message": "Review deleted"}, status=204)

class CustomSongViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request):
        user_id = request.user.id
        title = request.data.get("customSongTitle")
        file = request.FILES.get("audioFile")

        if not title or not file:
            return Response({"error": "All fields required"}, status=400)

        file_path = f"media/custom_songs/{file.name}"
        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO songs_customsong (customsongtitle, uploaddate, audiofilepath, user_id)
                VALUES (%s, NOW(), %s, %s)
            """, [title, file_path, user_id])

        return Response({"message": "Custom song uploaded successfully"}, status=201)


# Spotify token exchange handler
# songs/views.py

import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

@csrf_exempt
def spotify_callback(request):
    code = request.GET.get('code')
    if not code:
        return JsonResponse({'error': 'No code provided'}, status=400)

    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'http://127.0.0.1:3000/callback',
        'client_id': settings.SPOTIFY_CLIENT_ID,
        'client_secret': settings.SPOTIFY_CLIENT_SECRET,
    }

    response = requests.post('https://accounts.spotify.com/api/token', data=data)
    print('Spotify token response:', response.status_code, response.text)

    if response.status_code != 200:
        return JsonResponse({'error': 'Spotify token exchange failed'}, status=500)

    token_info = response.json()
    return JsonResponse({
        'access_token': token_info.get('access_token'),
        'refresh_token': token_info.get('refresh_token'),
        'expires_in': token_info.get('expires_in'),  # in seconds
    })


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trending_songs(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT s.id, s.title, s.artist, COUNT(r.id) as review_count
            FROM songs_song s
            LEFT JOIN songs_review r ON s.id = r.song_id
            GROUP BY s.id
            ORDER BY review_count DESC
            LIMIT 5
        """)
        rows = cursor.fetchall()
        trending = [
            {
                "id": row[0],
                "title": row[1],
                "artist": row[2],
                "review_count": row[3]
            }
            for row in rows
        ]
    return Response(trending)

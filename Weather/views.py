from django.http.response import JsonResponse
from django.shortcuts import render
from apixu.client import ApixuClient, ApixuException


def get_client(request):
    return render(request, 'index.html')


def get_weather_api_json(request, location):
    api_key = '78f26cd450d44500953134819172807'
    client = ApixuClient(api_key)
    current = client.getCurrentWeather(q=location)
    return JsonResponse(current)
from django.conf.urls import url
from Weather.views import get_weather_api_json


urlpatterns = [
    url(r'^weather/(?P<location>\w+)/$', get_weather_api_json),
]
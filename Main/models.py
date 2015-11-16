from django.db import models
from django.contrib import admin


# Create your models here.
# Create your models here.
class UberManager(models.Manager):
    def create_uber(self, start_pos, timestamp, car_type, distance, high_estimate_price, surge_multiplier, minimum_price, low_estimate_price, duration):
        uber = self.model(start_pos=start_pos, timestamp=timestamp, car_type=car_type,distance=distance, high_estimate_price=high_estimate_price, surge_multiplier=surge_multiplier, minimum_price=minimum_price, low_estimate_price=low_estimate_price, duration=duration)
        uber.save()
        return uber

class Uber(models.Model):
    start_pos = models.IntegerField() #0:alpharetta
    timestamp = models.DateTimeField(unique=True)
    car_type = models.IntegerField() #UberX, UberXL, UberSELECT, UberBLACK, UberSUV
    estimated_waiting_time = models.IntegerField(null=True)
    distance = models.FloatField()
    high_estimate_price = models.IntegerField()
    surge_multiplier = models.FloatField()
    minimum_price = models.IntegerField()
    low_estimate_price = models.IntegerField()
    duration = models.IntegerField()

    objects = UberManager()

    def __str__(self):
        return ""


class UberAdmin(admin.ModelAdmin):
    list_display = ('id', 'start_pos', 'timestamp', 'car_type', 'estimated_waiting_time', 'distance', 'high_estimate_price', 'surge_multiplier', 'minimum_price', 'low_estimate_price', 'duration')
    '''
    def get_customer(self, obj):
        return obj.customer.nickname
    def get_translaters(self, obj):
        text = ''
        for translater in obj.translaters.all():
            text = text + translater.nickname + ', '
        return text
    '''
admin.site.register(Uber, UberAdmin)


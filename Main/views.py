from django.shortcuts import render, render_to_response
from models import *
import csv, simplejson
from datetime import datetime, timedelta
from django.http import HttpResponse
from django.template import RequestContext
from django.core import serializers
import json


places = ['alpharetta', 'buckhead', 'decatur', 'gt', 'marietta', 'peachtree', 'sandy', 'stone']
folders = ['Event', 'Week']

# Create your views here.
def main(request):
    return render_to_response('index.html', RequestContext(request))
    #return render_to_response('infoFinal/index.html')


def request_data(request):

    start_pos = request.POST['start_pos']
    car_type = request.POST['car_type']
    start_time = request.POST['start_time']
    end_time = request.POST['end_time']


    result = Uber.objects.filter(start_pos=start_pos, timestamp__range=["2015-11-01", "2015-11-02"], car_type=car_type)
    data = serializers.serialize("json", result)
    print type(data)

    return HttpResponse(json.dumps(data, sort_keys=True, indent=4, separators=(',', ': ')), 'application/json')


def save_data(request):
    for folder in folders:
        for i in range(len(places)):
            doc = './Data/' + folder + '/' + places[i] + '/price'
            print doc

            with open(doc) as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    #print i,    row
                    timestamp = datetime.strptime(row['timestamp'], '%Y-%m-%d %H:%M')
                    timestamp = timestamp - timedelta(hours=4)
                    car_type = 0
                    if row['localized_display_name'] == 'uberX':
                        car_type = 0
                    elif row['localized_display_name'] == 'uberXL':
                        car_type = 1
                    elif row['localized_display_name'] == 'UberSELECT':
                        car_type = 2
                    elif row['localized_display_name'] == 'UberBLACK':
                        car_type = 3
                    elif row['localized_display_name'] == 'UberSUV':
                        car_type = 4

                    ub = Uber.objects.filter(start_pos=i, timestamp=timestamp, car_type=car_type)
                    if len(ub) == 0:
                        Uber.objects.create_uber(i, timestamp, car_type, float(row['distance']), int(row['high_estimate']), float(row['surge_multiplier']), int(row['minimum']), int(row['low_estimate']), int(row['duration']))
                        #print (row['timestamp'], row['localized_display_name'], row['distance'], row['high_estimate'], row['surge_multiplier'], row['minimum'], row['low_estimate'],row['duration'],)


    return render_to_response('infoFinal/index.html')



def save_data2(request):
    for folder in folders:
        for i in range(len(places)):
            doc = './Data/' + folder + '/' + places[i] +     '/time'

            with open(doc) as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    timestamp = datetime.strptime(row['timestamp'], '%Y-%m-%d %H:%M')
                    timestamp = timestamp - timedelta(hours=4)
                    car_type = 0
                    if row['localized_display_name'] == 'uberX':
                        car_type = 0
                    elif row['localized_display_name'] == 'uberXL':
                        car_type = 1
                    elif row['localized_display_name'] == 'UberSELECT':
                        car_type = 2
                    elif row['localized_display_name'] == 'UberBLACK':
                        car_type = 3
                    elif row['localized_display_name'] == 'UberSUV':
                        car_type = 4
                    ubers = Uber.objects.filter(start_pos=i, timestamp=timestamp, car_type=car_type)
                    if len(ubers) == 1:
                        ubers[0].estimated_waiting_time = int(row['estimate'])
                        ubers[0].save()
                    elif len(ubers) > 1:
                        print len(ubers)
                        #print(row['timestamp'], row['localized_display_name'], row['estimate'])

                    #print(row['timestamp'], row['localized_display_name'], row['estimate'])



    return render_to_response('infoFinal/index.html')
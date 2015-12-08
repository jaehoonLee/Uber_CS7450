from django.shortcuts import render, render_to_response
from models import *
import csv, simplejson
from datetime import datetime, timedelta
from django.http import HttpResponse
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
import json


places = ['alpharetta', 'buckhead', 'decatur', 'gt', 'marietta', 'peachtree', 'sandy', 'stone']
folders = ['Event', 'Week']

# Create your views here.
def main(request):

    ubers = Uber.objects.filter(start_pos=0, timestamp__range=["2015-11-01", "2015-11-02"], car_type=0)
    results = []

    for uber in ubers:
        result = {}
        for i in uber._meta.fields:
            if isinstance(getattr(uber, i.name), datetime):
                result[i.name] = getattr(uber, i.name).strftime('%Y-%m-%d %H:%M')

            else :
                result[i.name] = getattr(uber, i.name)

            #print getattr(uber, i.name)
        results.append(result)

    data = simplejson.dumps(results, indent=4, sort_keys=True)


    return render_to_response('index_main.html', RequestContext(request, {'data': data}))
    #return render_to_response('infoFinal/index.html')


def filter(request):
    return render_to_response('index2.html', RequestContext(request))




@csrf_exempt
def request_data(request):

    start_pos = request.POST['start_pos']
    car_type = request.POST['car_type']
    start_time = request.POST['start_time']
    end_time = request.POST['end_time']


    ubers = Uber.objects.filter(start_pos=start_pos, timestamp__range=[start_time, end_time], car_type=car_type)
    results = []

    for uber in ubers:
        result = {}


        for i in uber._meta.fields:
            if isinstance(getattr(uber, i.name), datetime):
                result[i.name] = getattr(uber, i.name).strftime('%Y-%m-%d %H:%M')

            else :
                result[i.name] = getattr(uber, i.name)

            #print getattr(uber, i.name)
        '''
        print uber.timestamp.strftime('%Y-%m-%d %H:%M')
        result['timestamp'] = uber.timestamp.strftime('%Y-%m-%d %H:%M')
        '''
        results.append(result)

    #parsed = json.loads(results)
    data = simplejson.dumps(results, indent=4, sort_keys=True)


    return HttpResponse(data, content_type='application/json')


@csrf_exempt
def request_start_pos_data(request):

    car_type = request.POST['car_type']
    start_time = request.POST['start_time']
    end_time = request.POST['end_time']



    print type(car_type), start_time, end_time

    ubers = Uber.objects.filter(timestamp__range=[start_time, end_time], car_type=car_type)

    results = []

    for uber in ubers:
        result = {}


        for i in uber._meta.fields:
            if isinstance(getattr(uber, i.name), datetime):
                result[i.name] = getattr(uber, i.name).strftime('%Y-%m-%d %H:%M')

            else :
                result[i.name] = getattr(uber, i.name)

            #print getattr(uber, i.name)

        results.append(result)

    #parsed = json.loads(results)
    data = simplejson.dumps(results, indent=4, sort_keys=True)


    return HttpResponse(data, content_type='application/json')




def filter_data(request):

    start_pos = request.POST['start_pos']
    car_type = request.POST['car_type']
    start_time = request.POST['start_time']
    end_time = request.POST['end_time']


    ubers = Uber.objects.filter(start_pos=start_pos, timestamp__range=[start_time, end_time], car_type=car_type)
    results = []

    for uber in ubers:
        result = {}

        result['a_timestamp'] = uber.timestamp.strftime('%Y-%m-%d %H:%M')
        result['surge_multiplier'] = uber.surge_multiplier
        result['high_estimate_price'] = uber.high_estimate_price
        result['low_estimate_price'] = uber.low_estimate_price
        result['duration'] = uber.duration
        result['estimate'] = uber.estimated_waiting_time
        print uber.timestamp.strftime('%Y-%m-%d %H:%M')

        results.append(result)

    #parsed = json.loads(results)
    data = simplejson.dumps(results, indent=4, sort_keys=True)


    return HttpResponse(data, content_type='application/json')



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
                    else:
                        continue

                    ub = Uber.objects.filter(start_pos=i, timestamp=timestamp, car_type=car_type)
                    if len(ub) == 0:
                        Uber.objects.create_uber(i, timestamp, car_type, float(row['distance']), int(row['high_estimate']), float(row['surge_multiplier']), int(row['minimum']), int(row['low_estimate']), int(row['duration']))
                    elif len(ub) == 1:
                        ub[0].distance = float(row['distance'])
                        ub[0].high_estimate = float(row['high_estimate'])
                        ub[0].surge_multiplier = float(row['surge_multiplier'])
                        ub[0].minimum = float(row['minimum'])
                        ub[0].low_estimate = float(row['low_estimate'])
                        ub[0].duration = float(row['duration'])
                        ub[0].save()


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
                    else:
                        continue

                    ubers = Uber.objects.filter(start_pos=i, timestamp=timestamp, car_type=car_type)
                    if len(ubers) == 1:
                        ubers[0].estimated_waiting_time = int(row['estimate'])
                        ubers[0].save()
                    elif len(ubers) > 1:
                        print len(ubers)
                        #print(row['timestamp'], row['localized_display_name'], row['estimate'])

                    #print(row['timestamp'], row['localized_display_name'], row['estimate'])



    return render_to_response('infoFinal/index.html')

def save_data3(request):

    for i in range(len(places)):
        doc = './Data/Week/' + places[i] + '/price'
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
                else :
                    continue
                ub = Uber.objects.filter(start_pos=i, timestamp=timestamp, car_type=car_type)
                #print timestamp, car_type, int(row['high_estimate']), int(row['low_estimate']), float(row['surge_multiplier']), ub[0].distance
                print i, timestamp, len(ub)
                if len(ub) == 1:
                    print 1, timestamp, len(ub), row['localized_display_name'], float(row['high_estimate'])
                    ub_oj = ub[0]

                    ub_oj.distance = float(row['distance'])
                    ub_oj.high_estimate_price = float(row['high_estimate'])
                    ub_oj.surge_multiplier = float(row['surge_multiplier'])
                    ub_oj.minimum_price = float(row['minimum'])
                    ub_oj.low_estimate_price = float(row['low_estimate'])
                    ub_oj.duration = float(row['duration'])
                    ub_oj.save()



    return render_to_response('infoFinal/index.html')

def save_data5(request):

    doc = './Data/Week/buckhead/price'
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
            else :
                continue
            ub = Uber.objects.filter(start_pos=1, timestamp=timestamp, car_type=car_type)
            #print timestamp, car_type, int(row['high_estimate']), int(row['low_estimate']), float(row['surge_multiplier']), ub[0].distance

            if len(ub) == 1:
                print 1, timestamp, len(ub), row['localized_display_name'], float(row['high_estimate'])
                ub_oj = ub[0]

                ub_oj.distance = float(row['distance'])
                ub_oj.high_estimate_price = float(row['high_estimate'])
                ub_oj.surge_multiplier = float(row['surge_multiplier'])
                ub_oj.minimum_price = float(row['minimum'])
                ub_oj.low_estimate_price = float(row['low_estimate'])
                ub_oj.duration = float(row['duration'])
                ub_oj.save()

    '''
    timestamp = datetime.strptime('2015-10-26 00:11', '%Y-%m-%d %H:%M') #12
    ub = Uber.objects.filter(start_pos=1, timestamp=timestamp, car_type=0)
    print ub[0].high_estimate_price

    ub_object = ub[0]
    ub_object.high_estimate_price = 3
    ub_object.save()
    print len(ub), ub[0].high_estimate_price
    '''

    return render_to_response('infoFinal/index.html')
def update_data(request):

    for i in range(len(places)):
        doc = './Data/Week/' + places[i] + '/time'
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
                else :
                    continue

                ubers = Uber.objects.filter(start_pos=i, timestamp=timestamp, car_type=car_type)
                if len(ubers) == 1:
                    print i, timestamp, int(row['estimate'])
                    ub_oj = ubers[0]
                    ub_oj.estimated_waiting_time = int(row['estimate'])
                    ub_oj.save()



    return render_to_response('infoFinal/index.html')
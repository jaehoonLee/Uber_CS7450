__author__ = 'jaehoonlee88'

import csv, datetime
#import Main.models

with open('./Data/Event/alpharetta/price_parse') as csvfile:
    with open('./Data/Event/alpharetta/time_parse') as csvfile2:
        reader = csv.DictReader(csvfile)
        reader2 = csv.DictReader(csvfile2)
        reader2_iter= iter(reader2)
        for row in reader:
            row2 = reader2_iter.next()
            print(row['timestamp'], row['localized_display_name'], row['distance'], row['high_estimate'], row['surge_multiplier'], row['minimum'], row['low_estimate'],row['duration'],)
            print(row2['timestamp'], row['localized_display_name'], row2['estimate'])


        #for row in reader2:
        #    print(row['estimate'], )
        #valid_datetime = datetime.datetime.strptime(row['timestamp'], '%Y-%m-%d %H:%M')
        #print valid_datetime




'''


estimated_waiting_time = models.IntegerField()
'''


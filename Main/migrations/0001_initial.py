# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Uber',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_pos', models.IntegerField()),
                ('timestamp', models.DateTimeField()),
                ('car_type', models.IntegerField()),
                ('estimated_waiting_time', models.IntegerField(null=True)),
                ('distance', models.FloatField()),
                ('high_estimate_price', models.IntegerField()),
                ('surge_multiplier', models.FloatField()),
                ('minimum_price', models.FloatField()),
                ('low_estimate_price', models.FloatField()),
                ('duration', models.IntegerField()),
            ],
        ),
    ]

# Generated by Django 5.1.4 on 2024-12-07 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='member',
            name='name',
        ),
        migrations.AddField(
            model_name='member',
            name='first_name',
            field=models.CharField(default='DefaultFirstName', max_length=100),
        ),
        migrations.AddField(
            model_name='member',
            name='last_name',
            field=models.CharField(default='DefaultLastName', max_length=100),
        ),
        migrations.AddField(
            model_name='member',
            name='nick_name',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='member',
            name='password',
            field=models.CharField(default='defaultpassword', max_length=255),
        ),
        migrations.AddField(
            model_name='member',
            name='phone_number',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AlterField(
            model_name='member',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
    ]

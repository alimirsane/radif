from django.contrib import admin

from apps.appointment.models import Queue, Appointment


@admin.register(Queue)
class QueueAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_time', 'end_time', 'time_interval', 'status')
    list_filter = ('status',)
    search_fields = ('name',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('queue', 'start_time', 'duration', 'user')
    list_filter = ('queue', 'start_time')
    search_fields = ('user__username', 'queue__name')
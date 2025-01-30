from rest_framework import serializers

from apps.account.api.serializers import UserSummerySerializer
from apps.appointment.models import Queue, Appointment
from datetime import datetime, timedelta, time


class AppointmentSerializerLite(serializers.ModelSerializer):
    reserved_by_obj = UserSummerySerializer(read_only=True, source='reserved_by')

    class Meta:
        model = Appointment
        fields = ['start_time', 'status', 'reserved_by', 'reserved_by_obj']


class QueueSerializer(serializers.ModelSerializer):
    appointments = AppointmentSerializerLite(many=True, read_only=True)

    class Meta:
        model = Queue
        fields = '__all__'


class AppointmentListSerializer(serializers.Serializer):
    date = serializers.DateField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    status = serializers.CharField()


class AppointmentSerializer(serializers.ModelSerializer):
    reserved_by_obj = UserSummerySerializer(read_only=True, source='reserved_by')

    class Meta:
        model = Appointment
        fields = '__all__'

    def validate(self, data):
        queue = data['queue']
        start_time = data['start_time']

        if queue.status != 'active':
            raise serializers.ValidationError({"queue": "این صف فعال نیست و نمی‌توان نوبت رزرو کرد."})

        total_minutes = start_time.hour * 60 + start_time.minute + queue.time_unit
        hours, minutes = divmod(total_minutes, 60)
        hours = hours % 24
        new_end_time = time(hour=hours, minute=minutes)

        conflicting_appointments = Appointment.objects.filter(queue=queue)
        if self.instance:
            conflicting_appointments = conflicting_appointments.exclude(pk=self.instance.pk)

        for appointment in conflicting_appointments:
            appointment_end_time = (datetime.combine(datetime.today(), appointment.start_time) +
                                    timedelta(minutes=queue.time_unit)).time()
            if not (new_end_time <= appointment.start_time or start_time >= appointment_end_time):
                raise serializers.ValidationError(
                    {"time": f"این بازه زمانی قبلاً رزرو شده است: {appointment.start_time} تا {appointment_end_time}"}
                )

        return data
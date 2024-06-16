from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from apps.account.permissions import AccessLevelPermission, query_set_filter_key

from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from apps.appointment.models import Queue, Appointment
from apps.appointment.api.serializers import QueueSerializer, AppointmentSerializer


class QueueListCreateView(ListCreateAPIView):
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    permission_classes = [IsAuthenticated]


class QueueDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    permission_classes = [IsAuthenticated]


class AppointmentListCreateView(ListCreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        queue = serializer.validated_data['queue']
        if queue.status != 'active':
            raise ValidationError("این صف فعال نیست و نمی‌توان نوبت رزرو کرد.")

        # زمان پایان نوبت جدید را محاسبه می‌کنیم
        start_time = serializer.validated_data['start_time']
        duration = serializer.validated_data['duration']
        new_end_time = start_time + duration

        # بررسی تداخل زمانی با نوبت‌های دیگر
        conflicting_appointments = Appointment.objects.filter(
            queue=queue,
            start_time__lt=new_end_time,
            start_time__gte=start_time
        ).exclude(pk=self.kwargs.get('pk', None))

        for appointment in conflicting_appointments:
            appointment_end_time = appointment.start_time + appointment.duration
            if appointment.start_time < new_end_time and start_time < appointment_end_time:
                raise ValidationError("این بازه زمانی قبلاً رزرو شده است.")

        serializer.save()


class AppointmentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        queue = serializer.validated_data['queue']
        if queue.status != 'active':
            raise ValidationError("این صف فعال نیست و نمی‌توان نوبت رزرو کرد.")

        # زمان پایان نوبت جدید را محاسبه می‌کنیم
        start_time = serializer.validated_data['start_time']
        duration = serializer.validated_data['duration']
        new_end_time = start_time + duration

        # بررسی تداخل زمانی با نوبت‌های دیگر
        conflicting_appointments = Appointment.objects.filter(
            queue=queue,
            start_time__lt=new_end_time,
            start_time__gte=start_time
        ).exclude(pk=self.kwargs.get('pk', None))

        for appointment in conflicting_appointments:
            appointment_end_time = appointment.start_time + appointment.duration
            if appointment.start_time < new_end_time and start_time < appointment_end_time:
                raise ValidationError("این بازه زمانی قبلاً رزرو شده است.")

        serializer.save()

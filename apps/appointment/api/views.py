from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
import datetime
from django_filters import rest_framework as filters
from apps.account.permissions import AccessLevelPermission, query_set_filter_key

from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from apps.appointment.api.filters import QueueFilter
from apps.appointment.models import Queue, Appointment
from apps.appointment.api.serializers import QueueSerializer, AppointmentSerializer


class QueueListCreateView(ListCreateAPIView):
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = QueueFilter


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
        start_time = serializer.validated_data['start_time']

        if queue.status != 'active':
            raise ValidationError("این صف فعال نیست و نمی‌توان نوبت رزرو کرد.")

        if not queue.is_time_valid(start_time):
            raise ValidationError("زمان درخواست شده با بازه زمانی صف هماهنگ نیست.")

        serializer.save()

class AppointmentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
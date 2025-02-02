from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
import datetime
from datetime import datetime, timedelta
from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.account.api.serializers import UserSummerySerializer
from apps.account.permissions import AccessLevelPermission, query_set_filter_key

from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from apps.appointment.api.filters import QueueFilter, AppointmentFilter
from apps.appointment.models import Queue, Appointment
from apps.appointment.api.serializers import QueueSerializer, AppointmentSerializer, AppointmentListSerializer


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


class AvailableAppointmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        experiment_id = request.query_params.get('experiment_id')

        if not start_date or not end_date:
            return Response({"error": "start_date و end_date الزامی هستند."}, status=400)

        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

        queues = Queue.objects.filter(date__range=[start_date, end_date])

        if experiment_id:
            queues = queues.filter(experiment_id=experiment_id)

        reserved_appointments = Appointment.objects.filter(queue__in=queues).select_related('reserved_by')

        reserved_map = {
            (appt.queue_id, appt.start_time): appt for appt in reserved_appointments
        }

        all_appointments = []

        for queue in queues:
            current_time = queue.start_time
            while current_time < queue.end_time:
                end_time = (datetime.combine(datetime.today(), current_time) +
                            timedelta(minutes=queue.time_unit)).time()

                is_in_break_time = False
                if queue.break_start and queue.break_end:
                    if not (end_time <= queue.break_start or current_time >= queue.break_end):
                        is_in_break_time = True

                appointment_key = (queue.id, current_time)
                reserved_appt = reserved_map.get(appointment_key)

                reserved_by = reserved_appt.reserved_by.id if reserved_appt and reserved_appt.reserved_by else None
                reserved_by_obj = UserSummerySerializer(reserved_appt.reserved_by).data if reserved_appt and reserved_appt.reserved_by else None

                status = "reserved" if reserved_appt else "free"

                if not is_in_break_time:
                    all_appointments.append({
                        "queue_id": queue.id,
                        "date": queue.date,
                        "start_time": current_time,
                        "end_time": end_time,
                        "status": status,
                        "reserved_by": reserved_by,
                        "reserved_by_obj": reserved_by_obj
                    })

                current_time = end_time

        serializer = AppointmentListSerializer(all_appointments, many=True)
        return Response(serializer.data)
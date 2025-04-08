from rest_framework import serializers

from apps.account.api.serializers import UserSummerySerializer
from apps.appointment.models import Queue, Appointment
from datetime import datetime, timedelta, time

from apps.lab.models import WorkflowStep


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
    queue_id = serializers.IntegerField()
    date = serializers.DateField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    status = serializers.CharField()
    request_id = serializers.IntegerField(allow_null=True)
    request_status = serializers.CharField()
    reserved_by = serializers.IntegerField(allow_null=True)
    reserved_by_obj = UserSummerySerializer(allow_null=True)


class WorkflowStepSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkflowStep
        fields = ["id", "name", "description", "step_color"]


class AppointmentSerializer(serializers.ModelSerializer):
    reserved_by_obj = UserSummerySerializer(read_only=True, source='reserved_by')
    extra_fields = serializers.SerializerMethodField(read_only=True)
    end_time = serializers.SerializerMethodField(read_only=True)
    date = serializers.SerializerMethodField(read_only=True)
    request_status = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'

    def validate(self, data):
        queue = data['queue']
        start_time = data['start_time']
        reserved_by = data['reserved_by']
        experiment = queue.experiment
        request = self.context.get('request')

        if queue.status != 'active':
            raise serializers.ValidationError({"queue": "این صف فعال نیست و نمی‌توان نوبت رزرو کرد."})


        if experiment.appointment_limit_hours > 0:
            limit_date = datetime.now().date() - timedelta(days=30)

            previous_appointments = Appointment.objects.filter(
                queue__experiment=experiment,
                reserved_by=reserved_by,
                queue__date__gte=limit_date,
                status='reserved'
            )

            total_reserved_minutes = 0
            for appointment in previous_appointments:
                total_reserved_minutes += queue.time_unit

            total_reserved_hours = total_reserved_minutes / 60

            if total_reserved_hours >= experiment.appointment_limit_hours:
                raise serializers.ValidationError({
                    "error": f"شما نمی‌توانید بیشتر از {experiment.appointment_limit_hours} ساعت نوبت برای این آزمایش در ۳۰ روز گذشته داشته باشید."
                })

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

        if experiment.need_turn and experiment.prepayment_amount > 0:
            data['status'] = 'pending'
            request.has_prepayment = True
            request.save()
        else:
            data['status'] = 'reserved'

        return data

    def get_request_status(self, obj):
        return WorkflowStepSerializer(obj.request.lastest_status().step).data

    def get_end_time(self, obj):
        return obj.end_time()

    def get_date(self, obj):
        return obj.date()

    def get_extra_fields(self, obj):
        if obj.request:
            request_id = obj.request.id
            request_number = obj.request.request_number
            if obj.request.parent_request:
                request_parent_number = obj.request.parent_request.request_number
            else:
                request_parent_number = None
        else:
            request_id = None
            request_number = None
            request_parent_number = None
        if obj.queue.experiment:
            experiment_name = obj.queue.experiment.name
        else:
            experiment_name = None

        queue_status = obj.queue.status

        data = {
            'request_id': request_id,
            'request_number': request_number,
            'request_parent_number': request_parent_number,
            'experiment_name': experiment_name,
            'queue_status': queue_status,
        }
        return data

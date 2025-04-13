from celery import shared_task
from datetime import datetime, timedelta
from apps.appointment.models import Appointment
from django.utils.timezone import make_aware

from apps.lab.models import Request


@shared_task
def check_and_process_pending_appointment(request_id):
    try:
        request = Request.objects.get(id=request_id)

        if request.has_prepayment == True:
            request.prepayment_canceled()
            return f"Request {request.id} has been canceled due to no payment."

    except Appointment.DoesNotExist:
        return f"Request {request_id} does not exist."
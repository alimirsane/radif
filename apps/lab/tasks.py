from celery import shared_task
from datetime import datetime, timedelta
from apps.appointment.models import Appointment
from django.utils.timezone import make_aware
import logging
logger = logging.getLogger(__name__)
from apps.lab.models import Request


@shared_task
def check_and_process_pending_appointment(request_id):
    try:
        request = Request.objects.get(id=request_id)

        if request.has_prepayment:
            request.prepayment_canceled()
            logger.warning(f"Request {request.id} canceled due to no payment.")
            return f"Request {request.id} canceled."

        logger.info(f"Request {request.id} already paid.")
        return f"Request {request.id} already paid."

    except Request.DoesNotExist:
        logger.error(f"Request {request_id} does not exist.")
        return f"Request {request_id} not found."
    except Exception as e:
        logger.error(f"Request Error: {e}.")
        return f"Request Error: {e}."

@shared_task
def check_pending_appointment(appointment_id):
    try:
        appointment = Appointment.objects.get(pk=appointment_id)
        request = appointment.request

        if request.has_prepayment or (not request.has_prepayment and not request.is_completed):
            appointment.delete()
            logger.warning(f"Appointment {appointment.id} canceled due to no payment.")
            return f"Appointment {appointment.id} canceled."

        logger.info(f"Appointment {appointment.id} already paid.")
        return f"Appointment {appointment.id} already paid."

    except Exception as e:
        logger.error(f"Appointment Error: {e}.")
        return f"Appointment Error: {e}."

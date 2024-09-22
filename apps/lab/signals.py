import jdatetime
from django.db.models import Sum
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.account.models import Notification
from apps.lab.models import FormResponse, Request, Status

processing_request_signal = False
processing_formresponse_signal = False

@receiver(post_save, sender=Request)
def create_form_responses(sender, instance, created, **kwargs):
    global processing_request_signal

    if created or processing_request_signal:
        return

    processing_request_signal = True
    try:
        if not instance.sample_check and instance.is_completed:
            form_responses = FormResponse.objects.filter(request=instance, is_main=True)
            for form_response in form_responses:
                copies_needed = form_response.response_count - 1
                main_response = form_response
                if copies_needed > 0 and not form_response.copy_check:
                    for _ in range(copies_needed):
                        new_response = FormResponse.objects.create(request=main_response.request,
                                                                    form_number=main_response.form_number,
                                                                    response=main_response.response,
                                                                    response_json=main_response.response_json,
                                                                    is_main=False,
                                                                    parent=main_response)

            form_responses.update(copy_check=True)
            instance.sample_check = True
            instance.save()
    finally:
        processing_request_signal = False


@receiver(post_save, sender=FormResponse)
def create_form_number(sender, instance, created, **kwargs):
    global processing_formresponse_signal

    if processing_formresponse_signal:
        return

    processing_formresponse_signal = True
    try:
        if created or not instance.form_number:
            instance.set_form_number()
        instance.request.set_price()
    finally:
        processing_formresponse_signal = False


@receiver(post_save, sender=Request)
def create_request_number(sender, instance, created, **kwargs):
    global processing_request_signal

    if created or processing_request_signal:
        return

    processing_request_signal = True
    try:
        if not instance.request_number:
            date_code = jdatetime.datetime.now().strftime('%Y%m')
            month_code = instance.current_month_counter() + 1
            instance.request_number = f'{date_code[1:]}-{month_code:04d}'
            instance.save()
    finally:
        processing_request_signal = False

#
# @receiver(post_save, sender=Request)
# def create_form_responses(sender, instance, created, **kwargs):
#     if created:
#         return
#     if not instance.sample_check and instance.is_completed:
#         form_responses = FormResponse.objects.filter(request=instance, is_main=True)
#         for form_response in form_responses:
#             copies_needed = form_response.response_count - 1
#             if copies_needed > 0 and not form_response.copy_check:
#                 for _ in range(copies_needed):
#                     new_response = form_response
#                     new_response.pk = None
#                     new_response.is_main = False
#                     new_response.save()
#         form_responses.update(copy_check=True)
#         instance.sample_check = True
#         instance.save()
#
#
# @receiver(post_save, sender=FormResponse)
# def create_form_number(sender, instance, created, **kwargs):
#     if created or not instance.form_number:
#         instance.set_form_number()
#     instance.request.set_price()
#
#
# @receiver(post_save, sender=Request)
# def create_form_number(sender, instance, created, **kwargs):
#     if created or not instance.request_number:
#         date_code = jdatetime.datetime.now().strftime('%Y%m')
#         mounth_code = instance.current_month_counter() + 1
#         instance.request_number = f'{date_code[1:]}-{mounth_code:04d}'
#         instance.save()

@receiver(post_save, sender=Status)
def set_request_status_notification(sender, instance, created, **kwargs):
    if created and instance.request.is_completed:
        Notification.objects.create(user=instance.request.owner, type='info', title='تغییر وضعیت درخواست', content=f'وضعیت درخواست شماره {instance.step.name} به {instance.request.request_number} تغییر کرد')
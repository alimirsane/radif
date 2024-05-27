import jdatetime
from django.db.models import Sum
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.lab.models import FormResponse, Request


@receiver(post_save, sender=FormResponse)
def create_form_number(sender, instance, created, **kwargs):
    if created or not instance.form_number:
        date_code = jdatetime.datetime.now().strftime('%y%m')
        request_code = str(instance.request.id)
        object_id = str(instance.id)
        instance.form_number = f'{date_code}-{request_code}-{object_id}'
        instance.save()


@receiver(post_save, sender=Request)
def create_form_number(sender, instance, created, **kwargs):
    if created or not instance.request_number:
        date_code = jdatetime.datetime.now().strftime('%Y%m')
        object_id = str(instance.id)
        instance.request_number = f'{date_code}-{object_id}'
        instance.save()
#
#
# @receiver(post_save, sender=FormResponse)
# def set_request_price(sender, instance, created, **kwargs):
#     if instance.request.parameter.count() >= 0:
#         if instance.request.formresponse.count() > 0:
#             params = instance.request.parameter.all()
#             formresponses = instance.request.formresponse.all()
#             temp = formresponses.count()/int(params.first().unit_value)
#             price = params.aggregate(Sum('price'))['price__sum'] * int(temp)
#             price = params.aggregate(Sum('price'))['price__sum'] * int(temp)
#             instance.request.price = price
#             instance.request.save()


import jdatetime
from django.db.models import Sum
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.account.models import Notification
from apps.lab.models import FormResponse, Request, Status


@receiver(post_save, sender=FormResponse)
def create_form_number(sender, instance, created, **kwargs):
    if created or not instance.form_number:
        instance.set_form_number()


@receiver(post_save, sender=Request)
def create_form_number(sender, instance, created, **kwargs):
    if created or not instance.request_number:
        date_code = jdatetime.datetime.now().strftime('%Y%m')
        mounth_code = instance.current_month_counter() + 1
        instance.request_number = f'{date_code[1:]}-{mounth_code:04d}'
        instance.save()
    # if created:
    #     Notification.objects.create(user=instance.owner, type='info', title='تغییر وضعیت درخواست',
    #                                 content=f'وضعیت درخواست شماره {instance.step.name} به {instance.request.request_number} تغییر کرد')
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

@receiver(post_save, sender=Status)
def set_request_status_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(user=instance.request.owner, type='info', title='تغییر وضعیت درخواست', content=f'وضعیت درخواست شماره {instance.step.name} به {instance.request.request_number} تغییر کرد')
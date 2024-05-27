import datetime
import os
from time import time
import requests
import json
from django.conf import settings
from openpyxl import Workbook
from django.http import JsonResponse
from django.db.models import QuerySet
from apps.account.models import GrantRequest, User
from apps.lab.models import Request
from apps.order.models import PaymentRecord


def labsnet(nid, type, service):
    data = {"user_name": "sharif_uni", "password": "sharif_uni", "national_code": nid, "type": type, "services": service}
    response = requests.post('https://labsnet.ir/api/credit_list', data=data, verify=False)
    response_text = '{"customer_name":"\\u0645\\u062d\\u0633\\u0646 \\u0686\\u06af\\u0646\\u06cc","credits":[]}'
    json.loads(response_text)


def export_excel(queryset):
    if isinstance(queryset, QuerySet) and queryset.model == Request:
        row_list, columns, sheet_title = request()
    if isinstance(queryset, QuerySet) and queryset.model == GrantRequest:
        row_list, columns, sheet_title = grant_request()
    if isinstance(queryset, QuerySet) and queryset.model == User:
        row_list, columns, sheet_title = user()
    if isinstance(queryset, QuerySet) and queryset.model == PaymentRecord:
        row_list, columns, sheet_title = payment_record()
    workbook = Workbook()
    worksheet = workbook.active
    worksheet.title = sheet_title

    row_num = 1

    for col_num, column_title in enumerate(columns, 1):
        cell = worksheet.cell(row=row_num, column=col_num)
        cell.value = column_title

    for obj in queryset.all():
        row_num += 1
        row = row_list(obj)

        for col_num, cell_value in enumerate(row, 1):
            cell = worksheet.cell(row=row_num, column=col_num)
            cell.value = cell_value

    p2_name = os.path.join('exports', sheet_title, f'{sheet_title}-{datetime.datetime.now().strftime("%y%m%d-%H:%M:%S")}.xlsx')
    file_path = os.path.join(settings.MEDIA_ROOT, p2_name)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    workbook.save(file_path)


    file_url = os.path.join(settings.MEDIA_URL, p2_name)
    return file_url


def payment_record_row_list(payment_record):
    datetime_format = '%Y/%m/%d-%H:%M:%S'

    return [
        payment_record.payer.get_full_name(),
        # payment_record.order,
        payment_record.payment_type,
        payment_record.amount,
        payment_record.successful,
        payment_record.charged,
        payment_record.transaction_code,
        payment_record.tref,
        payment_record.payment_order_guid,
        payment_record.payment_order_id,
        payment_record.payment_link,
        payment_record.called_back,
        payment_record.log_text,
        payment_record.created_at.strftime(datetime_format) if payment_record.created_at else None,
        payment_record.updated_at.strftime(datetime_format) if payment_record.updated_at else None,

    ]


def payment_record():
    return payment_record_row_list, [
            'payer',
            # 'order',
            'payment_type',
            'amount',
            'successful',
            'charged',
            'transaction_code',
            'tref',
            'payment_order_guid',
            'payment_order_id',
            'payment_link',
            'called_back',
            'log_text',
            'created_at',
            'updated_at'
        ], 'Payment'


def grant_request_row_list(grant_request):
    datetime_format = '%Y/%m/%d-%H:%M:%S'
    return [
        grant_request.sender.get_full_name(),
        grant_request.receiver.get_full_name(),
        grant_request.requested_amount if grant_request.requested_amount else None,
        grant_request.approved_amount if grant_request.approved_amount else None,
        grant_request.approved_datetime.strftime(datetime_format) if grant_request.approved_datetime else None,
        grant_request.datetime.strftime(datetime_format) if grant_request.datetime else None,
        grant_request.expiration_date.strftime(datetime_format) if grant_request.expiration_date else None,
        # grant_request.transaction.amount,
        grant_request.status,
    ]


def grant_request():
    return grant_request_row_list, [
            'sender',
            'receiver',
            'requested_amount',
            'approved_amount',
            'approved_datetime',
            'datetime',
            'expiration_date',
            # 'transaction',
            'status',
        ], 'GrantRequest'


def request():
    return request_row_list, [
            'owner',
            'experiment',
            'parameter',
            'price',
            'is_urgent',
            'delivery_date',
            'description',
            'subject',
            'request_number',
            'is_completed',
            'created_at',
            'updated_at',
        ], 'Request'

def request_row_list(request):
    datetime_format = '%Y/%m/%d-%H:%M:%S'
    return [
        request.owner.get_full_name(),
        request.experiment.name,
        request.parameter.name if request.parameter else None,
        request.price if request.price else None,
        request.is_urgent,
        request.delivery_date.strftime(datetime_format) if request.delivery_date else None,
        request.description if request.description else None,
        request.subject if request.subject else None,
        request.request_number if request.request_number else None,
        request.is_completed,
        request.created_at.strftime(datetime_format) if request.created_at else None,
        request.updated_at.strftime(datetime_format) if request.updated_at else None,
    ]

def user():
    return user_row_list, [
            'user_type',
            'account_type',
            'national_id',
            'role',
            'access_level',
            'balance',
        ], 'User'

def user_row_list(user):
    datetime_format = '%Y/%m/%d-%H:%M:%S'
    return [
        user.user_type,
        user.account_type,
        user.national_id,
        user.role,
        user.access_level,
        user.balance,
    ]
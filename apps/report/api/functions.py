import pandas as pd
from django.db.models import Sum
from apps.lab.models import *
from apps.account.models import *
from django.utils.timezone import is_aware
from django.conf import settings
import os
from datetime import datetime

from apps.order.models import PaymentRecord


def generate_excel_report():
    data = []

    # Fetch all parent requests
    parent_requests = Request.objects.filter(has_parent_request=False)

    for parent_request in parent_requests:
        # Gather parent request data
        parent_data = {
            'Parent Request Number': parent_request.request_number,
            'Parent Owner': parent_request.owner.get_full_name(),
            'Parent Experiment': parent_request.experiment.name,
            'Parent Price': parent_request.price,
            'Parent Discount': parent_request.discount,
            'Parent Created At': parent_request.created_at.replace(tzinfo=None) if is_aware(
                parent_request.created_at) else parent_request.created_at,
            "نام سازمان": parent_request.owner.company_name if parent_request.owner.account_type == 'business' else "",
            "شخصیت مشتری": parent_request.owner.account_type,
            "نوع مشتری": "دانشجو" if parent_request.owner.is_sharif_student else "سایر",
            "نام مشتری/نماینده قانونی": parent_request.owner.first_name,
            "نام خانوادگی مشتری/نماینده قانونی": parent_request.owner.last_name,
            "کدملی مشتری/نماینده قانونی": parent_request.owner.national_id,
            "شناسه ملی سازمان": parent_request.owner.company_national_id if parent_request.owner.account_type == 'business' else "",
            "کد اقتصادی سازمان مشتری": parent_request.owner.company_economic_number if parent_request.owner.account_type == 'business' else "",
            "شماره همراه مشتری/نماینده قانونی": parent_request.owner.username,
            "ایمیل مشتری": parent_request.owner.email,
            "نام آزمایشگاه": parent_request.experiment.laboratory.name,
            "کد کنترلی آزمایشگاه": parent_request.experiment.laboratory.control_code,
            "نام و نام اختصاری نوع دستگاه": parent_request.experiment.device.name,
            "برند و مدل دستگاه": parent_request.experiment.device.model,
            "کد کنترلی دستگاه": parent_request.experiment.device.control_code,
            "نام آزمون": parent_request.experiment.name,
            "کد کنترلی آزمون": parent_request.experiment.control_code,
            "نام استاندارد": "استاندارد مربوطه",  # مقدار پیش‌فرض
            "کد کنترلی استاندارد": "کد استاندارد",  # مقدار پیش‌فرض
            "نام پارامتر": "پارامتر مربوطه",  # مقدار پیش‌فرض
            "نام اپراتور": parent_request.experiment.operator.first_name if parent_request.experiment.operator else "",
            "نام مدیر آزمایشگاه": parent_request.experiment.laboratory.technical_manager.first_name if parent_request.experiment.laboratory.technical_manager else "",
            "تعداد نمونه": parent_request.parameter.count(),
            "تاریخ دریافت نمونه": parent_request.created_at.date() if parent_request.created_at else "",
            "نوع واحد آزمون(مبنای تعیین تعرفه)": parent_request.experiment.test_unit_type,
            "تعرفه پارامتر": "",  # مقدار پیش‌فرض
            "هزینه کل آزمون": parent_request.price_wod,
            "درصد تخفیف": parent_request.discount,
            "مبلغ تخفیف": parent_request.price_wod - parent_request.price if parent_request.price_wod and parent_request.price else 0,
            "هزینه کل آزمون بعد از کسر تخفیف": parent_request.price,
            "نوع گرنت 1": parent_request.grant_request1 if parent_request.grant_request1 else "",
            "مبلغ گرنت 1": parent_request.grant_request1.approved_amount if parent_request.grant_request1 else 0,
            "نوع گرنت 2": parent_request.grant_request2 if parent_request.grant_request2 else "",
            "مبلغ گرنت 2": parent_request.grant_request2.approved_amount if parent_request.grant_request2 else 0,
            "نوع گرنت 3": "",  # مقدار پیش‌فرض
            "مبلغ گرنت 3": 0,  # مقدار پیش‌فرض
            "نوع گرنت 4": "",  # مقدار پیش‌فرض
            "مبلغ گرنت 4": 0,  # مقدار پیش‌فرض
            "نوع گرنت 5": "",  # مقدار پیش‌فرض
            "مبلغ گرنت 5": 0,  # مقدار پیش‌فرض
            "مجموع مبلغ گرنت": sum([
                parent_request.grant_request1.approved_amount if parent_request.grant_request1 else 0,
                parent_request.grant_request2.approved_amount if parent_request.grant_request2 else 0
            ]),
            # "مبلغ کل پرداختی": parent_request.price - sum([
            #     parent_request.grant_request1.approved_amount if parent_request.grant_request1 else 0,
            #     parent_request.grant_request2.approved_amount if parent_request.grant_request2 else 0
            # ]),
            "مبلغ کل پرداختی": parent_request.price,
            "نوع پرداخت 1": "",  # مقدار پیش‌فرض
            "مبلغ پرداخت 1": 0,  # مقدار پیش‌فرض
            "شماره تراکنش 1": "",  # مقدار پیش‌فرض
            "تاریخ پرداخت 1": "",  # مقدار پیش‌فرض
            "نوع پرداخت 2": "",  # مقدار پیش‌فرض
            "مبلغ پرداخت 2": 0,  # مقدار پیش‌فرض
            "شماره تراکنش 2": "",  # مقدار پیش‌فرض
            "تاریخ پرداخت 2": "",  # مقدار پیش‌فرض
            "نوع پرداخت 3": "",  # مقدار پیش‌فرض
            "مبلغ پرداخت 3": 0,  # مقدار پیش‌فرض
            "شماره تراکنش 3": "",  # مقدار پیش‌فرض
            "تاریخ پرداخت 3": "",  # مقدار پیش‌فرض
            "نوع پرداخت 4": "",  # مقدار پیش‌فرض
            "مبلغ پرداخت 4": 0,  # مقدار پیش‌فرض
            "شماره تراکنش 4": "",  # مقدار پیش‌فرض
            "تاریخ پرداخت 4": "",  # مقدار پیش‌فرض
            "نوع پرداخت 5": "",  # مقدار پیش‌فرض
            "مبلغ پرداخت 5": 0,  # مقدار پیش‌فرض
            "شماره تراکنش 5": "",  # مقدار پیش‌فرض
            "تاریخ پرداخت 5": "",  # مقدار پیش‌فرض
            "تاریخ ثبت موقت درخواست": parent_request.created_at.date() if parent_request.created_at else "",
            "تاریخ ثبت نهایی درخواست": parent_request.updated_at.date() if parent_request.updated_at else "",
            "تاریخ تعهد تحویل به مشتری": parent_request.delivery_date,
            "تاریخ انجام آزمون توسط اپراتور": "",  # مقدار پیش‌فرض
            "تاریخ تایید مدیر آزمایشگاه": "",  # مقدار پیش‌فرض
            "مهلت زمانی توقف به روز(از تاریخ ثبت اولیه درخواست تا تاریخ ثبت نهایی)": "",
                # (parent_request.updated_at - parent_request.created_at).days if parent_request.updated_at and parent_request.created_at else 0,
            "مهلت زمانی مقرر به روز(از تاریخ ثبت نهایی تا تاریخ تعهد تحویل به مشتری)": "",
                # (parent_request.delivery_date - parent_request.updated_at.date()).days if parent_request.delivery_date and parent_request.updated_at else 0,
            "مدت زمان توقف به روز(از تاریخ ثبت نهایی تا تاریخ تایید مدیر آز)": 0,  # مقدار پیش‌فرض
            "مدت زمان تاخیر به روز (مدت زمان توقف از مهلت زمانی مقرر کسر شود)": 0,  # مقدار پیش‌فرض
            "شماره درخواست": parent_request.request_number,
            "وضعیت": parent_request.lastest_status().step.name if parent_request.lastest_status() else "",
            "نام هماهنگ کننده": parent_request.owner.first_name if parent_request.owner else "",
        }

        # Fetch child requests for the parent request
        child_requests = parent_request.child_requests.all()

        for child_request in child_requests:
            # Gather child request data
            child_data = {
                'Child Request Number': child_request.request_number,
                'Child Owner': child_request.parent_request.owner.get_full_name(),
                'Child Experiment': child_request.experiment.name,
                'Child Price': child_request.price,
                'Child Discount': child_request.discount,
                'Child Created At': child_request.created_at.replace(tzinfo=None) if is_aware(
                    child_request.created_at) else child_request.created_at,
            }

            # Combine parent and child data
            combined_data = {**parent_data, **child_data}

            # Fetch parameters for the child request
            parameters = child_request.parameter.all()
            parameters_list = [param.name for param in parameters]
            combined_data['Parameters'] = ", ".join(parameters_list)

            # Fetch transactions for the parent request
            transactions = GrantTransaction.objects.filter(grant_record__receiver=parent_request.owner)
            transactions_total = transactions.aggregate(total_amount=Sum('amount'))['total_amount'] or 0
            combined_data['Parent Transactions Total'] = transactions_total

            transactions = PaymentRecord.objects.filter(order__request=parent_request)
            transactions_total = transactions.aggregate(total_amount=Sum('amount'))['total_amount'] or 0
            combined_data['Parent PaymentRecord Total'] = transactions_total

            # Add row to data
            data.append(combined_data)

    # Convert data to pandas DataFrame
    df = pd.DataFrame(data)

    # Ensure the report is saved in the media folder
    media_path = os.path.join(settings.MEDIA_ROOT, 'reports')
    os.makedirs(media_path, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    file_path = os.path.join(media_path, f'parent_child_report_{timestamp}.xlsx')

    # Save to Excel file
    df.to_excel(file_path, index=False)
    return file_path


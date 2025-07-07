from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from apps.account.permissions import AccessLevelPermission, query_set_filter_key
from django.db.models import Sum
import datetime
import pandas as pd
from django.http import HttpResponse
from django.utils.timezone import make_aware
from apps.lab.models import Laboratory, Request
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import os
from .functions import generate_excel_report


class ExcelReportAPIView(APIView):

    """
    API endpoint to generate and provide a link to the Excel report.
    """
    def get(self, request, format=None):
        try:
            # Generate the report
            report_path = generate_excel_report()

            # Construct the full URL for the file
            relative_file_path = os.path.relpath(report_path, settings.MEDIA_ROOT)
            file_url = request.build_absolute_uri(
                os.path.join(settings.MEDIA_URL, relative_file_path).replace('\\', '/')
            )


            return Response(
                {
                    "status": "success",
                    "data": {"url": file_url},
                    "message": "Request successful"
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "errors": {"error": str(e)},
                    "message": "Request failed"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LaboratoryExcelReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            lab_id = request.query_params.get('lab_id')
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')

            try:
                if start_date:
                    start_date = make_aware(datetime.datetime.strptime(start_date, '%Y-%m-%d'))
                if end_date:
                    end_date = make_aware(datetime.datetime.strptime(end_date, '%Y-%m-%d') + datetime.timedelta(days=1))
            except Exception:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            labs = Laboratory.objects.all()
            if lab_id:
                labs = labs.filter(id=lab_id)

            data = []
            for lab in labs:
                requests = Request.objects.filter(
                    experiment__laboratory=lab,
                    is_completed=True,
                    parent_request__isnull=True,
                    request_status__step__id__exact=8
                ).distinct()

                if start_date:
                    requests = requests.filter(created_at__gte=start_date)
                if end_date:
                    requests = requests.filter(created_at__lt=end_date)

                parent_requests = requests.filter(parent_request__isnull=True)
                total_income = requests.aggregate(total=Sum('price'))['total'] or 0
                total_income_wod = requests.aggregate(total=Sum('price_wod'))['total'] or 0
                total_grant_request_discount = requests.aggregate(total=Sum('grant_request_discount'))['total'] or 0
                total_labsnet_discount = requests.aggregate(total=Sum('labsnet_discount'))['total'] or 0
                total_request = requests.filter(parent_request__isnull=True).count()
                total_samples = sum(req.get_child_form_responses_count() for req in requests)
                operators = ', '.join([operator.get_full_name() for operator in lab.operators.all()])

                data.append({
                    'نام آزمایشگاه': lab.name,
                    'مدیر فنی': str(lab.technical_manager.get_full_name()) if lab.technical_manager else '',
                    'اپراتور': str(operators),
                    'تعداد درخواست': total_request,
                    'تعداد نمونه': total_samples,
                    'درآمد ناخالص': total_income_wod,
                    'درآمد': total_income,
                    'لبزنت': total_labsnet_discount,
                    'پژوهشی': total_grant_request_discount,
                })

            df = pd.DataFrame(data)
            now_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f'laboratory_report_{now_str}.xlsx'
            full_path = os.path.join(settings.MEDIA_ROOT, 'reports', filename)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)

            with pd.ExcelWriter(full_path, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='گزارش آزمایشگاه‌ها')

            relative_path = os.path.relpath(full_path, settings.MEDIA_ROOT)
            file_url = request.build_absolute_uri(
                os.path.join(settings.MEDIA_URL, relative_path).replace('\\', '/')
            )

            return Response(
                {
                    "status": "success",
                    "data": {"url": file_url},
                    "message": "گزارش با موفقیت تولید شد"
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "errors": {"error": str(e)},
                    "message": "خطا در تولید گزارش"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LaboratoryOperatorExcelReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            lab_id = request.query_params.get('lab_id')
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')

            try:
                if start_date:
                    start_date = make_aware(datetime.datetime.strptime(start_date, '%Y-%m-%d'))
                if end_date:
                    end_date = make_aware(datetime.datetime.strptime(end_date, '%Y-%m-%d') + datetime.timedelta(days=1))
            except Exception:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            labs = Laboratory.objects.all()
            if lab_id:
                labs = labs.filter(id=lab_id)

            data = []
            for lab in labs:
                requests = Request.objects.filter(
                    experiment__laboratory=lab,
                    is_completed=True,
                    parent_request__isnull=True,
                    request_status__step__id__exact=8
                ).distinct()

                if start_date:
                    requests = requests.filter(created_at__gte=start_date)
                if end_date:
                    requests = requests.filter(created_at__lt=end_date)

                for operator in lab.operators.all():
                    op_requests = requests.filter(
                        request_status__step__id=6,
                        request_status__action_by=operator
                    ).distinct()
                    total_income = op_requests.aggregate(total=Sum('price'))['total'] or 0
                    total_income_wod = op_requests.aggregate(total=Sum('price_wod'))['total'] or 0
                    total_grant_request_discount = op_requests.aggregate(total=Sum('grant_request_discount'))['total'] or 0
                    total_labsnet_discount = op_requests.aggregate(total=Sum('labsnet_discount'))['total'] or 0
                    total_request = op_requests.count()
                    total_samples = sum(req.get_child_form_responses_count() for req in op_requests)

                    data.append({
                        'نام آزمایشگاه': lab.name,
                        'اپراتور': operator.get_full_name(),
                        'تعداد درخواست': total_request,
                        'تعداد نمونه': total_samples,
                        'درآمد ناخالص': total_income_wod,
                        'درآمد': total_income,
                        'لبزنت': total_labsnet_discount,
                        'پژوهشی': total_grant_request_discount,
                    })

            df = pd.DataFrame(data)
            now_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f'laboratory_operator_report_{now_str}.xlsx'
            full_path = os.path.join(settings.MEDIA_ROOT, 'reports', filename)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)

            with pd.ExcelWriter(full_path, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='گزارش اپراتورها')

            relative_path = os.path.relpath(full_path, settings.MEDIA_ROOT)
            file_url = request.build_absolute_uri(
                os.path.join(settings.MEDIA_URL, relative_path).replace('\\', '/')
            )

            return Response(
                {
                    "status": "success",
                    "data": {"url": file_url},
                    "message": "گزارش اپراتورها با موفقیت تولید شد"
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "errors": {"error": str(e)},
                    "message": "خطا در تولید گزارش"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
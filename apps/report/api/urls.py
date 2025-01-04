from django.urls import path
from apps.report.api.views import ExcelReportAPIView

urlpatterns = [
    path('main_excel/', ExcelReportAPIView.as_view(), name='main-excel-report-api'),

]

from django.urls import path
from apps.report.api.views import ExcelReportAPIView, LaboratoryExcelReportAPIView

urlpatterns = [
    path('main_excel/', ExcelReportAPIView.as_view(), name='main-excel-report-api'),
    path('lab_excel/', LaboratoryExcelReportAPIView.as_view(), name='lab-excel-report-api'),

]

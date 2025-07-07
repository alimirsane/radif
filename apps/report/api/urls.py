from django.urls import path
from apps.report.api.views import ExcelReportAPIView, LaboratoryExcelReportAPIView, LaboratoryOperatorExcelReportAPIView

urlpatterns = [
    path('main_excel/', ExcelReportAPIView.as_view(), name='main-excel-report-api'),
    path('lab_excel/', LaboratoryExcelReportAPIView.as_view(), name='lab-excel-report-api'),
    path('lab_opr_excel/', LaboratoryOperatorExcelReportAPIView.as_view(), name='lab_opr-excel-report-api'),

]

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from apps.account.permissions import AccessLevelPermission, query_set_filter_key

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

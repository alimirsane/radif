from django.urls import path

from apps.appointment.api.views import QueueListCreateView, QueueDetailView, AppointmentListCreateView, \
    AppointmentDetailView
from apps.form.api.views import FormListAPIView, FormDetailAPIView

urlpatterns = [
    path('queues/', QueueListCreateView.as_view(), name='queue-list'),
    path('queues/<int:pk>/', QueueDetailView.as_view(), name='queue-detail'),
    path('appointments/', AppointmentListCreateView.as_view(), name='appointment-list'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
]

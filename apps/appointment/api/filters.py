from django_filters import rest_framework as filters
from apps.appointment.models import Queue


class QueueFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="date", lookup_expr="gte")
    end_date = filters.DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = Queue
        fields = ['experiment', 'start_date', 'end_date']

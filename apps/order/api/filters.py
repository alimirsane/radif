import django_filters

from apps.lab.models import Request

class PaymentRecordFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name='created_at', lookup_expr='gte', label='filter by created_at')  # lookup_expr='icontains',
    end_date = django_filters.DateFilter(field_name='created_at', lookup_expr='lte', label='filter by created_at')  # lookup_expr='icontains',

    search = django_filters.CharFilter(method='request_search')

    class Meta:
        model = Request
        fields = ['start_date', 'end_date', 'search']
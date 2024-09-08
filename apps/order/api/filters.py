import django_filters

from apps.order.models import PaymentRecord


class PaymentRecordFilter(django_filters.FilterSet):
    start_date = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte', label='filter by created_at')  # lookup_expr='icontains',
    end_date = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte', label='filter by created_at')  # lookup_expr='icontains',

    search = django_filters.CharFilter(method='request_search')

    class Meta:
        model = PaymentRecord
        fields = ['start_date', 'end_date', 'search']
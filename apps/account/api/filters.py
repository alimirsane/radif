import django_filters
from apps.account.models import User


class UserFilter(django_filters.FilterSet):
    user_type = django_filters.CharFilter(field_name='user_type', lookup_expr='exact', label='filter by user type (staff/customer)')  # lookup_expr='icontains',
    account_type = django_filters.CharFilter(field_name='account_type', lookup_expr='exact', label='filter by account type (personal/business)')  # lookup_expr='icontains',
    role = django_filters.CharFilter(field_name='role__id', lookup_expr='exact', label='filter by role id')  # lookup_expr='icontains',
    national_id = django_filters.CharFilter(field_name='national_id', lookup_expr='icontains', label='filter by national id')  # lookup_expr='icontains',

    class Meta:
        model = User
       fields = ['user_type', 'account_type', 'national_id', 'role']

import django_filters
from django.db.models import Q

from apps.lab.models import Parameter, FormResponse, Laboratory


class ParameterFilter(django_filters.FilterSet):
    experiment = django_filters.CharFilter(field_name='experiment__id', lookup_expr='exact', label='filter by experiment id')  # lookup_expr='icontains',

    search = django_filters.CharFilter(method='parameter_search')

    class Meta:
        model = Parameter
        fields = ['experiment', 'search']

    def parameter_search(self, queryset, name, value):
        return queryset.filter(Q(name__icontains=value))


class FormResponseFilter(django_filters.FilterSet):
    request = django_filters.CharFilter(field_name='request_id', lookup_expr='exact', label='filter by experiment id')

    class Meta:
        model = FormResponse
        fields = ['request']


class LaboratoryFilter(django_filters.FilterSet):
    department = django_filters.CharFilter(field_name='department_id', lookup_expr='exact')
    search_department = django_filters.CharFilter(field_name='department_id', lookup_expr='exact')

    search = django_filters.CharFilter(method='lab_search')

    class Meta:
        model = Laboratory
        fields = ['department', 'search_department', 'search']

    def lab_search(self, queryset, name, value):
        return queryset.filter(Q(name__icontains=value) | Q(description__icontains=value))
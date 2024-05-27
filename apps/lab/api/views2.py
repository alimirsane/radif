from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView

from apps.account.permissions import AccessLevelPermission, query_set_filter_key
from apps.lab.api.filters import ParameterFilter, FormResponseFilter, LaboratoryFilter
from apps.lab.models import Experiment, Laboratory, Device, Parameter, Request, Department, FormResponse, LabType, \
    Status, Workflow, RequestResult
from apps.lab.api.serializers import ExperimentSerializer, LaboratorySerializer, DeviceSerializer, ParameterSerializer, \
    RequestListSerializer, RequestDetailSerializer, DepartmentSerializer, LaboratoryDetailSerializer, \
    ExperimentDetailSerializer, \
    FormResponseSerializer, LabTypeSerializer, RequestChangeStatusSerializer, WorkflowSerializer, \
    RequestResultSerializer
from rest_framework.response import Response
from rest_framework import status

class ExperimentListAPIView(ListCreateAPIView):
    queryset = Experiment.objects.all()
    serializer_class = ExperimentSerializer

    # permission and queryset
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_experiment', 'view_owner_experiment', 'create_all_experiment']
    view_key = 'experiment'

    def get_queryset(self):
        filter_key = query_set_filter_key(self.view_key, self.request.user.get_access_levels(), self.required_access_levels, self.request.method)
        queryset = []
        if filter_key == 'all':
            queryset = Experiment.objects.all()
        elif filter_key == 'owner':
            queryset = Experiment.objects.filter(laboratory__technical_manager=self.request.user)
        return queryset


class ExperimentDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Experiment.objects.all()
    serializer_class = ExperimentDetailSerializer

    # permission and queryset
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_experiment', 'view_owner_experiment', 'update_all_experiment', 'update_owner_experiment', 'delete_all_experiment', 'delete_owner_experiment']
    view_key = 'experiment'


class LaboratoryListAPIView(ListCreateAPIView):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer
    filterset_class = LaboratoryFilter

    # permission and filter param
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_laboratory', 'view_owner_laboratory', 'create_all_laboratory']
    view_key = 'laboratory'

    def get_queryset(self):
        filter_key = query_set_filter_key(self.view_key, self.request.user.get_access_levels(), self.required_access_levels, self.request.method)

        if filter_key == 'all':
            queryset = Laboratory.objects.all()
        elif filter_key == 'owner':
            queryset = Laboratory.objects.filter(technical_manager=self.request.user)
        return queryset


class LaboratoryDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratoryDetailSerializer

    # permission and filter param
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_laboratory', 'view_owner_laboratory', 'update_all_laboratory', 'update_owner_laboratory', 'delete_all_laboratory']
    view_key = 'laboratory'


class DeviceListAPIView(ListCreateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    
    # permission and filter param
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_device', 'view_owner_device', 'create_all_device']
    view_key = 'device'

    def get_queryset(self):
        filter_key = query_set_filter_key(self.view_key, self.request.user.get_access_levels(), self.required_access_levels, self.request.method)

        if filter_key == 'all':
            queryset = Device.objects.all()
        elif filter_key == 'owner':
            queryset = Device.objects.filter(laboratory__technical_manager=self.request.user)
        return queryset


class DeviceDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    
    # permission and filter param
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_device', 'view_owner_device', 'update_all_device', 'update_owner_device', 'delete_all_device', 'delete_owner_device']
    view_key = 'device'


class ParameterListAPIView(ListCreateAPIView):
    queryset = Parameter.objects.all()
    serializer_class = ParameterSerializer
    filterset_class = ParameterFilter

    # permission and filter param
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_parameter', 'view_owner_parameter', 'create_all_parameter']
    view_key = 'parameter'

    def get_queryset(self):
        filter_key = query_set_filter_key(self.view_key, self.request.user.get_access_levels(), self.required_access_levels, self.request.method)

        if filter_key == 'all':
            queryset = Parameter.objects.all()
        elif filter_key == 'owner':
            queryset = Parameter.objects.filter(experiment__laboratory__technical_manager=self.request.user)
        return queryset
    

class ParameterDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Parameter.objects.all()
    serializer_class = ParameterSerializer

    # permission and filter param
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_parameter', 'view_owner_parameter', 'update_all_parameter', 'update_owner_parameter',
                              'delete_all_parameter', 'delete_owner_parameter']
    view_key = 'parameter'


class RequestListAPIView(ListCreateAPIView):
    queryset = Request.objects.all().order_by('-created_at')
    serializer_class = RequestListSerializer
    
    
    # permission and filter param
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_request', 'view_owner_request', 'create_all_request']
    view_key = 'request'

    def get_queryset(self):
        filter_key = query_set_filter_key(self.view_key, self.request.user.get_access_levels(), self.required_access_levels, self.request.method)

        if filter_key == 'all':
            queryset = Request.objects.all()
        elif filter_key == 'owner':
            queryset = Request.objects.filter(technical_manager=self.request.user)
        elif filter_key == 'operator':
            queryset = Request.objects.filter(technical_manager=self.request.user).exclude(request_status__step__name__in=['در حال انجام', 'تکمیل شده', 'رد شده'])
        elif filter_key == 'receptor':
            queryset = Request.objects.all().exclude(request_status__step__name__in=['در انتظار بررسی', 'در انتظار پرداخت', 'در ‌انتظار نمونه'])
        return queryset


class RequestDetailAPIView(RetrieveUpdateDestroyAPIView):
    pass
    #     return RequestResult.objects.filter(request__owner=self.request.user)
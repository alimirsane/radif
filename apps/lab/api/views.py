from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView, RetrieveAPIView

from apps.account.permissions import AccessLevelPermission, query_set_filter_key
from apps.core.functions import export_excel
from apps.core.paginations import DefaultPagination
from apps.lab.api.filters import ParameterFilter, FormResponseFilter, LaboratoryFilter, RequestFilter, DeviceFilter, \
    ExperimentFilter
from apps.lab.models import Experiment, Laboratory, Device, Parameter, Request, Department, FormResponse, LabType, \
    Status, Workflow, RequestResult
from apps.lab.api.serializers import ExperimentSerializer, LaboratorySerializer, DeviceSerializer, ParameterSerializer, \
    RequestListSerializer, RequestDetailSerializer, DepartmentSerializer, LaboratoryDetailSerializer, \
    ExperimentDetailSerializer, \
    FormResponseSerializer, LabTypeSerializer, RequestChangeStatusSerializer, WorkflowSerializer, \
    RequestResultSerializer, RequestButtonActionSerializer, RequestCertificateSerializer
from rest_framework.response import Response
from rest_framework import status

class ExperimentListAPIView(ListCreateAPIView):
    queryset = Experiment.objects.all()
    serializer_class = ExperimentSerializer
    filterset_class = ExperimentFilter

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
    filterset_class = DeviceFilter

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
    filterset_class = RequestFilter
    pagination_class = DefaultPagination
    ordering = ('created_at',)

    # permission and filter param
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_request', 'view_owner_request', 'create_all_request',
                              # 'view_receptor_request', 'view_operator_request'
                              ]
    view_key = 'request'

    def get_queryset(self):
        filter_key = query_set_filter_key(self.view_key, self.request.user.get_access_levels(),
                                          self.required_access_levels, self.request.method)
        queryset = []
        if filter_key == 'all':
            queryset = Request.objects.filter(is_completed=True)
        elif filter_key == 'owner':
            queryset = Request.objects.filter(is_completed=True, experiment__laboratory__technical_manager=self.request.user) | Request.objects.filter(is_completed=True, experiment__laboratory__operator=self.request.user)
        # elif filter_key == 'receptor':
        #     queryset = Request.objects.filter(is_completed=True)
        #         # .exclude(request_status__step__name__in=['در حال انجام', 'تکمیل شده', 'رد شده'])
        # elif filter_key == 'operator':
        #     queryset = Request.objects.filter(is_completed=True, experiment__laboratory__technical_manager=self.request.user) | Request.objects.filter(is_completed=True, experiment__laboratory__operator=self.request.user)
        #         # .exclude(request_status__step__name__in=['در انتظار بررسی', 'در انتظار پرداخت', 'در ‌انتظار نمونه'])
        return queryset.distinct()

    # def get(self, request, *args, **kwargs):
    #     get_list = self.list(request, *args, **kwargs)
    #     if self.request.query_params.get('export_excel', 'False').lower() == 'true':
    #         ids = [r.id for r in get_list.data['results'].serializer.instance]
    #         qs = Request.objects.filter(id__in=ids)
    #         file_url = export_excel(qs)
    #         if file_url:
    #             full_url = self.request.build_absolute_uri(file_url)
    #             return Response({'file_url': full_url})
    #         return Response({'error': 'Export failed'}, status=500)
    #     elif self.request.query_params.get('step_counter', 'False').lower() == 'true':
    #         ids = [r.id for r in get_list.data['results'].serializer.instance]
    #         qs = Request.objects.filter(id__in=ids)
    #         # qs = get_list.data['results'].serializer.instance
    #         try:
    #             step_list = []
    #             for step in qs[0].request_status.all().first().step.workflow.steps.all():
    #                 step_dict = {
    #                     'id': step.id,
    #                     'name': step.name,
    #                     'step_color': step.next_button_color,
    #                     # 'request_counter': qs.filter(request_status__id=step.id, request_status__accept=False, request_status__reject=False).count()
    #                     'request_counter': qs.filter(request_status__step__id=step.id, request_status__accept=False,
    #                                                  request_status__reject=False).count()
    #                 }
    #                 step_list.append(step_dict)
    #             return Response(step_list)
    #         except:
    #             return Response({'error': 'request failed'}, status=500)
    #     else:
    #         return get_list

    def handle_export_excel(self, queryset):
        file_url = export_excel(queryset)
        if file_url:
            full_url = self.request.build_absolute_uri(file_url)
            return Response({'file_url': full_url})
        return Response({'error': 'Export failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def handle_step_counter(self, queryset):
        try:
            step_list = []
            if queryset.exists():
                workflow_steps = queryset[0].request_status.all().first().step.workflow.steps.all()
                for step in workflow_steps:
                    step_list.append({
                        'id': step.id,
                        'name': step.name,
                        'step_color': step.next_button_color,
                        'request_counter': queryset.filter(
                            request_status__step__id=step.id,
                            request_status__accept=False,
                            request_status__reject=False
                        ).count()
                    })
            return Response(step_list)
        except Exception as e:
            return Response({'error': f'Step counter calculation failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if request.query_params.get('export_excel', 'False').lower() == 'true':
            return self.handle_export_excel(queryset)

        if request.query_params.get('step_counter', 'False').lower() == 'true':
            return self.handle_step_counter(queryset)

        return super().get(request, *args, **kwargs)

class RequestDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestDetailSerializer

    # permission and filter param
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_request', 'view_owner_request', 'update_all_request', 'update_owner_request',
                              'delete_all_request', 'delete_owner_request']
         # 'update_receptor_request', 'view_receptor_request', 'update_operator_request', 'view_operator_request'
    view_key = 'request'


class RequestCertificateAPIView(RetrieveAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestCertificateSerializer

    # permission and filter param
    permission_classes = [AccessLevelPermission]
    required_access_levels = ['view_all_request', 'view_owner_request']
    view_key = 'request'


class RequestChangeStatusAPIView(UpdateAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestButtonActionSerializer
    # serializer_class = RequestChangeStatusSerializer

    # def get_queryset(self):
    #     return self.request.user.requests.all()

class OwnedRequestListAPIView(ListCreateAPIView):
    queryset = Request.objects.filter(is_completed=True).order_by('-created_at')
    serializer_class = RequestListSerializer

    def get_queryset(self):
        return self.request.user.requests.filter(is_completed=True).order_by('-created_at')

class OwnedRequestDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestDetailSerializer

    def get_queryset(self):
        return self.request.user.requests.filter(is_completed=True).order_by('-created_at')


class DepartmentListAPIView(ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DepartmentDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class LabTypeListAPIView(ListCreateAPIView):
    queryset = LabType.objects.all()
    serializer_class = LabTypeSerializer


class LabTypeDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = LabType.objects.all()
    serializer_class = LabTypeSerializer


class FormResponseListAPIView(ListCreateAPIView):
    queryset = FormResponse.objects.all()
    serializer_class = FormResponseSerializer
    filterset_class = FormResponseFilter

    def perform_create(self, serializer):
        instance = serializer.save()
        if instance.request:
            instance.request.set_price()


class FormResponseDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = FormResponse.objects.all()
    serializer_class = FormResponseSerializer


    def perform_destroy(self, instance):
        request = instance.request
        instance.delete()
        if instance.request:
            request.set_price()

    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     self.perform_destroy(instance)
    #     if instance.request:
    #         instance.request.set_price()
    #     return Response(status=status.HTTP_204_NO_CONTENT)


class WorkflowListAPIView(ListCreateAPIView):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer


class WorkflowDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer


class RequestResultAPIView(ListCreateAPIView):
    serializer_class = RequestResultSerializer
    queryset = RequestResult.objects.all()
    # permission_classes = [IsOwnerOfRequest]
    #
    # def get_queryset(self):
    #     return RequestResult.objects.filter(request__owner=self.request.user)

    # def perform_create(self, serializer):
    #     request_id = self.request.data.get('request')
    #     request_obj = Request.objects.get(id=request_id)
    #     if request_obj.owner != self.request.user:
    #         raise PermissionDenied("You do not have permission to add results to this request.")
    #     serializer.save()


class RequestResultDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = RequestResultSerializer
    queryset = RequestResult.objects.all()
    # permission_classes = [IsOwnerOfRequest]

    # def get_queryset(self):
    #     return RequestResult.objects.filter(request__owner=self.request.user)
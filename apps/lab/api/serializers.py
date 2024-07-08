from rest_framework import serializers
import ast

from apps.account.api.serializers import UserSerializer
from apps.account.api.views import UserDetailAPIView
from apps.account.models import User
from apps.form.api.serializers import FormSerializer
from apps.lab.models import Laboratory, Experiment, Device, Parameter, Request, Department, LabType, FormResponse, \
    Status, Workflow, WorkflowStep, WorkflowStepButton, RequestResult
from apps.order.models import PaymentRecord


class UserSummerySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name',]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        exclude = []


class DeviceSerializer(serializers.ModelSerializer):
    lab_name = serializers.SerializerMethodField(read_only=True)

    def get_lab_name(self, obj):
        return obj.laboratory.name

    class Meta:
        model = Device
        exclude = []


class ParameterSerializer(serializers.ModelSerializer):
    exp_name = serializers.SerializerMethodField(read_only=True)

    def get_exp_name(self, obj):
        return obj.experiment.name

    class Meta:
        model = Parameter
        exclude = []


class ExperimentSerializer(serializers.ModelSerializer):
    device_obj = DeviceSerializer(read_only=True, source='device')
    lab_name = serializers.SerializerMethodField(read_only=True)

    def get_lab_name(self, obj):
        return obj.get_lab_name()


    class Meta:
        model = Experiment
        exclude = []


class ExperimentDetailSerializer(serializers.ModelSerializer):
    device_obj = DeviceSerializer(read_only=True, source='device')
    form_obj = FormSerializer(read_only=True, source='form')

    class Meta:
        model = Experiment
        exclude = []


class LaboratorySerializer(serializers.ModelSerializer):
    technical_manager_obj = UserSummerySerializer(read_only=True, source='technical_manager')
    operator_obj = UserSummerySerializer(read_only=True, source='operator')
    department_obj = DepartmentSerializer(read_only=True, source='department')
    device_objs = DeviceSerializer(read_only=True, many=True, source='devices')

    class Meta:
        model = Laboratory
        exclude = ['device']


class LaboratoryDetailSerializer(serializers.ModelSerializer):
    experiments = ExperimentSerializer(read_only=True, many=True)
    technical_manager_obj = UserSerializer(read_only=True, source='technical_manager')
    operator_obj = UserSerializer(read_only=True, source='operator')
    department_obj = DepartmentSerializer(read_only=True, source='department')
    device_objs = DeviceSerializer(read_only=True, many=True, source='devices')

    class Meta:
        model = Laboratory
        exclude = ['device']


class RequestExperimentSerializer(serializers.ModelSerializer):
    laboratory_obj = LaboratorySerializer(read_only=True, source='laboratory')

    class Meta:
        model = Experiment
        exclude = []


class RequestListFormResponseSerializer(serializers.ModelSerializer):

    class Meta:
        model = FormResponse
        exclude = ['response', 'response_json']


class RequestDetailFormResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormResponse
        exclude = ['response']

class WorkflowStepButtonSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowStepButton
        exclude = []

class WorkflowStepSerializer(serializers.ModelSerializer):
    request_count = serializers.SerializerMethodField(read_only=True)
    buttons = WorkflowStepButtonSerializer(many=True, read_only=True, source='button')

    def get_request_count(self, obj):
        step_status = obj.step_status.filter(accept=False, reject=False)
        return step_status.count()

    class Meta:
        model = WorkflowStep
        exclude = []


class WorkflowSerializer(serializers.ModelSerializer):
    steps_objs = WorkflowStepSerializer(read_only=True, source='steps', many=True)

    class Meta:
        model = Workflow
        exclude = []


class StatusSerializer(serializers.ModelSerializer):
    step_obj = WorkflowStepSerializer(read_only=True, source='step')

    class Meta:
        model = Status
        exclude = []


class RequestButtonActionSerializer(serializers.ModelSerializer):
    action = serializers.ChoiceField(choices=['next_step', 'previous_step', 'reject_step', 'view_result', 'print_result', 'upload_result', 'request_discount'], write_only=True)
    description = serializers.CharField(max_length=100, write_only=True, required=False)
    # action_by = UserSerializer(write_only=True)
    value = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Request
        # fields = ['description', 'action', 'action_by']
        fields = ['description', 'action', 'value']

    def update(self, instance, validated_data):
        # validated_data['action_by'] = self.context['request'].user
        # validated_data['action_by'] = User.objects.get(id=1)
        # action_by = User.objects.get(id=1)
        action_by = self.context['request'].user
        description = validated_data.pop('description', None)
        action = validated_data.pop('action', None)
        value = validated_data.pop('value', None)

        instance.step_button_action(action, description, action_by, value)

        # obj = super().update(instance, validated_data)
        # if action in ['next_step','previous_step','reject_step']:
        #     instance.change_status(action, description, action_by)
        #     instance.save()
        # if action in ['view_result','print_result','upload_result']:

        # obj.change_status(action)
        # obj.save()
        return RequestDetailSerializer(instance)





class RequestChangeStatusSerializer(serializers.ModelSerializer):
    action = serializers.ChoiceField(choices=['next', 'previous', 'reject'], write_only=True)
    description = serializers.CharField(max_length=100, write_only=True)
    # action_by = UserSerializer(write_only=True)

    class Meta:
        model = Request
        # fields = ['description', 'action', 'action_by']
        fields = ['description', 'action']

    def update(self, instance, validated_data):
        # validated_data['action_by'] = self.context['request'].user
        # validated_data['action_by'] = User.objects.get(id=1)
        # action_by = User.objects.get(id=1)
        action_by = self.context['request'].user
        description = validated_data.pop('description', None)
        action = validated_data.pop('action', None)
        # obj = super().update(instance, validated_data)

        instance.change_status(action, description, action_by)
        instance.save()
        # obj.change_status(action)
        # obj.save()
        return RequestDetailSerializer(instance)


class RequestDetailResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestResult
        exclude = []


class RequestListSerializer(serializers.ModelSerializer):
    result_objs = RequestDetailResultSerializer(read_only=True, source='request_results', many=True)
    owner_obj = UserSerializer(read_only=True, source='owner')
    experiment_obj = RequestExperimentSerializer(read_only=True, source='experiment')
    parameter_obj = ParameterSerializer(many=True, read_only=True, source='parameter')

    status_objs = StatusSerializer(read_only=True, source='request_status',many=True)
    # latest_status_obj = serializers.SerializerMethodField(source='get_get_request_status_obj') #
    latest_status_obj = StatusSerializer(read_only=True, source='lastest_status')

    forms = RequestListFormResponseSerializer(many=True, read_only=True, source='formresponse')

    # def latest_status_obj_(self, obj):
    #     lastest_status = obj.lastest_status()
    #     return StatusSerializer(instance=lastest_status)
    #     # return obj.lastest_status()

    class Meta:
        model = Request
        exclude = []

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class OrderPaymentRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = PaymentRecord
        fields = ['amount', 'transaction_code', 'tref', 'successful', 'payment_type', 'created_at']



class RequestDetailSerializer(serializers.ModelSerializer):
    result_objs = RequestDetailResultSerializer(read_only=True, source='request_results', many=True)
    owner_obj = UserSerializer(read_only=True, source='owner')
    experiment_obj = RequestExperimentSerializer(read_only=True, source='experiment')
    parameter_obj = ParameterSerializer(many=True, read_only=True, source='parameter')

    status_objs = StatusSerializer(read_only=True, source='request_status', many=True)

    forms = RequestDetailFormResponseSerializer(many=True, read_only=True, source='formresponse')

    payment_record_objs = OrderPaymentRecordSerializer(many=True, source='get_latest_order_payment_records')

    class Meta:
        model = Request
        exclude = []

    def update(self, instance, validated_data):
        super().update(instance, validated_data)
        # if 'parameter' in validated_data:
        instance.save()
        instance.set_price()

        return instance



class LabTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabType
        exclude = []


class FormResponseRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Request
        exclude = []


class FormResponseSerializer(serializers.ModelSerializer):
    request_obj = FormResponseRequestSerializer(read_only=True, source='request')

    class Meta:
        model = FormResponse
        exclude = []

    # def create(self, validated_data):
    #     instance = super().create(validated_data)
    #     instance.request.set_price()
    #     return instance

    #
    # def to_representation(self, instance):
    #     ret = super().to_representation(instance)
    #     ret['response_'] = ast.literal_eval(ret['response'])
    #     return ret

class RequestResultSerializer(serializers.ModelSerializer):
    # request_obj = FormResponseRequestSerializer(read_only=True, source='request')

    class Meta:
        model = RequestResult
        exclude = []

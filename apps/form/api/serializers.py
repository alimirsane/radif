from rest_framework import serializers
from apps.form.models import Form
import ast
from apps.lab.models import Experiment


class ExperimentSummerySerializer(serializers.ModelSerializer):
    lab_name = serializers.SerializerMethodField(read_only=True)

    def get_lab_name(self, obj):
        return obj.get_lab_name()


    class Meta:
        model = Experiment
        fields = ['id', 'name', 'name_en', 'status', 'lab_name']


class FormSerializer(serializers.ModelSerializer):

    class Meta:
        model = Form
        exclude = []

    experiment_objs = ExperimentSummerySerializer(source='experiments', many=True)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            ret['json_init'] = ast.literal_eval(ret['json_init'])
        except:
            ret['json_init'] = None
        return ret
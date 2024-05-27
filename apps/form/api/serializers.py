from rest_framework import serializers
from apps.form.models import Form
import ast

class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        exclude = []


    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            ret['json_init'] = ast.literal_eval(ret['json_init'])
        except:
            ret['json_init'] = None
        return ret
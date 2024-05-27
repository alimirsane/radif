from django.contrib import admin
from .models import Laboratory, Experiment, Device, Parameter, Request, Department, LabType, FormResponse, WorkflowStep, \
    Status, Workflow, WorkflowStepButton


@admin.register(Laboratory)
class LaboratoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_en', 'department', 'lab_type', 'phone_number')
    search_fields = ('name', 'name_en', 'address', 'phone_number')
    list_filter = ('department', 'lab_type', 'device')


@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('laboratory', 'device', 'name', 'name_en')
    search_fields = ('name', 'name_en')
    list_filter = ('laboratory', 'device')


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ('name', 'model', 'manufacturer', 'purchase_date', 'status')
    search_fields = ('name', 'model', 'manufacturer')
    list_filter = ('status',)


@admin.register(Parameter)
class ParameterAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'experiment')
    search_fields = ('name', 'experiment')
    list_filter = ('experiment',)


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('experiment', 'owner', 'experiment', 'price', 'is_completed', 'created_at', 'updated_at')
    search_fields = ('experiment',)
    list_filter = ('created_at', 'updated_at')


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')


@admin.register(LabType)
class LabTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')


@admin.register(FormResponse)
class FormResponseAdmin(admin.ModelAdmin):
    list_display = ('request', 'response')
    search_fields = ('request', 'response')


@admin.register(Workflow)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')


@admin.register(WorkflowStep)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('workflow', 'name', 'next_step')
    # search_fields = ('name', 'description')


@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('request', 'step', 'complete')
    # search_fields = ('name', 'description')


@admin.register(WorkflowStepButton)
class WorkflowStepButtonAdmin(admin.ModelAdmin):
    list_display = ('title', 'action_slug', 'color')
    # search_fields = ('name', 'description')
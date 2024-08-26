import datetime

from django.db import models
from django.db.models import Sum
from django.utils import timezone
import jdatetime
import django_jalali
from apps.account.models import User
from apps.form.models import Form
import math


class Laboratory(models.Model):
    name = models.CharField(max_length=255, verbose_name='نام')
    name_en = models.CharField(max_length=255, verbose_name='نام انگلیسی')
    economic_number = models.CharField(max_length=20, blank=True, null=True, verbose_name='شماره اقتصادی')
    national_id = models.CharField(max_length=20, blank=True, null=True, verbose_name='شناسه ملی')
    technical_manager = models.ForeignKey(User, related_name='tm_laboratories', blank=True, null=True, limit_choices_to={'user_type': 'staff'}, on_delete=models.PROTECT)
    operator = models.ForeignKey(User, related_name='op_laboratories', blank=True, null=True, limit_choices_to={'user_type': 'staff'}, on_delete=models.PROTECT)
    operators = models.ManyToManyField(User, related_name='ops_laboratories', blank=True, limit_choices_to={'user_type': 'staff'})
    department = models.ForeignKey('Department', related_name='laboratories', blank=True, null=True, on_delete=models.PROTECT, verbose_name='دپارتمان')
    lab_type = models.ForeignKey('LabType', related_name='laboratories', blank=True, null=True, on_delete=models.PROTECT, verbose_name='نوع آزمایشگاه')
    # standard_code = models.CharField(max_length=255)
    control_code = models.CharField(max_length=255, blank=True, null=True, verbose_name='کد کنترلی')
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('hidden', 'Hidden'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active', verbose_name='وضعیت')
    address = models.TextField(blank=True, null=True, verbose_name='آدرس')
    postal_code = models.CharField(max_length=20, blank=True, null=True, verbose_name='کد پستی')
    email = models.EmailField(blank=True, null=True, verbose_name='ایمیل')
    fax = models.CharField(max_length=50, blank=True, null=True, verbose_name='دورنگار')
    phone_number = models.CharField(max_length=255, blank=True, null=True, verbose_name='شماره همراه')
    telephone1 = models.CharField(max_length=50, blank=True, null=True, verbose_name='شماره تلفن')
    telephone2 = models.CharField(max_length=50, blank=True, null=True, verbose_name='شماره تلفن')
    add_telephone1 = models.CharField(max_length=50, blank=True, null=True, verbose_name='داخلی')
    add_telephone2 = models.CharField(max_length=50, blank=True, null=True, verbose_name='داخلی')
    response_hours = models.CharField(max_length=100, blank=True, null=True, verbose_name='ساعت پاسخگویی')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    image = models.ImageField(blank=True, null=True, verbose_name='تصویر')
    device = models.ManyToManyField('Device', blank=True, related_name="laboratories", verbose_name='دستگاه')
    rules = models.TextField(blank=True, null=True, verbose_name='قوانین')

    has_iso_17025 = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'آزمایشگاه'
        verbose_name_plural = 'آزمایشگاه‌ها'

    def __str__(self):
        return self.name

    def get_all_laboratory(self):
        return Laboratory.objects.all()

    def get_unhidden_laboratory(self):
        return Laboratory.objects.filter(status__in=['active', 'inactive'])

    def get_technical_manager_laboratory(self, technical_manager):
        return self.get_unhidden_laboratory().filter(technical_manager=technical_manager)

    def get_operator_laboratory(self, operator):
        return self.get_unhidden_laboratory().filter(operator=operator)

    # def owners(self):
    #     return [self.technical_manager, self.operator]

    def owners(self):
        return [self.technical_manager, self.operator] + [operator for operator in self.operators.all()]


class Experiment(models.Model):
    laboratory = models.ForeignKey('Laboratory', on_delete=models.CASCADE, related_name='experiments', verbose_name='آزمایشگاه')
    device = models.ForeignKey('Device', blank=True, null=True, on_delete=models.CASCADE, related_name='experiments', verbose_name='دستگاه')
    form = models.ForeignKey(Form, blank=True, null=True, on_delete=models.CASCADE, related_name='experiments', verbose_name='فرم')
    operator = models.ForeignKey(User, related_name='op_experiments', blank=True, null=True, limit_choices_to={'user_type': 'staff'}, on_delete=models.PROTECT)

    name = models.CharField(max_length=255, verbose_name='نام')
    name_en = models.CharField(max_length=255, verbose_name='Name')

    work_scope = models.CharField(max_length=255, blank=True, null=True, verbose_name='گستره کاری')
    test_unit_type = models.CharField(max_length=255, blank=True, null=True, verbose_name='نوع واحد آزمون')

    need_turn = models.BooleanField(default=False, verbose_name='نیاز به نوبت')

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('hidden', 'Hidden'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active', verbose_name='وضعیت')
    rules = models.TextField(blank=True, null=True, verbose_name='قوانین')
    # sample = models.ForeignKey('Sample', on_delete=models.CASCADE)
    # result = models.CharField(max_length=255, verbose_name='نتیجه')
    estimated_result_time = models.IntegerField(blank=True, null=True, verbose_name='زمان حدودی اعلام نتیجه (روز)')
    estimated_urgent_result_time = models.IntegerField(blank=True, null=True, verbose_name='زمان حدودی اعلام نتیجه فوری (روز)')



    class Meta:
        verbose_name = 'آزمایش'
        verbose_name_plural = 'آزمایش‌ها'

    def __str__(self):
        return f'{self.name} ({self.laboratory.name}) '

    def get_all_experiments(self):
        return Experiment.objects.all()

    def get_unhidden_experiments(self):
        return Experiment.objects.filter(status__in=['active', 'inactive'])

    def get_tm_experiments(self, technical_manager):
        return self.get_unhidden_experiments().filter(technical_manager=technical_manager)

    def get_lab_name(self):
        return self.laboratory.name

    def owners(self):
        return self.laboratory.owners()


class Device(models.Model):
    laboratory = models.ForeignKey('Laboratory', on_delete=models.CASCADE, related_name='devices', verbose_name='آزمایشگاه')

    name = models.CharField(max_length=255, verbose_name='نام')
    model = models.CharField(max_length=255, blank=True, null=True, verbose_name='مدل')
    manufacturer = models.CharField(max_length=255, blank=True, null=True, verbose_name='تولید کننده')
    purchase_date = models.CharField(max_length=255, blank=True, null=True, verbose_name='تاریخ خرید')

    warranty_period = models.CharField(max_length=255, blank=True, null=True, verbose_name='مدت ضمانت')
    serial_number = models.CharField(max_length=255, blank=True, null=True, verbose_name='شماره سریال')

    description = models.TextField(verbose_name='شرح خدمات', blank=True, null=True)
    application = models.TextField(verbose_name='کاربرد', blank=True, null=True)
    accuracy = models.CharField(max_length=255, blank=True, null=True, verbose_name='دقت دستگاه')
    device_code = models.CharField(max_length=255, blank=True, null=True, verbose_name='کد دستگاه')

    labsnet_device_id = models.CharField(max_length=255, blank=True, null=True, verbose_name='شناسه نوع دستگاه در شبکه راهبردی')
    labsnet_model_id = models.CharField(max_length=255, blank=True, null=True, verbose_name='شناسه مدل دستگاه در شبکه راهبردی')
    manufacturer_representation = models.CharField(max_length=255, blank=True, null=True, verbose_name='نمایندگی شرکت سازنده')
    country_of_manufacture = models.CharField(max_length=255, blank=True, null=True, verbose_name='کشور سازنده')
    commissioning_date = models.DateField(blank=True, null=True, verbose_name='تاریخ راه‌اندازی دستگاه')
    control_code = models.CharField(max_length=255, blank=True, null=True, verbose_name='کد کنترلی دستگاه')

    EX_STATUS_CHOICES = (
        ('operational', 'سالم'),
        ('under_repair', 'در حال تعمیر'),
        ('commissioning', 'در حال راه‌اندازی'),
        ('calibration', 'در حال کالیبراسیون'),
        ('awaiting_budget', 'در انتظار بودجه برای تعمیر'),
        ('decommissioned', 'به طور کامل از کار افتاده'),
    )
    extra_status = models.CharField(max_length=20, choices=EX_STATUS_CHOICES, default='operational', verbose_name='وضعیت اضافی')

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('hidden', 'Hidden'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active', verbose_name='وضعیت')

    class Meta:
        verbose_name = 'دستگاه'
        verbose_name_plural = 'دستگاه‌ها'

    def __str__(self):
        return self.name

    def owners(self):
        return self.laboratory.owners()


class Parameter(models.Model):
    UNIT_TYPES = (
        ('sample', 'نمونه'),
        ('time', 'زمان (دقیقه)')
    )
    experiment = models.ForeignKey('Experiment', on_delete=models.CASCADE, related_name='parameters', verbose_name='آزمایش')
    name = models.CharField(max_length=255, verbose_name='نام')
    name_en = models.CharField(max_length=255, blank=True, null=True, verbose_name='نام انگلیسی')
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name='قیمت')
    urgent_price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name='قیمت فوری')
    unit_value = models.IntegerField(blank=True, null=True, default=1, verbose_name='مقدار واحد', help_text='مقدار عددی بر حسب نمونه، مبنای محاسبه قیمت')
    unit = models.CharField(choices=UNIT_TYPES, max_length=25, blank=True, null=True, verbose_name='واحد')

    class Meta:
        verbose_name = 'پارامتر'
        verbose_name_plural = 'پارامترها'

    def __str__(self):
        return self.name

    def owners(self):
        return self.experiment.owners()


class Request(models.Model):
    owner = models.ForeignKey(User, blank=True, null=True, related_name='requests', limit_choices_to={'user_type': 'customer'}, on_delete=models.PROTECT, verbose_name='درخواست کننده')
    experiment = models.ForeignKey('Experiment', on_delete=models.PROTECT, verbose_name='آزمایش')
    parameter = models.ManyToManyField('Parameter', verbose_name='پارامتر')
    price = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True, verbose_name='قیمت')

    discount = models.PositiveIntegerField(blank=True, null=True, default=0)
    discount_description = models.CharField(max_length=120, blank=True, null=True, verbose_name='توضیحات تخفیف')

    is_urgent = models.BooleanField(default=False)

    # STATUS_CHOICES = (
    #     ('new', 'New'),
    #     ('pending', 'Pending'),
    #     ('rejected', 'Rejected'),
    #     ('done', 'Done'),
    #     ('canceled', 'Canceled'),
    # )
    #
    # status = models.CharField(max_length=10, null=True, blank=True, default='new', choices=STATUS_CHOICES, verbose_name='وضعیت')

    delivery_date = models.DateField(blank=True, null=True, verbose_name='تاریخ تحویل')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    subject = models.CharField(max_length=100, blank=True, null=True, verbose_name='موضوع درخواست')
    request_number = models.CharField(max_length=20, blank=True, verbose_name='شماره درخواست')
    is_completed = models.BooleanField(default=False, blank=True, null=True, verbose_name='تکمیل شده')

    is_returned = models.BooleanField(default=False, verbose_name='عودت شده')

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به روز رسانی')

    class Meta:
        verbose_name = 'درخواست'
        verbose_name_plural = 'درخواست‌ها'

    def __str__(self):
        return f'{self.experiment} - {self.request_number}'

    def set_first_step(self):
        workflow = Workflow.objects.all().first()
        return Status.objects.create(request=self, step=workflow.first_step())

    def lastest_status(self):
        if self.request_status.order_by('-created_at').exists():
            return self.request_status.order_by('-created_at').first()
        else:
            return self.set_first_step()

    def step_button_action(self, action, description, action_by, value):
        if action in ['next', 'previous', 'reject']:
            self.change_status(action, description, action_by)
            self.save()
        elif action in ['view_result', 'print_result', 'upload_result']:
            pass
        elif action in ['request_discount']:
            self.discount = value
            self.save()
        else:
            pass

    def change_status(self, action, description, action_by):
        lastest_status = self.lastest_status()
        if action == 'next':
            lastest_status.accept = True
            Status.objects.create(request=lastest_status.request, step=lastest_status.step.next_step)
            self.handle_status_changed(lastest_status.step.next_step, action, lastest_status)
        elif action == 'previous':
            lastest_status.reject = True
            Status.objects.create(request=lastest_status.request, step=lastest_status.step.previous_step)
            self.handle_status_changed(lastest_status.step.previous_step, action, lastest_status)
        elif action == 'reject':
            lastest_status.reject = True
            Status.objects.create(request=lastest_status.request, step=lastest_status.step.reject_step)
            self.handle_status_changed(lastest_status.step.reject_step, action, lastest_status)
        lastest_status.complete = True
        lastest_status.description = description
        lastest_status.action_by = action_by
        lastest_status.save()

    def handle_status_changed(self, new_step, action, lastest_status):
        if new_step.name == 'در حال انجام':
            self.delivery_date = datetime.datetime.now() + datetime.timedelta(days=self.experiment.estimated_result_time)
            self.save()
        if action == 'reject':
            if lastest_status.step.name == 'در حال انجام' or lastest_status.step.name == 'در ‌انتظار نمونه':
                self.is_returned = True
                self.save()
                try:
                    payment_records = self.get_latest_order_payment_records().filter(successful=True)
                    payment_records.update(is_returned=True)
                    order = self.get_latest_order()
                    order.is_returned = True
                    order.save()
                except:
                    self.description = self.description + '\n تگ استرداد با خطا مواجه شد'
                    self.save()

    def owners(self):
        return [self.owner] + self.experiment.owners()

    def set_price(self):
        params = self.parameter.all()
        formresponses = self.formresponse.all()
        price = 0
        for param in params:
            temp = formresponses.count() / int(param.unit_value)
            temp = math.ceil(temp)
            if self.is_urgent:
                price += int(param.urgent_price) * int(temp)
            else:
                price += int(param.price) * int(temp)
        self.price = price
        self.save()

    def current_month_counter(self):
        now = jdatetime.date.today()
        start_of_month = jdatetime.datetime(now.year, now.month, 1)

        if now.month == 12:
            end_of_month = jdatetime.datetime(now.year + 1, 1, 1) - jdatetime.timedelta(days=1)
        else:
            end_of_month = jdatetime.datetime(now.year, now.month + 1, 1) - jdatetime.timedelta(days=1)

        start_of_month_gregorian = start_of_month.togregorian()
        end_of_month_gregorian = end_of_month.togregorian().replace(hour=23, minute=59, second=59)

        return Request.objects.filter(created_at__range=(start_of_month_gregorian, end_of_month_gregorian)).count()

    def get_latest_order_payment_records(self):
        try:
            return self.get_latest_order().get_payment_records()
        except:
            return []

    def get_latest_order(self):
        try:
            return self.orders.order_by('-created_at').first()
        except:
            return []

# class Sample(models.Model):
#     name = models.CharField(max_length=255)
#     type = models.CharField(max_length=255)
#     source = models.CharField(max_length=255)
#     collection_date = models.CharField(max_length=255)


class RequestCertificate(models.Model):
    request = models.OneToOneField('Request', on_delete=models.CASCADE, related_name='certificate',
                                   verbose_name='درخواست')
    issue_date = models.DateField(verbose_name='تاریخ صدور')
    temperature = models.CharField(max_length=5, verbose_name='دما (درجه سانتی‌گراد)')
    humidity = models.CharField(max_length=5, verbose_name='رطوبت (%)')
    pressure = models.CharField(max_length=5, verbose_name='فشار (میلی‌بار)')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به روز رسانی')

    class Meta:
        verbose_name = 'گواهی درخواست'
        verbose_name_plural = 'گواهی‌های درخواست'

    def __str__(self):
        return f'گواهی {self.request.request_number} - {self.issue_date}'


class Department(models.Model):
    name = models.CharField(max_length=255, verbose_name='نام')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')

    # manager = models.ForeignKey('Personnel', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='مدیر')

    class Meta:
        verbose_name = 'دپارتمان'
        verbose_name_plural = 'دپارتمان‌ها'

    def __str__(self):
        return self.name


class LabType(models.Model):
    name = models.CharField(max_length=255, verbose_name='نام')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')

    class Meta:
        verbose_name = 'نوع آزمایشگاه'
        verbose_name_plural = 'انواع آزمایشگاه'

    def __str__(self):
        return f'{self.name}'


class FormResponse(models.Model):
    request = models.ForeignKey('Request', on_delete=models.CASCADE, related_name='formresponse', verbose_name='درخواست')
    form_number = models.CharField(max_length=20, blank=True, verbose_name='شماره نمونه')

    response = models.TextField(blank=True, null=True, verbose_name='پاسخ')
    response_json = models.JSONField(blank=True, null=True, verbose_name='پاسخ')

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به روز رسانی')

    is_main = models.BooleanField(default=False, blank=True, null=True, verbose_name='اصلی')
    response_count = models.IntegerField(default=0, verbose_name='تعداد پاسخ‌ها')  # فیلد جدید

    class Meta:
        verbose_name = 'پاسخ فرم'
        verbose_name_plural = 'پاسخ فرم‌ها'

    def __str__(self):
        return f'{self.request}'

    def owners(self):
        return self.request.owners()

    def set_form_number(self):
        request_formresponses = self.request.formresponse.all().order_by('id')
        counter = 1
        for request_formresponse in request_formresponses:
            request_formresponse.form_number = f'{self.request.request_number.replace("-","")}{counter:03d}'
            request_formresponse.save()
            counter += 1


class Workflow(models.Model):
    name = models.CharField(max_length=100, verbose_name='نام گردش کار')
    description = models.TextField(blank=True, verbose_name='توضیحات')
    # start_date = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ شروع')
    # end_date = models.DateTimeField(null=True, blank=True, verbose_name='تاریخ پایان')
    is_active = models.BooleanField(default=True, verbose_name='فعال بودن')
    # priority = models.IntegerField(default=0, verbose_name='اولویت')

    class Meta:
        verbose_name = 'گردش کار'
        verbose_name_plural = 'گردش کارها'

    def __str__(self):
        return self.name

    def first_step(self):
        try:
            return self.steps.filter(is_first_step=True).first()
        except:
            return None


class WorkflowStep(models.Model):
    COLOR_CHOICES = (
        ('info', 'Info'),
        ('paper', 'Paper'),
        ('secondary', 'Secondary'),
        ('secondary_light', 'Secondary_light'),
        ('success', 'Success'),
        ('error', 'Error'),
        ('warning', 'Warning'),
        ('primary', 'Primary'),
        ('black', 'Black'),
    )

    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='steps', verbose_name='گردش کار')
    name = models.CharField(max_length=100, verbose_name='نام مرحله')
    description = models.TextField(blank=True, verbose_name='توضیحات')
    next_step = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True,
                                     related_name='previous_step', verbose_name='مرحله بعدی')
    next_button_title = models.CharField(max_length=100, default='تایید', verbose_name='نام دکمه تایید')

    next_button_color = models.CharField(max_length=20, default='info', choices=COLOR_CHOICES,
                                         verbose_name='رنگ دکمه تایید')

    reject_step = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='مرحله رد')
    reject_button_title = models.CharField(max_length=100, default='رد', null=True, blank=True, verbose_name='نام دکمه رد')

    reject_button_color = models.CharField(max_length=20, null=True, blank=True, default='info', choices=COLOR_CHOICES,
                                         verbose_name='رنگ دکمه رد')

    is_first_step = models.BooleanField(default=False, verbose_name='مرحله اول')
    has_next_step = models.BooleanField(default=False, verbose_name='مرحله بعد دارد')
    has_reject_step = models.BooleanField(default=False, verbose_name='رد شدن دارد')

    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='کاربر اختصاص یافته')
    progress = models.IntegerField(default=0, verbose_name='پیشرفت')

    button = models.ManyToManyField('WorkflowStepButton', verbose_name='دکمه')

    # conditions = models.TextField(blank=True, verbose_name='شرایط')
    # comments = models.TextField(blank=True, verbose_name='نظرات')
    # deadline = models.DateTimeField(null=True, blank=True, verbose_name='مهلت')
    # users = models.ManyToManyField(User, verbose_name='کاربران مرتبط با مرحله', blank=True)
    # duration = models.DurationField(null=True, blank=True, verbose_name='مدت زمان')
    # required_approvals = models.PositiveIntegerField(default=1, verbose_name='تأیید‌های مورد نیاز')
    # attachments = models.FileField(upload_to='workflow_attachments/', null=True, blank=True, verbose_name='پیوست‌ها')
    # completed = models.BooleanField(default=False, verbose_name='اتمام شده')

    class Meta:
        verbose_name = 'مرحله گردش کار'
        verbose_name_plural = 'مراحل گردش کار'

    def __str__(self):
        return self.name


class WorkflowStepButton(models.Model):
    COLOR_CHOICES = (
        ('info', 'Info'),
        ('paper', 'Paper'),
        ('secondary', 'Secondary'),
        ('secondary_light', 'Secondary_light'),
        ('success', 'Success'),
        ('error', 'Error'),
        ('warning', 'Warning'),
        ('primary', 'Primary'),
        ('black', 'Black'),
    )
    ACTION_CHOICES = (
        ('next_step', 'Next Step'),
        ('previous_step', 'Previous Step'),
        ('reject_step', 'Reject Step'),
        ('view_result', 'View Result'),
        ('print_result', 'Print Result'),
        ('upload_result', 'Upload Result'),
        ('request_discount', 'Request Discount'),
    )

    action_slug = models.CharField(max_length=20, default='print_result', choices=ACTION_CHOICES, verbose_name='کد عملگر')
    title = models.CharField(max_length=100, default='نام دکمه', verbose_name='نام دکمه')
    color = models.CharField(max_length=20, default='info', choices=COLOR_CHOICES, verbose_name='رنگ دکمه')

    def __str__(self):
        return f'{self.title} ({self.color})'

    class Meta:
        verbose_name = 'دکمه مرحله گردش کار'
        verbose_name_plural = 'دکمه های مرحله گردش کار'


class Status(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name='request_status', verbose_name='درخواست')
    step = models.ForeignKey(WorkflowStep, on_delete=models.PROTECT, related_name='step_status')
    description = models.TextField(blank=True, verbose_name='توضیحات')

    seen = models.BooleanField(default=False, null=True, blank=True)
    seen_at = models.DateTimeField(null=True, blank=True, verbose_name='زمان مشاهده')
    action_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='کاربر')

    complete = models.BooleanField(default=False, null=True, blank=True)
    accept = models.BooleanField(default=False, null=True, blank=True)
    reject = models.BooleanField(default=False, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به روز رسانی')

    def __str__(self):
        return f'{self.request.subject}, {self.step.name}, {self.description}'

    class Meta:
        verbose_name = 'وضعیت درخواست'
        verbose_name_plural = 'وضعیت های درخواست'


def request_result_directory_path(instance, filename):
    return f'results/{instance.request.id}/{filename}'


class RequestResult(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name='request_results', verbose_name='درخواست')
    file = models.FileField(upload_to=request_result_directory_path, verbose_name='فایل')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    description = models.TextField(blank=True, verbose_name='توضیحات')


    class Meta:
        verbose_name = 'نتیجه درخواست'
        verbose_name_plural = 'نتایج درخواست‌ها'
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core import validators
from django.utils import timezone
import requests
import json
import datetime
from django.db import transaction

class EducationalField(models.Model):
    name = models.CharField(max_length=100)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class EducationalLevel(models.Model):
    name = models.CharField(max_length=100)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class PhoneValidator(validators.RegexValidator):
    regex = r'^\+\d{1,3}\d{9,12}$'
    message = _('Enter a valid phone number.')


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('staff', _('Staff')),
        ('customer', _('Customer')),
    )

    ACCOUNT_TYPE_CHOICES = (
        ('personal', _('Personal')),
        ('business', _('Business')),
    )

    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='customer')
    account_type = models.CharField(max_length=10, choices=ACCOUNT_TYPE_CHOICES, default='personal')
    national_id = models.CharField(_("national ID"), max_length=10, unique=True, null=True, blank=True, help_text=_("Enter your national ID."))

    role = models.ManyToManyField('Role', blank=True)
    access_level = models.ManyToManyField('AccessLevel', blank=True)

    balance = models.BigIntegerField(default=0, verbose_name="اعتبار")

    educational_field = models.ForeignKey(EducationalField, on_delete=models.PROTECT, null=True, blank=True)
    educational_level = models.ForeignKey(EducationalLevel, on_delete=models.PROTECT, null=True, blank=True)
    student_id = models.CharField(_("student ID"), max_length=50, unique=True, null=True, blank=True, help_text=_("Enter your student ID."))
    address = models.CharField(_("address"), max_length=255, null=True, blank=True, help_text=_("Enter your address."))

    postal_code = models.CharField(_("postal code"), max_length=20, blank=True, null=True, help_text=_("Enter your postal code."))
    company_national_id = models.CharField(_("company national ID"), max_length=11, unique=True, null=True, blank=True, help_text=_("Enter your company national ID."))
    company_name = models.CharField(_("company name"), max_length=150, null=True, blank=True, help_text=_("Enter your company name."))

    research_grant = models.BigIntegerField(default=0, verbose_name="گرنت پژوهشی")
    labsnet_grant = models.BigIntegerField(default=0, verbose_name="گرنت لبزنت")

    company_telephone = models.CharField(_("company telephone"), max_length=255, null=True, blank=True, help_text=_("Enter your company telephone."))
    linked_users = models.ManyToManyField('self', symmetrical=False, related_name='linked_to_users', blank=True)

    OTP = models.CharField(max_length=64, null=True, blank=True)
    is_sharif_student = models.BooleanField(default=False, verbose_name='دانشجوی شریف')
    is_partner = models.BooleanField(default=False, verbose_name='شرکت همکار')

    phone_validator = PhoneValidator()

    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. Enter a valid phone number. Example: +989123456789"
        ),
        validators=[phone_validator],
        error_messages={
            "unique": _("A user with that phone number already exists."),
        },
    )

    class Meta:
        unique_together = ("username", "national_id")

    def get_access_levels(self):
        roles = self.role.all()
        access_levels = self.access_level.all()
        for role in roles:
            access_levels = access_levels | role.access_level.all()
        return access_levels.distinct()

    def get_dict_access_level(self):
        dict_access_levels = {}
        access_levels = self.get_access_levels()
        keys = [access_level.access_key.split('_')[2] for access_level in access_levels]
        keys = list(dict.fromkeys(keys))
        for key in keys:
            key_access_level = [access_level.access_key.split('_')[0] for access_level in access_levels if access_level.access_key.split('_')[2] == key]
            key_access_level = list(dict.fromkeys(key_access_level))
            dict_access_levels[key] = key_access_level
        return dict_access_levels

    def owners(self):
        return []

    def set_customer_role(self):
        if self.user_type == 'customer' and self.account_type == 'personal':
            if False:  # todo check if role type is teacher
                self.role.add(Role.objects.get(role_key='teacher'))
            elif self.student_id:
                self.role.add(Role.objects.get(role_key='student'))
            self.role.add(Role.objects.get(role_key='customer'))
        elif self.user_type == 'customer' and self.account_type == 'business':
            if False:
                self.role.add(Role.objects.get(role_key='student'))
            self.role.add(Role.objects.get(role_key='customer'))

class Role(models.Model):
    name = models.CharField(_("name"), max_length=100)
    access_level = models.ManyToManyField('AccessLevel', blank=True)
    role_key = models.CharField(_("Key"), max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name


class AccessLevel(models.Model):
    name = models.CharField(_("name"), max_length=100)
    access_key = models.CharField(_("Key"), max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name


class GrantTransaction(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_transactions', verbose_name="فرستنده")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_transactions', verbose_name="گیرنده")
    grant_record = models.ForeignKey('GrantRecord', on_delete=models.PROTECT, null=True, blank=True)
    amount = models.BigIntegerField(default=0, verbose_name="مقدار", help_text='مقدار به ریال')
    datetime = models.DateTimeField(default=timezone.now, verbose_name="زمان")
    expiration_date = models.DateField(null=True, blank=True, verbose_name="انقضا")
    STATUS_CHOICES = (
        ('unknown', 'Unknown'),
        ('success', 'Success'),
        ('failure', 'Failure'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unknown')

    def __str__(self):
        return str(self.sender) + " -> " + str(self.receiver) + " : " + str(self.amount) + " : " + str(self.datetime) + " : " + str(self.expiration_date)

    def pay(self):
            self.status = 'success'
            self.save()

    def owners(self):
        return [self.sender, self.receiver]


class GrantRecord(models.Model):
    title = models.CharField(max_length=255)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_records', verbose_name="گیرنده")
    amount = models.BigIntegerField(default=0, verbose_name="مقدار", help_text='مقدار به ریال')
    expiration_date = models.DateField(null=True, blank=True, verbose_name="انقضا")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="زمان")

    def __str__(self):
        return str(self.receiver) + " : " + str(self.amount) + " : " + str(self.expiration_date)

    def get_total_transactions(self):
        return self.granttransaction_set.aggregate(total_amount=models.Sum('amount'))['total_amount'] or 0

    def has_sufficient_funds(self, amount):
        total_transactions = self.get_total_transactions()
        return self.amount >= total_transactions + amount

    def remaining_grant(self):
        total_transactions = self.get_total_transactions()
        return self.amount - total_transactions

    # def pay(self):
    #     try:
    #         if self.check_amount(self.amount):
    #             self.sender.research_grant -= self.amount
    #             self.receiver.research_grant += self.amount
    #             self.status = 'success'
    #             self.sender.save()
    #             self.receiver.save()
    #             self.save()
    #         else:
    #             self.status = 'failure'
    #             self.save()
    #     except:
    #         self.status = 'failure'
    #         self.save()

    def owners(self):
        return [self.receiver]


class GrantRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests', verbose_name="فرستنده")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests', verbose_name="گیرنده")
    approved_grant_record = models.ForeignKey(GrantRecord, on_delete=models.PROTECT, null=True, blank=True)
    approved_amount = models.BigIntegerField(default=0, null=True, blank=True, verbose_name="مقدار دریافتی", help_text='مقدار به ریال')
    approved_datetime = models.DateTimeField(null=True, blank=True, verbose_name="زمان تایید")

    requested_amount = models.BigIntegerField(default=0, verbose_name="مقدار درخواستی", help_text='مقدار به ریال')
    datetime = models.DateTimeField(default=timezone.now, verbose_name="زمان")
    expiration_date = models.DateField(null=True, blank=True, verbose_name="انقضا")
    transaction = models.ForeignKey(GrantTransaction, on_delete=models.SET_NULL, null=True, blank=True, related_name='grant_request', verbose_name="گرنت تراکنش")
    STATUS_CHOICES = (
        ('sent', 'Sent'),
        ('seen', 'Seen'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('failed', 'Failed'),
        ('canceled', 'Canceled'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='sent')

    def __str__(self):
        return str(self.sender) + " -> " + str(self.receiver) + " : " + str(self.requested_amount) + " : " + str(self.approved_amount) + " : " + str(self.datetime) + " : " + str(self.expiration_date) + " : " + str(self.status)

    def approve(self, approved_amount, expiration_date, approved_grant_record):
        try:
            expiration_date = approved_grant_record.expiration_date
            with transaction.atomic():
                # Check if the GrantRecord is still valid
                if approved_grant_record.expiration_date and approved_grant_record.expiration_date < timezone.now().date():
                    raise ValueError("GrantRecord has expired and cannot be used for this request.")

                # Check if the GrantRecord has sufficient funds
                if not approved_grant_record.has_sufficient_funds(approved_amount):
                    raise ValueError("GrantRecord does not have sufficient funds.")

                self.approved_amount = approved_amount
                self.expiration_date = expiration_date
                self.approved_grant_record = approved_grant_record
                self.approved_datetime = timezone.now()

                if self.transaction:
                    self.transaction.amount = approved_amount
                else:
                    self.transaction = GrantTransaction.objects.create(
                        sender=self.receiver,
                        receiver=self.sender,
                        amount=self.approved_amount,
                        expiration_date=expiration_date,
                        grant_record=approved_grant_record
                    )

                self.transaction.pay()
                self.status = 'approved'
                self.save()
        except Exception as e:
            self.status = 'failed'
            self.save()
            print(f"Error in approve: {e}")

    #
    # def approve(self, approved_amount, expiration_date):
    #     try:
    #         expiration_date = self.approved_grant_record.expiration_date
    #         self.approved_amount = approved_amount
    #         self.expiration_date = expiration_date
    #         self.approved_datetime = timezone.now()
    #         if self.transaction:
    #             self.transaction.amount = approved_amount
    #         else:
    #             self.transaction = GrantTransaction.objects.create(sender=self.receiver, receiver=self.sender,
    #                                                                amount=self.approved_amount,
    #                                                                expiration_date=expiration_date,
    #                                                                grant_record=self.approved_grant_record)
    #         self.transaction.pay()
    #         self.status = 'approved'
    #         self.save()
    #     except:
    #         pass

    def owners(self):
        return [self.sender, self.receiver]


class OTPserver(models.Model):
    username = models.CharField(max_length=64, null=True, blank=True)
    password = models.CharField(max_length=64, null=True, blank=True)
    token_expiration = models.DateTimeField(null=True, blank=True)
    token = models.CharField(max_length=512, null=True, blank=True)
    base_url = models.URLField(null=True, blank=True)  #  https://sms.sharif.ir/api

    def send_quick_message(self, phone_numbers, message):
        if self.check_token():
            headers = {"Content-Type": "application/json", "Authorization": f"Bearer {self.token}"}
            data = {"Mobile": phone_numbers, "Message": message}
            response = requests.post(f'{self.base_url}/sms/send', data=json.dumps(data), headers=headers)
            # if response.status_code == 200:
            return json.loads(response.text)


    def get_new_token(self):
        headers = {"Content-Type": "application/json"}
        data = {"Username": self.username, "Password": self.password}
        response = requests.post(f'{self.base_url}/system/Authenticate', data=json.dumps(data), headers=headers)
        if response.status_code == 200:
            result = json.loads(response.text)
            self.token = result['token']
            self.token_expiration = result['expiration']
            self.save()
        else:
            pass

    def check_token(self):
        if self.token_expiration:
            if self.token_expiration < timezone.now(): # datetime.datetime.now()
                self.get_new_token()
                return True
            else:
                return True
        else:
            self.get_new_token()
            return True


class Notification(models.Model):
    TYPE_CHOICES = (
        ('danger', 'هشدار'),
        ('warning', 'اخطار'),
        ('success', 'موفقیت'),
        ('info', 'اطلاعات'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="کاربر")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name="نوع")
    title = models.CharField(blank=True, null=True, max_length=100, verbose_name="عنوان")
    content = models.TextField(verbose_name="محتوا")
    is_read = models.BooleanField(default=False, verbose_name="خوانده شده")

    read_at = models.DateTimeField(blank=True, null=True, verbose_name="تاریخ خوانده شده")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "اعلان"
        verbose_name_plural = "اعلان‌ها"

    def __str__(self):
        return '{} ({}...)'.format(self.title, self.content[:30])

    def owners(self):
        return [self.user]
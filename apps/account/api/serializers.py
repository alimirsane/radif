import datetime
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token

from apps.account.models import User, EducationalLevel, EducationalField, Role, AccessLevel, GrantRequest, \
    GrantTransaction, Notification, GrantRecord
from apps.core.functions import process_excel_and_create_grant_records


class AccessLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessLevel
        exclude = []


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        exclude = ['access_level']


class UserFullSerializer(serializers.ModelSerializer):

    access_level_obj = AccessLevelSerializer(source='access_level', read_only=True)
    role_obj = RoleSerializer(source='role', read_only=True)

    class Meta:
        model = User
        exclude = []


class UserSummerySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username']


class UserBusinessLinkedAccountsSerializer(serializers.ModelSerializer):

    token = serializers.SerializerMethodField(read_only=True)
    def get_token(self, obj):
        token, created = Token.objects.get_or_create(user=obj)
        return str(token)

    class Meta:
        model = User
        fields = ['id', 'username', 'company_national_id', 'company_name', 'token']


class UserSerializer(serializers.ModelSerializer):

    access_level_obj = AccessLevelSerializer(source='access_level', read_only=True, many=True)
    access_levels_dict = serializers.SerializerMethodField(read_only=True)
    role_obj = RoleSerializer(source='role', read_only=True, many=True)
    # business_accounts = UserBusinessLinkedAccountsSerializer(source='linked_to_users', read_only=True, many=True)

    class Meta:
        model = User
        exclude = ['is_superuser', 'is_staff', 'is_active', 'date_joined', 'user_permissions', 'groups']

        extra_kwargs = {
            'password': {'write_only': True, 'required': False},  # Ensure password is write only
        }

    def get_access_levels_dict(self, obj):
        access_levels_dict = obj.get_dict_access_level()
        return access_levels_dict

    def create(self, validated_data):
        if validated_data.get('password'):
            validated_data['password'] = make_password(validated_data.get('password'))
        else:
            validated_data['password'] = make_password(validated_data.get('national_id'))
        return super().create(validated_data)


#
# class UserRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
#
#     class Meta:
#         model = User
#         fields = ('username', 'password', 'first_name', 'last_name', 'account_type')
#
#     def create(self, validated_data):
#         user = User.objects.create_user(**validated_data)
#         return user


class UserPersonalSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'national_id', 'email', 'student_id',
                  'educational_level', 'educational_field', 'postal_code')
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure password is write only
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        obj = super().create(validated_data)
        obj.set_customer_role()
        return obj

    def validate(self, attrs):
        if User.objects.filter(username=attrs.get('phone_number')).exists():
            msg = {'تلفن همراه': 'کاربر با این شماره وجود دارد.'}
            raise serializers.ValidationError(msg, code='authorization')
        elif User.objects.filter(national_id=attrs.get('national_id')).exists():
            msg = {'شماره ملی': 'کاربر با این شماره ملی وجود دارد.'}
            raise serializers.ValidationError(msg, code='authorization')
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'national_id', 'email', 'student_id',
                  'educational_level', 'educational_field', 'postal_code', 'address')
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure password is write only
            'national_id': {'read_only': True},
            'username': {'read_only': True},
        }

    def update(self, instance, validated_data):
        if validated_data.get('password'):
            validated_data['password'] = make_password(validated_data.get('password'))
        return super().update(instance, validated_data)


class UserBusinessSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        # Extracting data for personal account
        personal_data = validated_data.copy()
        personal_data['account_type'] = 'personal'

        # Creating personal account
        personal_serializer = UserPersonalSerializer(data=personal_data)
        personal_serializer.is_valid(raise_exception=True)
        personal_account = personal_serializer.save()

        # Creating business account
        validated_data['account_type'] = 'business'
        validated_data['username'] = validated_data['company_national_id']  # Add personal account to linked_users
        validated_data['national_id'] = f'co{validated_data["company_national_id"]}' # Add personal account to linked_users
        validated_data['password'] = make_password(validated_data.get('password'))
        business_serializer = self.Meta.model.objects.create(**validated_data)
        business_serializer.linked_users.set([personal_account])
        business_serializer.set_customer_role()

        return business_serializer

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email', 'company_national_id', 'company_name',
                  'postal_code', 'company_telephone', 'address', 'national_id')
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure password is write only
        }

# UserRegistrationSerializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        account_type = validated_data.pop('account_type', 'personal')
        if account_type == 'personal':
            serializer_class = UserPersonalSerializer
        else:
            serializer_class = UserBusinessSerializer

        serializer = serializer_class(data=validated_data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    class Meta:
        model = User
        fields = ('username', 'password', 'user_type', 'account_type', 'first_name', 'last_name', 'national_id',
                  'email', 'company_national_id', 'postal_code', 'address', 'company_name', 'company_telephone',
                  'student_id', 'educational_level', 'educational_field'
                  )
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure password is write only
        }


class EducationalFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationalField
        exclude = []


class EducationalLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationalLevel
        exclude = []


class GrantTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrantTransaction
        exclude = []


class GrantRecordSerializer(serializers.ModelSerializer):
    receiver_obj = UserSummerySerializer(source='receiver', read_only=True)
    file = serializers.FileField(write_only=True, required=False)
    remaining_grant = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = GrantRecord
        exclude = []

    def __init__(self, *args, **kwargs):
        super(GrantRecordSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request', None)
        if request and request.FILES.get('file'):
            for field_name, field in self.fields.items():
                if field_name not in ['file']:
                    field.required = False

    def create(self, validated_data):
        excel_file = self.context['request'].FILES.get('file', None)
        if excel_file:
            return process_excel_and_create_grant_records(excel_file)
        else:
            return super().create(validated_data)

    def get_remaining_grant(self, obj):
        return obj.remaining_grant()

class GrantRequestSerializer(serializers.ModelSerializer):
    transaction_obj = GrantTransactionSerializer(source='transaction', read_only=True)
    sender_obj = UserSummerySerializer(source='sender', read_only=True)
    receiver_obj = UserSummerySerializer(source='receiver', read_only=True)

    class Meta:
        model = GrantRequest
        exclude = ['transaction']

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class GrantRequestApprovedSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrantRequest
        fields = ('approved_amount', 'expiration_date', 'approved_grant_record')

    def validate(self, attrs):
        if attrs.get('approved_amount') < 50000:
            raise serializers.ValidationError("The approved amount must be greater than 50,000 rials.")
        if not attrs.get('approved_grant_record').has_sufficient_funds(attrs.get('approved_amount')):
            raise serializers.ValidationError("You don't have enough grant in this grant record.")
        if datetime.date.today() > attrs.get('approved_grant_record').expiration_date:
            raise serializers.ValidationError("The grant record expired!")
        return attrs

    def update(self, instance, validated_data):
        approved_amount = validated_data.get('approved_amount', None)
        expiration_date = validated_data.get('expiration_date', None)
        approved_grant_record = validated_data.get('approved_grant_record', None)
        instance.approve(approved_amount, expiration_date, approved_grant_record)
        return instance


class LansnetGrantSerializer(serializers.Serializer):
    national_id = serializers.CharField(max_length=20, write_only=True)
    type = serializers.ChoiceField(choices=('1', '2'), write_only=True)
    services = serializers.CharField(max_length=100, write_only=True)


class OTPRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)

    def validate(self, attrs):
        if User.objects.filter(username=attrs.get('phone_number')).exists():
            return attrs
        else:
            msg = {'تلفن همراه': 'کاربر با این شماره وجود ندارد.'}
            raise serializers.ValidationError(msg, code='authorization')


class OTPVerificationSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(max_length=64)

    def validate(self, attrs):
        if User.objects.filter(username=attrs.get('phone_number')).exists():
            return attrs
        else:
            msg = {'تلفن همراه': 'کاربر با این شماره وجود ندارد.'}
            raise serializers.ValidationError(msg, code='authorization')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class NotificationReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['is_read', 'read_at']


class UPOAuthTokenSerializer(serializers.Serializer):
    username = serializers.CharField(
        label=_("Username"),
        write_only=True
    )
    password = serializers.CharField(
        label=_("Password"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True,
        required=False
    )
    token = serializers.CharField(
        label=_("Token"),
        read_only=True
    )
    otp = serializers.CharField(
        label=_("OTP"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True,
        required=False
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        otp = attrs.get('otp')

        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)

            if not user:
                temp_user = User.objects.filter(username=username)
                if temp_user.exists():
                    msg = {'پسورد': 'پسورد اشتباه است.'}
                    raise serializers.ValidationError(msg, code='authorization')
                msg = {'نام کاربری': 'کاربر با این شماره وجود ندارد.'}
                raise serializers.ValidationError(msg, code='authorization')
        elif username and otp:
            otp_user = User.objects.filter(username=username)
            if otp_user.exists():
                if otp_user.first().OTP == otp:
                    user = otp_user.first()
                else:
                    msg = {'کد': 'کد اشتباه است.'}
                    raise serializers.ValidationError(msg, code='authorization')
            else:
                msg = {'نام کاربری': 'کاربر با این شماره وجود ندارد.'}
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'باید شامل نام کاربری و پسورد یا نام کاربری و کد باشد.'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs

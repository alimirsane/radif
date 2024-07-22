from django.urls import path, include
import django_cas_ng.views as django_cas_ng
from apps.account.api.views import *
# from apps.account.api.views import UserListAPIView, UserDetailAPIView, obtain_auth_token, GetCurrentUserView, \
#     UserRegistrationAPIView, EducationalFieldListAPIView, EducationalLevelListAPIView, EducationalFieldDetailAPIView, \
#     EducationalLevelDetailAPIView, RoleDetailAPIView, RoleListAPIView, AccessLevelDetailAPIView, AccessLevelListAPIView

urlpatterns = [
    path('', include('rest_framework.urls'), name='api_auth'),
    path('token-auth/', obtain_auth_token, name='api_auth'),
    path('register/', UserRegistrationAPIView.as_view(), name='register'),
    path("current-user/", GetCurrentUserView.as_view(), name='get-current-user'),
    # path("current-user/access-levels", GetCurrentUserAccessLevelView.as_view(), name='get-current-user-acess-levels'),

    path('request-otp/', OTPRequestView.as_view(), name='request_otp'),
    path('verify-otp/', OTPVerificationView.as_view(), name='verify_otp'),

    path('users/', UserListAPIView.as_view(), name='users-list'),
    path('users/<int:pk>/', UserDetailAPIView.as_view(), name='user-detail'),

    path('users/my-profile/', UserProfileAPIView.as_view(), name='user-profile-detail'),

    path('educational-fields/', EducationalFieldListAPIView.as_view(), name='requests-list'),
    path('educational-fields/<int:pk>/', EducationalFieldDetailAPIView.as_view(), name='request-detail'),

    path('educational-level/', EducationalLevelListAPIView.as_view(), name='department-list'),
    path('educational-level/<int:pk>/', EducationalLevelDetailAPIView.as_view(), name='department-detail'),

    path('role/', RoleListAPIView.as_view(), name='role-list'),
    path('role/<int:pk>/', RoleDetailAPIView.as_view(), name='role-detail'),

    path('access-level/', AccessLevelListAPIView.as_view(), name='access-level-list'),
    path('access-level/<int:pk>/', AccessLevelDetailAPIView.as_view(), name='access-level-detail'),

    path('grant-transaction/', GrantTransactionListAPIView.as_view(), name='grant-transaction-list'),
    path('grant-transaction/<int:pk>/', GrantTransactionDetailAPIView.as_view(), name='grant-transaction-detail'),

    path('grant-record/', GrantRecordListAPIView.as_view(), name='grant-record-list'),
    path('grant-record/<int:pk>/', GrantRecordDetailAPIView.as_view(), name='grant-record-detail'),

    path('grant-labsnet/', CheckLabsnetGrantAPIView.as_view(), name='grant-labsnet-list'),
    path('grant-request/', GrantRequestListAPIView.as_view(), name='grant-request-list'),
    path('grant-request/<int:pk>/', GrantRequestDetailAPIView.as_view(), name='grant-request-detail'),
    path('grant-request/<int:pk>/approved/', GrantRequestApprovedAPIView.as_view(), name='grant-request-detail-approved'),

    path("notification/", NotificationList.as_view(), name='notification-list'),
    path("notification/create/", NotificationCreate.as_view(), name='notification-create'),
    path("notification/<int:pk>/", NotificationDetail.as_view(), name='notification-detail'),
    path("notification/<int:pk>/read/", NotificationReadDetail.as_view(), name='notification-detail'),
    path("notification/read-all", NotificationReadAllList.as_view(), name='notification-list'),

    path('sso/', django_cas_ng.LoginView.as_view(), name='cas_ng_login'),
    path('slo/', django_cas_ng.LogoutView.as_view(), name='cas_ng_logout'),

]

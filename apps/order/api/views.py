import json

from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from django.shortcuts import get_object_or_404, render

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, RetrieveAPIView, \
    UpdateAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

# from apps.account.models import get_user_group
# from apps.account.permissions import IsExpertOrAdminOrManager
from apps.core.functions import export_excel
from apps.core.paginations import DefaultPagination
from apps.account.permissions import IsExpertOrAdminOrManager, AccessLevelPermission
from apps.order.api.filters import PaymentRecordFilter
from apps.order.models import Order, PaymentRecord, Transaction, PromotionCode, Ticket
from apps.order.api.serializers import OrderSerializer, OrderDetailSerializer, OrderIssueSerializer, \
    OrderCancelSerializer, OrderPaymentSerializer, PaymentRecordSerializer, OrderBoughtSerializer, \
    PromotionCodeSerializer, PaymentSummarySerializer, \
    PaymentRecordListSerializer, PaymentRecordConfirmSerializer, PaymentRecordInvoiceSerializer, \
    OrderPaymentRecordSerializer
# PromotionCodeStrSerializer,TransactionSerializer
# TicketSerializer, SubscriptionSerializer
# from apps.order.zarrinpal import ZarrinPalConfirmSerializer, ZarrinPalSerializer
# from applications.service.models import Service
from SLIMS.envs import common as settings
from SLIMS.renderers import SLIMSJSONRenderer


class OrderIssueView(CreateAPIView):
    """
    post:
    Create an order for a service.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    # permission_classes = [IsAuthenticated]
    # permission_classes = [HasViewAccess, CanIssueOrder]
    # set_user = True
    # model_name = 'order'


class OrderListView(ListAPIView):
    """
    get:
    Get a list of orders for Manager panel.
    """
    # permission_classes = [HasViewAccess, CanIssueOrder]
    # permission_classes = [IsAuthenticated, IsExpertOrAdminOrManager]
    serializer_class = OrderBoughtSerializer

    pagination_class = DefaultPagination
    filterset_fields = {'buyer': ['exact', 'in'],
                        'order_type': ['exact', 'in'],
                        'order_status': ['exact', 'in'],
                        }
    def get_queryset(self):
        queryset = Order.objects.all().exclude(order_status='canceled')

        return queryset.distinct().order_by("-order_status", "-created_at")


class OrderBoughtListView(ListAPIView):
    """
    get:
    Get a list of orders bought by current user.
    """
    # permission_classes = [IsAuthenticated]
    serializer_class = OrderBoughtSerializer

    pagination_class = DefaultPagination
    filterset_fields = {'order_type': ['exact', 'in'],
                        'order_status': ['exact', 'in'],
                        }
    def get_queryset(self):
        queryset = Order.objects.all().exclude(order_status='canceled')

        queryset = queryset.filter(buyer=self.request.user.profile)

        return queryset.distinct().order_by("-order_status", "-created_at")

    # set_user = True
    # model_name = 'order'


class OrderDetailView(RetrieveAPIView):
    """
        get:
        Show full details of a single order item.
    """
    # permission_classes = [HasViewAccess, CanSeeService]
    serializer_class = OrderDetailSerializer

    def get_queryset(self):
        queryset = Order.objects.all().exclude(order_status='canceled')

        # if not get_user_group(self.request.user) == 'manager' or get_user_group(self.request.user) == 'admin':
        #     queryset = queryset.filter(Q(buyer=self.request.user.profile))

        return queryset.distinct()


class OrderCompleteView(UpdateAPIView):
    # permission_classes = [HasViewAccess, IsBuyer]
    serializer_class = OrderSerializer
    # set_user = True
    # model_name = 'order'
    # lookup_field = 'pk'
    # lookup_url_kwarg = 'pk'

    def get_queryset(self):
        queryset = Order.objects.filter(order_status='pending')
        if self.request:
            queryset = queryset.filter(buyer=self.request.user).distinct()

        return queryset


class OrderPaymentView(UpdateAPIView):
    # permission_classes = [HasViewAccess, IsBuyer]
    serializer_class = OrderPaymentSerializer

    def get_queryset(self):
        # application = get_application(self.request)
        queryset = Order.objects.filter(order_status='pending')

        # if application and not application.is_super_app:
        #     queryset = queryset.filter(service__application=application)

        queryset = queryset.filter(buyer=self.request.user)

        return queryset


class OrderCancelView(UpdateAPIView):
    """
    put:
    Cancel a pending order.
    patch:
    Cancel a pending order.
    """
    # permission_classes = [HasViewAccess, IsBuyer]
    serializer_class = OrderCancelSerializer

    def get_queryset(self):
        queryset = Order.objects.filter(order_status='pending')

        queryset = queryset.filter(buyer=self.request.user)

        return queryset.distinct()

#
# class PaymentRequestView(CreateAPIView):
#     """
#     post:
#     Use this endpoint to request account charge.
#     """
#     # permission_classes = [HasViewAccess, CanIssueOrder]
#     serializer_class = PaymentRecordSerializer
#     set_user = True
#
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#
#         if self.set_user:
#             serializer.user = request.user
#
#         serializer.is_valid(raise_exception=True)
#         payment_record = serializer.save()
#         headers = self.get_success_headers(serializer.data)
#
#         pasargad_data = {}
#         payment_type = 'credit'
#         if payment_record.order:
#             payment_type = 'order'
#         pasargad_serializer = ZarrinPalSerializer(payment_record.amount, payment_record.transaction_code)
#         if pasargad_serializer.is_valid():
#             pasargad_data = pasargad_serializer.data
#         data = serializer.data
#         # data['pasargad'] = pasargad_data
#         data['url'] = settings.PAYMENT_PROCESS_URL.format(settings.API_URL, payment_record.transaction_code)
#         try:
#             data['gateway_url'] = pasargad_serializer.gateway
#         except:
#             pass
#         jsonR = SLIMSJSONRenderer()  # 'http://127.0.0.1:7940/orders/payment/process/?transaction_code=3621491903'
#         # jsonR = JSONRenderer()
#         # return jsonR.render(data=data)
#         # return JsonResponse(jsonR.render(data=json.dumps(data)))
#         return Response(data=data, status=status.HTTP_201_CREATED, headers=headers)
#         # return Response(ApiResponse.get_base_response(response_code=status.HTTP_201_CREATED, data=data, ),
#         #                 status=status.HTTP_201_CREATED, headers=headers)
#
#
# class PaymentConfirmView(CreateAPIView):
#     # permission_classes = [HasViewAccess]
#     serializer_class = ZarrinPalConfirmSerializer
#     # set_user = True
#     # model_name = 'response'

#
# class TicketListView(ListCreateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = TicketSerializer
#     pagination_class = DefaultPagination
#
#     queryset = Transaction.objects.all()
#     def get_queryset(self):
#         queryset = Ticket.objects.all()
#         queryset = queryset.filter(order__buyer=self.request.user.profile)
#         return queryset.distinct().order_by("-created_at")
#
#
# class TicketManagerListView(ListCreateAPIView):
#     permission_classes = [IsAuthenticated, IsExpertOrAdminOrManager]
#     serializer_class = TicketSerializer
#     pagination_class = DefaultPagination
#
#     queryset = Ticket.objects.all().order_by("-created_at")
#     filterset_fields = {'order__event': ['exact', 'in'],
#                         'order__order_code': ['exact', 'in'],
#                         'profile': ['exact', 'in'],
#                         }
#
#
# class TicketDetailView(RetrieveUpdateDestroyAPIView):
#     permission_classes = [IsAuthenticated, IsExpertOrAdminOrManager]
#     serializer_class = TicketSerializer
#
#     queryset = Ticket.objects.all()

#
# class SubscriptionListView(ListCreateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = SubscriptionSerializer
#     pagination_class = DefaultPagination
#
#     queryset = Subscription.objects.all()
#     def get_queryset(self):
#         queryset = Subscription.objects.all()
#         queryset = queryset.filter(order__buyer=self.request.user.profile)
#         return queryset.distinct().order_by("-start_date")

#
# class SubscriptionManagerListView(ListCreateAPIView):
#     permission_classes = [IsAuthenticated, IsExpertOrAdminOrManager]
#     serializer_class = SubscriptionSerializer
#     pagination_class = DefaultPagination
#
#     queryset = Subscription.objects.all().order_by("-start_date")
#     filterset_fields = {'order__event': ['exact', 'in'],
#                         'order__order_code': ['exact', 'in'],
#                         'profile': ['exact', 'in'],
#                         }

#
# class SubscriptionDetailView(RetrieveUpdateDestroyAPIView):
#     permission_classes = [IsAuthenticated, IsExpertOrAdminOrManager]
#     serializer_class = SubscriptionSerializer
#
#     queryset = Subscription.objects.all()

#
# class TransactionListView(ListCreateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = TransactionSerializer
#     pagination_class = DefaultPagination
#
#     queryset = Transaction.objects.all()
#     def get_queryset(self):
#         queryset = Transaction.objects.all().exclude(order__order_status='canceled')
#
#         queryset = queryset.filter(order__buyer=self.request.user.profile)
#
#         return queryset.distinct().order_by("-created_at")
#
#
# class TransactionManagerListView(ListCreateAPIView):
#     permission_classes = [IsAuthenticated, IsExpertOrAdminOrManager]
#     serializer_class = TransactionSerializer
#     pagination_class = DefaultPagination
#
#     queryset = Transaction.objects.all()
#
#
# class TransactionDetailView(RetrieveUpdateDestroyAPIView):
#     permission_classes = [IsAuthenticated, IsExpertOrAdminOrManager]
#     serializer_class = TransactionSerializer
#
#     queryset = Transaction.objects.all()
#
#

class PromotionCodeListView(ListCreateAPIView):
    # permission_classes = [IsAuthenticated, IsExpertOrAdminOrManager]
    serializer_class = PromotionCodeSerializer
    pagination_class = DefaultPagination

    queryset = PromotionCode.objects.all()


class PromotionCodeDetailView(RetrieveUpdateDestroyAPIView):
    # permission_classes = [IsAuthenticated, IsExpertOrAdminOrManager]
    serializer_class = PromotionCodeSerializer

    queryset = PromotionCode.objects.all()

#
# class PromotionCodeStrView(RetrieveAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = PromotionCodeStrSerializer
#
#     queryset = PromotionCode.objects.all()
#
#     def get_object(self):
#         return get_object_or_404(PromotionCode, code=self.kwargs['code'])


class PaymentRecordListView(ListAPIView):
    """
    get:
    Get a list of payment records by current user.
    """
    # permission_classes = [HasViewAccess, CanIssueOrder]
    # permission_classes = [IsAuthenticated]
    serializer_class = PaymentRecordListSerializer
    filterset_class = PaymentRecordFilter

    pagination_class = DefaultPagination
    # filterset_fields = {'event': ['exact', 'in'],
    #                     'buyer': ['exact', 'in'],
    #                     'order_type': ['exact', 'in'],
    #                     'order_status': ['exact', 'in'],
    #                     }
    def get_queryset(self):
        queryset = PaymentRecord.objects.all().exclude(order__order_status='canceled')

        queryset = queryset.filter(payer=self.request.user)

        return queryset.distinct().order_by("-created_at")

    # set_user = True
    # model_name = 'order'
    #
    # def get(self, request, *args, **kwargs):
    #     get_list = self.list(request, *args, **kwargs)
    #     if self.request.query_params.get('export_excel', 'False').lower() == 'true':
    #         ids = [r.id for r in get_list.data['results'].serializer.instance]
    #         qs = PaymentRecord.objects.filter(id__in=ids)
    #         file_url = export_excel(qs)
    #         if file_url:
    #             full_url = self.request.build_absolute_uri(file_url)
    #             return Response({'file_url': full_url})
    #         return Response({'error': 'Export failed'}, status=500)
    #     else:
    #         return get_list

    def handle_export_excel(self, queryset):
        file_url = export_excel(queryset)
        if file_url:
            full_url = self.request.build_absolute_uri(file_url)
            return Response({'file_url': full_url})  # full_url.replace('http://', 'https://')})
        return Response({'error': 'Export failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if request.query_params.get('export_excel', 'False').lower() == 'true':
            return self.handle_export_excel(queryset)

        return super().get(request, *args, **kwargs)

class PaymentRecordManagerListView(ListCreateAPIView):
    """
    get:
    Get a list of payment records by manager user.
    """
    # permission_classes = [IsAuthenticated, IsExpertOrAdminOrManager]
    serializer_class = PaymentRecordListSerializer
    queryset = PaymentRecord.objects.all().order_by("-created_at")
    filterset_class = PaymentRecordFilter

    pagination_class = DefaultPagination
    # filterset_fields = {'event': ['exact', 'in'],
    #                     'buyer': ['exact', 'in'],
    #                     'order_type': ['exact', 'in'],
    #                     'order_status': ['exact', 'in'],
    #                     }
    def get_queryset(self):
        queryset = PaymentRecord.objects.all()
        return queryset.order_by("-created_at")

    def get_serializer_class(self):
        if self.request.query_params.get('invoice_print', 'False').lower() == 'true':
            return PaymentRecordInvoiceSerializer
        return PaymentRecordListSerializer
    #
    # def get(self, request, *args, **kwargs):
    #     get_list = self.list(request, *args, **kwargs)
    #     if self.request.query_params.get('export_excel', 'False').lower() == 'true':
    #         ids = [r.id for r in get_list.data['results'].serializer.instance]
    #         qs = PaymentRecord.objects.filter(id__in=ids)
    #         file_url = export_excel(qs)
    #         if file_url:
    #             full_url = self.request.build_absolute_uri(file_url)
    #             return Response({'file_url': full_url})
    #         return Response({'error': 'Export failed'}, status=500)
    #     else:
    #         return get_list

    def handle_export_excel(self, queryset):
        file_url = export_excel(queryset)
        if file_url:
            full_url = self.request.build_absolute_uri(file_url)
            return Response({'file_url': full_url})  # full_url.replace('http://', 'https://')})
        return Response({'error': 'Export failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if request.query_params.get('export_excel', 'False').lower() == 'true':
            return self.handle_export_excel(queryset)

        return super().get(request, *args, **kwargs)


class PaymentRecordConfirmDetailView(UpdateAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = PaymentRecordConfirmSerializer

    queryset = PaymentRecord.objects.all()

    # def get_queryset(self):
    #     return PaymentRecord.objects.get(transaction_code=self.kwargs['id2'])

    def get_object(self):
        return PaymentRecord.objects.get(transaction_code=self.kwargs['id2'])


class PaymentRecordTRefDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = OrderPaymentRecordSerializer
    # permission_classes = [AccessLevelPermission]
    # required_access_levels = ['update_all_paymentrecord', 'update_owner_paymentrecord']
    # view_key = 'paymentrecord'
    queryset = PaymentRecord.objects.all()

    # def get_queryset(self):
    #     return PaymentRecord.objects.get(transaction_code=self.kwargs['id2'])

    # def get_object(self):
    #     return PaymentRecord.objects.get(transaction_code=self.kwargs['id2'])

#
#
#
# @csrf_exempt
# def gateway(request):
#     transaction_code = request.GET.get('transaction_code', None)
#     data = {'page_title': settings.SITE_NAME, 'dev_mode': settings.DEV_MODE}
#     data['success'] = False
#
#     if transaction_code:
#         payment_record = get_object_or_404(PaymentRecord, transaction_code=transaction_code)
#         payment_serializer = ZarrinPalSerializer(payment_record.amount, payment_record.transaction_code)
#         if payment_serializer.is_valid(raise_exception=True):
#             data['success'] = True
#
#             payment_data = payment_serializer.data
#             data['fields'] = []
#             for field in payment_data:
#                 data['fields'].append({'name': field, 'value': payment_data[field]})
#
#             if data['dev_mode']:
#                 data['gateway'] = "%s?%s=%s" % (
#                     settings.PAYMENT_REDIRECT_URL.format(settings.API_URL), payment_serializer.reference_key,
#                     transaction_code)
#             else:
#                 if hasattr(payment_serializer, 'gateway'):
#                     data['gateway'] = payment_serializer.gateway
#                 else:
#                     data['gateway'] = ''
#         data['payment_record'] = payment_record
#
#     return render(request, 'gateway.html', data)
#
# @csrf_exempt
# def confirm(request):
#     # todo check re-directions after payment
#     front_url = settings.FRONTEND_URL
#     if front_url.endswith('/'):
#         front_url = front_url[:-1]
#     front_url = "https://%s" % front_url
#
#     # if settings.SSL:
#     #     front_url = "https://%s" % front_url
#     # else:
#     #     front_url = "http://%s" % front_url
#
#     app_link = "/"
#
#     data = {
#         'page_title': settings.SITE_NAME,
#         'app_link': app_link,
#         'front_url': front_url
#     }
#
#     payment_serializer = ZarrinPalConfirmSerializer(data=request.GET)
#     if payment_serializer.is_valid(raise_exception=False):
#         data['success'] = True
#
#         if payment_serializer.payment_type == 'order':
#             # app_link = payment_serializer.payment_transaction.order.service.vitrin_link
#             app_link = settings.FRONT_BALANCE_PAGE.format('')
#         else:
#             app_link = settings.FRONT_BALANCE_PAGE.format('')
#
#         data['app_link'] = app_link
#         data['payment_record'] = payment_serializer.payment_transaction
#
#     else:
#         data['success'] = False
#         data['errors'] = payment_serializer.errors
#
#     return render(request, 'confirm.html', data)


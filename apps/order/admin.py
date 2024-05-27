from django.contrib import admin

from django.contrib import admin

# Register your models here.
from apps.order.models import PromotionCode, Order, PaymentRecord, Transaction, Ticket


class PromotionCodeAdmin(admin.ModelAdmin):
    list_display = ['code', 'percent_off', 'usable_count', 'used_count', 'active']


admin.site.register(PromotionCode, PromotionCodeAdmin)


class OrderAdmin(admin.ModelAdmin):
    list_display = ['buyer', 'order_type', 'order_status', 'amount', 'paid', 'order_code', 'created_at', 'updated_at']


admin.site.register(Order, OrderAdmin)


class PaymentRecordAdmin(admin.ModelAdmin):
    list_display = ['payer', 'order', 'payment_type', 'amount', 'successful', 'charged', 'transaction_code', 'created_at', 'updated_at']


admin.site.register(PaymentRecord, PaymentRecordAdmin)


class TransactionAdmin(admin.ModelAdmin):
    list_display = ['profile', 'order', 'amount', 'returned', 'created_at', 'updated_at']


admin.site.register(Transaction, TransactionAdmin)


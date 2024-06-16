from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from datetime import timedelta


class Queue(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ]

    name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    time_interval = models.DurationField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')  # فیلد وضعیت صف

    def __str__(self):
        return self.name

    def get_appointments(self):
        return Appointment.objects.filter(queue=self).order_by('start_time')


class Appointment(models.Model):
    queue = models.ForeignKey(Queue, on_delete=models.CASCADE, related_name='appointments')
    start_time = models.DateTimeField()
    duration = models.DurationField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('queue', 'start_time')

    def __str__(self):
        return f"{self.user.username} - {self.start_time} ({self.duration})"

    def clean(self):
        super().clean()

        # بررسی وضعیت صف
        if self.queue.status != 'active':
            raise ValidationError("این صف فعال نیست و نمی‌توان نوبت رزرو کرد.")

        # زمان پایان نوبت جدید را محاسبه می‌کنیم
        new_end_time = self.start_time + self.duration

        # بررسی تداخل زمانی با نوبت‌های دیگر
        conflicting_appointments = Appointment.objects.filter(
            queue=self.queue,
            start_time__lt=new_end_time,
            start_time__gte=self.start_time
        ).exclude(pk=self.pk)

        for appointment in conflicting_appointments:
            appointment_end_time = appointment.start_time + appointment.duration
            if appointment.start_time < new_end_time and self.start_time < appointment_end_time:
                raise ValidationError("این بازه زمانی قبلاً رزرو شده است.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

from django.db import models
from django.utils import timezone

# Create your models here.
class Product(models.Model):
    type = models.CharField(max_length=3, default='PLR')
    price = models.DecimalField(max_digits=5, decimal_places=2)
    size_is_A4 = models.BooleanField(choices=[(True, 'A4'), (False, 'A5')])
    diary_is_weekly = models.BooleanField(choices=[(True, 'Week per View'), (False, 'Day per Page')])
    cover_type = models.BooleanField(choices=[(True, "Normal"), (False, "Bespoke")])

    def __str__(self):
        if self.type == 'PLR':
            if self.size_is_A4:
                type = 'A4 '
            else:
                type = 'A5'
            if self.diary_is_weekly:
                type += "Weekly Planner"
            else:
                type += "Daily Planner"
            return f"{type} -- £{self.price}"
        return f"{self.type} - This is not a planner"


class Schools(models.Model):
    school_name = models.CharField(max_length=128)
    school_code = models.CharField(max_length=10)
    contact_first_name = models.CharField(max_length=64)
    contact_last_name = models.CharField(max_length=64)
    email = models.EmailField()
    phone = models.IntegerField()
    address = models.CharField(max_length=256)

    def __str__(self):
        return f"{self.school_code} ({self.school_name})"


class Orders(models.Model):
    school_id = models.ForeignKey(Schools, on_delete=models.CASCADE) 
    date_time_stamp = models.DateTimeField(auto_now=True)
    #item_list = models.JSONField(default={})
    invoice = models.TextField(max_length=1024)
    total_cost = models.DecimalField(max_digits=7, decimal_places=2)
    complete = models.BooleanField(default=False)

    def __str__(self):
        return f"Order id {self.school_id} on {self.date_time_stamp.date}, complete = {self.complete}."


class Blog(models.Model):
    text = models.TextField(max_length=4096)
    author_code = models.CharField(max_length=3, default='MPD')
    date = models.DateField(default=timezone.now)
    subject = models.CharField(max_length=64)
    subject_code = models.CharField(max_length=3, default='PLR')

    def __str__(self):
        return f"{self.subject}\n{self.date} -- {self.text}"
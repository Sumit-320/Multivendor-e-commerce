from django.db import models
import json
# Create your models here.
from django.db import models
from register.models import User
from menu.models import FoodItem
from vendor.models import Vendor

request_object = ''
class Payment(models.Model):
    PAYMENT_METHOD = (
        ('PayPal', 'PayPal'),
        ('RazorPay', 'RazorPay'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100)
    payment_method = models.CharField(choices=PAYMENT_METHOD, max_length=100)
    amount = models.CharField(max_length=10)
    status = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.transaction_id


class Order(models.Model):
    STATUS = (
        ('New', 'New'),
        ('Accepted', 'Accepted'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, blank=True, null=True)
    vendors = models.ManyToManyField(Vendor, blank=True)
    order_number = models.CharField(max_length=20)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(max_length=50)
    address = models.CharField(max_length=200)
    country = models.CharField(max_length=15, blank=True)
    state = models.CharField(max_length=15, blank=True)
    city = models.CharField(max_length=50)
    pin_code = models.CharField(max_length=10)
    total = models.FloatField()
    tax_data = models.JSONField(blank=True, help_text = "Data format: {'tax_type':{'tax_percentage':'tax_amount'}}",null=True)
    total_tax = models.FloatField()
    total_data = models.JSONField(blank=True, null=True) 
    payment_method = models.CharField(max_length=25)
    status = models.CharField(max_length=15, choices=STATUS, default='New')
    is_ordered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Concatenate first name and last name
    @property
    def name(self):
        return f'{self.first_name} {self.last_name}'
    
    def get_total_by_vendor(self):
        vendor = Vendor.objects.get(user = request_object.user)
        subtotal = 0
        tax = 0 
        tax_dict = {}
        if self.total_data:
            try:
                total_data = json.loads(self.total_data)
                vendor_data = total_data.get(str(vendor.id), {})
                for key, value in vendor_data.items():
                    subtotal += float(key)
                    value = value.replace("'", '"')  # normalize quotes if needed
                    tax_items = json.loads(value)
                    tax_dict.update(tax_items)
                    for i in tax_items:
                        for j in tax_items[i]:
                            tax += float(tax_items[i][j])
            except json.JSONDecodeError:
                return {'subtotal': 0, 'tax_dict': {}, 'grand_total': 0}

                # tax
                # {'CGST':{'9.00': '10.33'}, 'SGST':{'9.00':'10.33'}}
        
        grand_total = float(subtotal)+float(tax)
        context={
            'subtotal':subtotal,
            'tax_dict':tax_dict,
            'grand_total':grand_total,
        }
        return context 
    
    def order_placed_to(self):
        return ", ".join([str(i) for i in self.vendors.all()])  # to display the multiple vendors the customer placed orders to
    def __str__(self):
        return self.order_number


class OrderedFood(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fooditem = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.FloatField()
    amount = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.fooditem.food_title
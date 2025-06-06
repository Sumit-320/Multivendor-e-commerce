from django.contrib import admin
from .models import Order,Payment,OrderedFood
# Register your models here.
class OrderedFoodInline(admin.TabularInline):
    model = OrderedFood
    readonly_fields = ('order','payment','user','fooditem','quantity','price','amount')  # to avoid extra rows in admin site
    extra = 0
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number','name','phone','email','total','payment_method','status','order_placed_to','is_ordered']
    inlines = [OrderedFoodInline]

admin.site.register(Order,OrderAdmin)
admin.site.register(Payment)
admin.site.register(OrderedFood)
from django.urls import path
from register import views as RegisterViews
from . import views

urlpatterns = [
     path('',RegisterViews.customerDashboard,name='customer'),
     path('profile/',views.cProfile,name='cProfile'),
     path('my_orders/',views.customerMyOrders,name='customerMyOrders'),
     path('order_detail/<int:order_number>/',views.orderDetails,name='orderDetails'),
     
]

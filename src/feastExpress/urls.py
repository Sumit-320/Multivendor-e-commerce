"""
URL configuration for feastExpress project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from market import views as marketviews
from . import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.home,name='home'),
    path('',include('register.urls')),
    path('cart/',marketviews.cart,name='cart'),
    path('market/',include('market.urls')),
    path('search/',marketviews.search,name='search'),
    path('checkout/',marketviews.checkout,name='checkout'),
    path('orders/',include('orders.urls')),
] + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

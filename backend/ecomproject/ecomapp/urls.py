from django.urls import path
from ecomapp import views

urlpatterns = [
    # Gateway route
    path('', views.getRoutes, name="getRoutes"),

    # Earth Observation (EO) & DSen2-CR AI APIs
    path('eo/status/', views.eo_status, name="eo_status"),
    path('eo/sample-run/', views.eo_sample_run, name="eo_sample_run"),
    path('eo/decloud/', views.eo_decloud, name="eo_decloud"),
    path('eo/upload/', views.eo_upload, name="eo_upload"),
    path('eo/rasters/', views.eo_raster_list, name="eo_rasters"),
    path('eo/pipeline/run/', views.eo_pipeline_run, name="eo_pipeline_run"),

    # Products & Auth APIs
    path('products/', views.getProducts, name="getProducts"),
    path('product/<str:pk>/', views.getProduct, name="getProduct"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/', views.getUserProfiles, name="getUserProfiles"),
    path('users/', views.getUsers, name="getUsers"),
    path('users/register/', views.registerUser, name="register"),
    path('activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name='activate'),
]

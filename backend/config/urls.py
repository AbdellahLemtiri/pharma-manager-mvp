from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from categories.views import CategorieViewSet
from medicaments.views import MedicamentViewSet
from ventes.views import VenteViewSet
from .views import RegisterView


router = DefaultRouter()
router.register(r'categories', CategorieViewSet, basename='categorie')
router.register(r'medicaments', MedicamentViewSet, basename='medicament')
router.register(r'ventes', VenteViewSet, basename='vente')

urlpatterns = [
    path('admin/', admin.site.urls),
    



    # Endpoints JWT pour l'authentification
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/v1/', include(router.urls)),
    




    #auth
    path('api/v1/register/', RegisterView.as_view(), name='auth_register'),

    # Endpoints pour Swagger
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from categories.views import CategorieViewSet
from medicaments.views import MedicamentViewSet
from ventes.views import VenteViewSet

# Configuration du router DRF pour générer automatiquement les URLs [cite: 180]
router = DefaultRouter()
router.register(r'categories', CategorieViewSet, basename='categorie')
router.register(r'medicaments', MedicamentViewSet, basename='medicament')
router.register(r'ventes', VenteViewSet, basename='vente')

urlpatterns = [
    path('admin/', admin.site.urls),
    # Tous nos endpoints commenceront par /api/v1/ comme demandé [cite: 180]
    path('api/v1/', include(router.urls)),
    
    # Endpoints pour Swagger (drf-spectacular) [cite: 281]
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
from rest_framework import viewsets
from drf_spectacular.utils import extend_schema
from .models import Categorie
from .serializers import CategorieSerializer

@extend_schema(tags=['Catégories'])
class CategorieViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les opérations CRUD sur les catégories."""
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
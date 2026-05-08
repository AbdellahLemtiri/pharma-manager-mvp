from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from drf_spectacular.utils import extend_schema
from .models import Medicament
from .serializers import MedicamentSerializer

@extend_schema(tags=['Médicaments'])
class MedicamentViewSet(viewsets.ModelViewSet):
    # N'afficher que les médicaments actifs
    queryset = Medicament.objects.filter(est_actif=True).order_by('nom')
    serializer_class = MedicamentSerializer

    def perform_destroy(self, instance):
        """Soft delete: marque le médicament comme inactif au lieu de le supprimer."""
        instance.est_actif = False
        instance.save()

    @extend_schema(summary="Liste des médicaments sous le seuil d'alerte")
    @action(detail=False, methods=['get'])
    def alertes(self, request):
        """Retourne les médicaments dont le stock actuel est <= stock minimum[cite: 69]."""
        # Utilisation de F() pour comparer deux champs du même modèle
        alertes = self.get_queryset().filter(stock_actuel__lte=F('stock_minimum'))
        serializer = self.get_serializer(alertes, many=True)
        return Response(serializer.data)
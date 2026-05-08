import csv
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from .models import Medicament
from .serializers import MedicamentSerializer

@extend_schema(tags=['Médicaments'])
class MedicamentViewSet(viewsets.ModelViewSet):
    # N'afficher que les médicaments actifs
    queryset = Medicament.objects.filter(est_actif=True).order_by('nom')
    serializer_class = MedicamentSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['categorie', 'ordonnance_requise', 'forme']  
    search_fields = ['nom', 'dci']  
    ordering_fields = ['prix_vente', 'stock_actuel'] 

    def perform_destroy(self, instance):
        """Soft delete: marque le médicament comme inactif au lieu de le supprimer."""
        instance.est_actif = False
        instance.save()

    @extend_schema(summary="Liste des médicaments sous le seuil d'alerte")
    @action(detail=False, methods=['get'])
    def alertes(self, request):
        """Retourne les médicaments dont le stock actuel est <= stock minimum."""
        # Utilisation de F() pour comparer deux champs du même modèle
        alertes = self.get_queryset().filter(stock_actuel__lte=F('stock_minimum'))
        serializer = self.get_serializer(alertes, many=True)
        return Response(serializer.data)

    @extend_schema(summary="Exporter l'inventaire en CSV")
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """Exporte la liste des médicaments filtrée en format CSV."""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="inventaire.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Nom', 'DCI', 'Forme', 'Stock Actuel', 'Stock Minimum', 'Prix Vente'])
        

        medicaments = self.filter_queryset(self.get_queryset())
        for med in medicaments:
            writer.writerow([
                med.id, 
                med.nom, 
                med.dci, 
                med.forme, 
                med.stock_actuel, 
                med.stock_minimum, 
                med.prix_vente
            ])
            
        return response
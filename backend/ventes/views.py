from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from drf_spectacular.utils import extend_schema
from .models import Vente
from .serializers import VenteSerializer

@extend_schema(tags=['Ventes'])
class VenteViewSet(viewsets.ModelViewSet):
    queryset = Vente.objects.all().order_by('-date_vente')
    serializer_class = VenteSerializer

    @extend_schema(summary="Annuler une vente et réintégrer le stock")
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def annuler(self, request, pk=None):
        """Annule la vente et réintègre les quantités dans le stock des médicaments."""
        vente = self.get_object()
        
        if vente.statut == 'ANNULEE':
            return Response(
                {"detail": "Cette vente est déjà annulée."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Réintégration des stocks
        for ligne in vente.lignes.all():
            medicament = ligne.medicament
            medicament.stock_actuel += ligne.quantite
            medicament.save()
        
        # Mise à jour du statut
        vente.statut = 'ANNULEE'
        vente.save()
        
        return Response(
            {"detail": "Vente annulée avec succès, stocks réintégrés."}, 
            status=status.HTTP_200_OK
        )
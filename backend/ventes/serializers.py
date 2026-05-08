from rest_framework import serializers
from django.db import transaction
from .models import Vente, LigneVente
from medicaments.models import Medicament

class LigneVenteSerializer(serializers.ModelSerializer):
    medicament_nom = serializers.ReadOnlyField(source='medicament.nom')

    class Meta:
        model = LigneVente
        fields = ['id', 'medicament', 'medicament_nom', 'quantite', 'prix_unitaire', 'sous_total']
        read_only_fields = ['prix_unitaire', 'sous_total']

class VenteSerializer(serializers.ModelSerializer):
    lignes = LigneVenteSerializer(many=True)

    class Meta:
        model = Vente
        fields = ['id', 'reference', 'date_vente', 'total_ttc', 'statut', 'notes', 'lignes']
        read_only_fields = ['reference', 'total_ttc', 'statut']

    @transaction.atomic
    def create(self, validated_data):
        """Crée une vente, ses lignes, et déduit le stock des médicaments."""
        lignes_data = validated_data.pop('lignes')
        vente = Vente.objects.create(**validated_data)
        
        total = 0
        for ligne_data in lignes_data:
            medicament = ligne_data['medicament']
            quantite = ligne_data['quantite']
            
            # 1. Validation du stock
            if medicament.stock_actuel < quantite:
                raise serializers.ValidationError(
                    f"Stock insuffisant pour {medicament.nom}. Disponible: {medicament.stock_actuel}"
                )
            
            # 2. Déduction du stock
            medicament.stock_actuel -= quantite
            medicament.save()
            
            # 3. Snapshot du prix et calcul du sous-total
            prix_unitaire = medicament.prix_vente
            sous_total = prix_unitaire * quantite
            total += sous_total
            
            # 4. Création de la ligne de vente
            LigneVente.objects.create(
                vente=vente,
                medicament=medicament,
                quantite=quantite,
                prix_unitaire=prix_unitaire,
                sous_total=sous_total
            )
        
        # 5. Mise à jour du total de la vente
        vente.total_ttc = total
        vente.save()
        return vente
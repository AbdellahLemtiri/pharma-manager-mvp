from rest_framework import serializers
from .models import Medicament

class MedicamentSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Medicament avec validation métier."""
    class Meta:
        model = Medicament
        fields = '__all__'

    def validate(self, data):
        """Valide que le prix de vente est supérieur ou égal au prix d'achat."""
        prix_achat = data.get('prix_achat', self.instance.prix_achat if self.instance else None)
        prix_vente = data.get('prix_vente', self.instance.prix_vente if self.instance else None)
        
        if prix_achat and prix_vente and prix_vente < prix_achat:
            raise serializers.ValidationError({
                "prix_vente": "Le prix de vente ne peut pas être inférieur au prix d'achat."
            })
        return data
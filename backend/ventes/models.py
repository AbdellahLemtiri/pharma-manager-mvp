from django.db import models
from medicaments.models import Medicament
import uuid

class Vente(models.Model):
    STATUT_CHOICES = [
        ('EN_COURS', 'En cours'),
        ('COMPLETEE', 'Complétée'),
        ('ANNULEE', 'Annulée'),
    ]
    
    reference = models.CharField(max_length=50, unique=True, editable=False)
    date_vente = models.DateTimeField(auto_now_add=True)
    total_ttc = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='COMPLETEE')
    notes = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Générer une référence unique si elle n'existe pas
        if not self.reference:
            self.reference = f"VNT-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference} - {self.total_ttc} MAD"

class LigneVente(models.Model):
    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='lignes')
    medicament = models.ForeignKey(Medicament, on_delete=models.PROTECT)
    quantite = models.PositiveIntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2) # Snapshot du prix au moment de la vente
    sous_total = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        # Calculer le sous-total automatiquement
        self.sous_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantite}x {self.medicament.nom} ({self.vente.reference})"
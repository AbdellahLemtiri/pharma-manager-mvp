from django.db import models

class Medicament(models.Model):
    """
    Représente un médicament dans l'inventaire de la pharmacie.
    Attributs:
        nom (str): Nom commercial du médicament.
        stock_actuel (int): Quantité disponible en stock.
        stock_minimum (int): Seuil déclenchant une alerte de réapprovisionnement.
        est_actif (bool): Soft delete. False = médicament archivé.
    """
    
    nom = models.CharField(max_length=200, verbose_name='Nom commercial')
    dci = models.CharField(max_length=200, verbose_name='DCI', blank=True)
    categorie = models.ForeignKey(
        'categories.Categorie',
        on_delete=models.PROTECT,
        related_name='medicaments',
        verbose_name='Catégorie'
    )
    forme = models.CharField(max_length=100, verbose_name='Forme galénique', default='Comprimé')
    dosage = models.CharField(max_length=100, verbose_name='Dosage')
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix d'achat")
    prix_vente = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix de vente")
    stock_actuel = models.PositiveIntegerField(default=0)
    stock_minimum = models.PositiveIntegerField(default=10)
    date_expiration = models.DateField(verbose_name="Date d'expiration")
    ordonnance_requise = models.BooleanField(default=False, verbose_name="Ordonnance requise")
    est_actif = models.BooleanField(default=True, verbose_name='Actif')
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Médicament'
        verbose_name_plural = 'Médicaments'
        ordering = ['nom']

    def __str__(self):
        return f'{self.nom} ({self.dosage})'

    @property
    def est_en_alerte(self):
        """Retourne True si le stock est inférieur au seuil minimum."""
        return self.stock_actuel <= self.stock_minimum
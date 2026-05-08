from django.db import models

class Categorie(models.Model):
    """Représente une catégorie de médicaments."""
    nom = models.CharField(max_length=200, unique=True, verbose_name="Nom de la catégorie")
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['nom']

    def __str__(self):
        return self.nom
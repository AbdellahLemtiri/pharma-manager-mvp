from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from categories.models import Categorie
from medicaments.models import Medicament
from ventes.models import Vente

class VenteAPITestCase(TestCase):
    def setUp(self):
        """Préparation des données de test avant chaque exécution."""
        self.client = APIClient()
        self.categorie = Categorie.objects.create(nom="Antalgique")
        self.medicament = Medicament.objects.create(
            nom="Doliprane 1000mg",
            categorie=self.categorie,
            forme="Comprimé",
            dosage="1000mg",
            prix_achat=10.00,
            prix_vente=15.00,
            stock_actuel=50,
            stock_minimum=10,
            date_expiration="2027-01-01"
        )

    def test_creation_vente_deduit_stock(self):
        """Test si la création d'une vente déduit correctement le stock."""
        payload = {
            "notes": "Vente test",
            "lignes": [
                {
                    "medicament": self.medicament.id,
                    "quantite": 10
                }
            ]
        }
        response = self.client.post('/api/v1/ventes/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier que le stock a bien diminué (50 - 10 = 40)
        self.medicament.refresh_from_db()
        self.assertEqual(self.medicament.stock_actuel, 40)

    def test_vente_stock_insuffisant(self):
        """Test qu'on ne peut pas vendre plus que le stock disponible."""
        payload = {
            "lignes": [
                {
                    "medicament": self.medicament.id,
                    "quantite": 100  # On demande 100, on n'a que 50
                }
            ]
        }
        response = self.client.post('/api/v1/ventes/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_annulation_vente_reintegre_stock(self):
        """Test si l'annulation d'une vente réintègre le stock."""
        # 1. Créer la vente de 20 unités
        payload = {
            "lignes": [{"medicament": self.medicament.id, "quantite": 20}]
        }
        res = self.client.post('/api/v1/ventes/', payload, format='json')
        vente_id = res.data['id']
        
        # 2. Annuler la vente
        response_cancel = self.client.post(f'/api/v1/ventes/{vente_id}/annuler/')
        self.assertEqual(response_cancel.status_code, status.HTTP_200_OK)
        
        # 3. Vérifier que le stock est revenu à la normale (50)
        self.medicament.refresh_from_db()
        self.assertEqual(self.medicament.stock_actuel, 50)
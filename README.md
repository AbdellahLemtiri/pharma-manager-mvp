#  PharmaManager  


Une application web full-stack de gestion de pharmacie, développée dans le cadre du test technique pour **SMARTHOLOL**. L'application permet la gestion de l'inventaire des médicaments, le suivi des alertes de stock (rupture/seuil minimum), et le traitement sécurisé des ventes.

---

## 🛠️ Stack Technique

### Backend
* **Framework:** Python / Django 4.x
* **API:** Django REST Framework (DRF)
* **Base de données:** PostgreSQL
* **Authentification:** JWT (JSON Web Tokens via `djangorestframework-simplejwt`)
* **Documentation:** Swagger UI (`drf-spectacular`)

### Frontend
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS v4
* **Icônes:** Lucide React
* **Requêtes HTTP:** Axios avec Interceptors (gestion automatique de l'injection et du rafraîchissement des tokens)

### DevOps & Outils
* **Conteneurisation:** Docker & Docker Compose
* **Versionnement:** Git 

---

##  Bonus Réalisés  

Conformément au cahier des charges, l'intégralité des fonctionnalités bonus a été implémentée :
- [x] **:** Tests unitaires sur les views, les serializers et la logique métier de gestion de stock (`Django TestCase`).
- [x] **:** Authentification sécurisée via JWT (Access & Refresh tokens) et protection des routes côté React.
- [x] **:** Filtres avancés (par catégorie, statut, forme) et recherche textuelle globale via `django-filter` et `SearchFilter`.
- [x] **:** Pagination personnalisée avec métadonnées enrichies (count, next, previous) intégrée sur toutes les listes.
- [x] **:** Export CSV de l'inventaire intégré nativement dans l'API REST (`/api/v1/medicaments/export_csv/`).
- [x] **:** Fichiers `Dockerfile` et `docker-compose.yml` permettant de lancer l'infrastructure complète (DB, API, UI) en une seule commande.

---

 

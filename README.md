# 🎾 Tenisový klub 

Moderní webová aplikace pro správu tenisových kurtů a rezervací. Systém umožňuje uživatelům snadno rezervovat tenisové kurty, spravovat své rezervace a sledovat dostupnost kurtů v reálném čase.

## 🚀 Technologie

### Frontend
- **Framework:** Angular 17
- **UI Framework:** Bootstrap 5
- **State Management:** Angular Services
- **Styling:** SCSS
- **Icons:** Bootstrap Icons

### Backend
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT
- **API Documentation:** Swagger

## ✨ Funkce

- 👤 **Uživatelský systém**
    - Registrace a přihlášení uživatelů
    - Správa uživatelského profilu
    - Role a oprávnění (admin/uživatel)

- 🎾 **Správa kurtů**
    - Přehled dostupných kurtů
    - Detaily a stav jednotlivých kurtů
    - Správa údržby (pro adminy)

- 📅 **Rezervační systém**
    - Vytváření rezervací v reálném čase
    - Přehled vlastních rezervací
    - Historie rezervací
    - Automatické notifikace

## 🛠️ Instalace

### Prerekvizity
- Node.js (v18 nebo vyšší)
- npm nebo yarn
- PostgreSQL (v14 nebo vyšší)
- Angular CLI


## 📝 Konfigurace

### Backend (.env)
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=tennis_club

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 🌐 API Dokumentace

API dokumentace je dostupná po spuštění serveru na:
```
http://localhost:3000/api/docs
```

## 👥 Autor

- Adam Osek
- GitHub: [@Addys10](https://github.com/Addys10)

---

🌟 Pokud se vám projekt líbí, dejte mu hvězdičku na GitHubu!
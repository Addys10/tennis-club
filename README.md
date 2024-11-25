# 🎾 Tenisový klub 

Moderní webová aplikace pro správu tenisového klubu. Systém umožňuje uživatelům snadno vytvářet tréninkové jednotky, spravovat uživatele a sledovat aktuální fakturaci.

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

## ✨ Funkce

- 👤 **Uživatelský systém**
    - Registrace a přihlášení uživatelů
    - Správa uživatelského profilu
    - Role a oprávnění (admin/uživatel)

- 🎾 **Správa kurtů**
    - Přehled dostupných kurtů
    - Detaily a stav jednotlivých kurtů
    - Správa údržby (pro adminy)

- 📅 **Tréninkový systém**
    - Vytváření tréninků v reálném čase
    - Přehled vlastních tréninků
    - Historie tréninků
    - Kontrola dostupnosti tréninku

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


## 👥 Autor

- Adam Hanus
- GitHub: [@Addys10](https://github.com/Addys10)

---

# Ticket Reservation System API

**Progetto API RESTful per un sistema di prenotazione biglietti eventi**  
Università di Firenze - 2025

**Autore:** Matteo Minin
**Matricola:** 7112938
**Demo Host:** TODO add url

## Descrizione del Progetto

Web app per gestire le pronotazioni di biglietti.

### Funzionalità

- Visualizzazione eventi e biglietti disponibili in tempo reale (accesso anonimo)
- Registrazione e autenticazione utenti (con JWT)
- Creazione, modifica e cancellazione prenotazioni (solo utenti autenticati)
- Simulazione pagamento

### Account di test

Per testare l'applicazione in modo rapido, si può usare il segueste account:

- username: test
- password: test

### Deployment
TODO: fix
- fronted: [url]
- backend: [Inserire URL backend se disponibile]

## Architettura del Sistema

### Backend

- **Framework:** Django REST Framework  
- **Database:** PostgreSQL 
- **Autenticazione:** JWT (JSON Web Token)  
- **Deployment:** Docker + Railway

### Frontend

- **Framework:** React
- **Deployment:** Vercel

## Documentazione API

### Autenticazione

**`POST /api/auth/register/`**

- Registrazione utente
- **Body:** `{username, email, password, phone_number, address}`  
- **Response:** Dati utente con token JWT

**`POST /api/auth/login/`**

- Login utente  
- **Body:** `{email, password}`  
- **Response:** Token JWT di accesso e refresh

### Eventi

**`GET /api/events/`**

- Lista tutti gli eventi disponibili  
- Accesso: pubblico

**`GET /api/events/{event_id}/`**

- Dettagli di un evento specifico  
- Accesso: pubblico

### Prenotazioni

**`POST /api/reservations/`**

- Crea una nuova prenotazione per un evento  
- **Body:** `{event_id, quantity}`  
- Accesso: utenti autenticati

**`GET /api/reservations/`**

- Elenca le prenotazioni dell’utente  
- Accesso: utenti autenticati

**`PUT/PATCH /api/reservations/{event_id}/`**

- Modifica la prenotazione con id `event_id`
- Accesso: utenti autenticati

## Come Usare l’API

- Registrarsi con `/api/auth/register/` per creare un account
- Effettuare il login con `/api/auth/login/` per ottenere il token JWT
- Includere il token JWT nell'header di autorizzazione `Authorization: Bearer <token>` per le chiamate protette
- Usare gli endpoint per esplorare eventi e gestire prenotazioni
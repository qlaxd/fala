 Szia! Az alábbiakban összefoglalom a Next.js appban jelenleg elérhető API végpontokat, a hiányzókat, valamint javaslatokat teszek a RESTful API kialakítására a PRD és a prisma séma alapján. A válasz kizárólag a kért fájlokra (PRD.md és a prisma séma) és a forráskódra támaszkodik.

---

## 1. **Elérhető API végpontok (Next.js /app/api/mobile)**

### **Authentication**
- `POST /api/mobile/auth/login` – Bejelentkezés, JWT és refresh token generálás
- `POST /api/mobile/auth/refresh` – Access token frissítése refresh tokennel
- `POST /api/mobile/auth/logout` – Refresh token törlése (kijelentkezés)

### **Breeding Animals**
- `GET /api/mobile/animals` – Listázás, szűrés, lapozás
- `POST /api/mobile/animals` – Új állat létrehozása
- `GET /api/mobile/animals/[id]` – Egy állat lekérdezése
- `PUT /api/mobile/animals/[id]` – Állat módosítása
- `GET /api/mobile/animals/[id]/images` – Állat képeinek lekérdezése
- `POST /api/mobile/animals/[id]/images` – Kép hozzáadása állathoz

### **Commercial Lots**
- `GET /api/mobile/lots` – Lot-ok listázása
- `POST /api/mobile/lots` – Új lot létrehozása
- `GET /api/mobile/lots/[id]` – Egy lot lekérdezése
- `PUT /api/mobile/lots/[id]` – Lot módosítása
- `DELETE /api/mobile/lots/[id]` – Lot törlése
- `GET /api/mobile/lots/[id]/images` – Lot képeinek lekérdezése
- `POST /api/mobile/lots/[id]/images` – Kép hozzáadása lot-hoz

### **Auctions**
- `GET /api/mobile/auctions` – Aukciók listázása, szűrés, lapozás
- `POST /api/mobile/auctions` – Új aukció létrehozása
- `GET /api/mobile/auctions/[id]` – Egy aukció lekérdezése
- `PATCH /api/mobile/auctions/[id]` – Aukció módosítása

---

## 2. **Hiányzó vagy részben kész végpontok**

- **Képek szerkesztése/törlése**: PUT, PATCH, DELETE metódusok a `/images` végpontokon (állatoknál és lot-oknál) csak TODO-ként szerepelnek.
- **Auction registrations**: A PRD és a admin-interface-development.md alapján szükséges, de nem látható implementáció.
- **Felhasználó kezelés**: Admin felhasználók CRUD, jogosultságkezelés (ha szükséges).
- **Email értesítések**: Aukciókhoz kapcsolódó email küldés (pl. új aukció, regisztráció visszaigazolás).
- **Push notification**: PRD-ben szerepel, de nincs implementáció.
- **Cloud storage integráció**: Képfeltöltés jelenleg csak URL-t vár, nincs fájlkezelés/cloud storage integráció.
- **Biztonsági kiegészítések**: Rate limiting, input sanitization, audit log, stb. részben vagy hiányosan vannak jelen.

---

## 3. **Javaslatok a RESTful API kialakításához**

### **Általános**
- **Egységes error handling**: Már jól használod az `ApiError` és `handleApiError` segédfüggvényeket.
- **Validáció**: Zod validáció mindenhol jelen van, ez jó.
- **Jogosultságkezelés**: `withAuth` middleware jól használható, de minden érzékeny végponton legyen jelen.
- **Lapozás/szűrés**: Már támogatott az állatoknál és aukcióknál, ezt minden listázó végponton érdemes egységesen bevezetni.

### **Hiányzó funkciók/végpontok**
- **Képek szerkesztése/törlése**: Implementáld a PUT, PATCH, DELETE metódusokat az `/images` végpontokon.
- **Auction registrations**: 
  - `POST /api/mobile/auctions/[id]/registrations` – Regisztráció egy aukcióra
  - `GET /api/mobile/auctions/[id]/registrations` – Regisztrációk listázása
  - `DELETE /api/mobile/auctions/[id]/registrations/[regId]` – Regisztráció törlése
- **Felhasználó kezelés** (ha szükséges):
  - `GET /api/mobile/users` – Felhasználók listázása
  - `POST /api/mobile/users` – Új felhasználó
  - `PUT /api/mobile/users/[id]` – Felhasználó módosítása
  - `DELETE /api/mobile/users/[id]` – Felhasználó törlése
- **Képfeltöltés**: Implementáld a fájlfeltöltést (pl. S3 vagy más cloud storage), ne csak URL-t várjon.
- **Email/push notification**: Külön service réteg, queue támogatás nagyobb mennyiséghez.
- **Audit log**: Fontosabb admin műveletek naplózása.

### **Biztonság**
- **Rate limiting**: Már van implementáció, de minden érzékeny végponton legyen aktív.
- **Input sanitization**: Minden bemeneti adatot tisztíts.
- **CSRF védelem**: Ha szükséges, főleg formoknál.
- **Token kezelés**: Refresh tokenek élettartamának kezelése, visszavonás lehetősége.

---

## 4. **Mi van jól megírva?**

- **Validáció**: Zod mindenhol, ez jó.
- **Jogosultságkezelés**: `withAuth` middleware.
- **Egységes error handling**.
- **Lapozás/szűrés a listázó végpontokon**.
- **Token alapú authentikáció, refresh token flow**.

---

## 5. **Mi nincs jól megírva vagy hiányzik?**

- **Képek szerkesztése/törlése**: PUT, PATCH, DELETE hiányzik.
- **Auction registration**: Nincs implementálva.
- **Felhasználó CRUD**: Nincs implementálva (ha szükséges).
- **Képfeltöltés**: Csak URL, nincs fájlkezelés/cloud storage.
- **Push notification**: Hiányzik.
- **Email queue**: Hiányzik.
- **Audit log**: Hiányzik.
- **Biztonsági kiegészítések**: Még lehet bővíteni (input sanitization, CSRF, IP blacklist, stb.).

---

## 6. **RESTful API javasolt struktúra**

```plaintext
/api/mobile/auth/login         POST
/api/mobile/auth/refresh       POST
/api/mobile/auth/logout        POST

/api/mobile/users              GET, POST
/api/mobile/users/[id]         GET, PUT, DELETE

/api/mobile/animals            GET, POST
/api/mobile/animals/[id]       GET, PUT, DELETE
/api/mobile/animals/[id]/images    GET, POST, PUT, PATCH, DELETE

/api/mobile/lots               GET, POST
/api/mobile/lots/[id]          GET, PUT, DELETE
/api/mobile/lots/[id]/images   GET, POST, PUT, PATCH, DELETE

/api/mobile/auctions           GET, POST
/api/mobile/auctions/[id]      GET, PATCH, DELETE
/api/mobile/auctions/[id]/registrations   GET, POST
/api/mobile/auctions/[id]/registrations/[regId] DELETE
```

---

## 7. **Következő lépések**

1. **Fejezd be a képek szerkesztését/törlését támogató végpontokat.**
2. **Implementáld az auction registration végpontokat.**
3. **Döntsd el, kell-e felhasználó CRUD admin oldalra, és implementáld.**
4. **Vezesd be a fájlfeltöltést cloud storage-ra.**
5. **Bővítsd a biztonsági réteget (rate limit, input sanitization, audit log).**
6. **Implementáld az email/push notification queue-t.**

---

Ha szeretnéd, konkrét végpont implementációs mintát is tudok írni bármelyikhez!  
Ha elküldöd a prisma schema-t, pontosabb javaslatokat is tudok adni az entitásokhoz.
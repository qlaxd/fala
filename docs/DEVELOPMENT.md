# Fala Farm Fejlesztési Dokumentáció

## 1. Környezeti Változók

A projekt a következő környezeti változókat használja (`.env.local`):

### Alapvető Beállítások
- `NEXT_PUBLIC_CONTACT_EMAIL` - Kapcsolati email cím
- `NEXT_PUBLIC_CONTACT_PHONE` - Telefonszám
- `NEXT_PUBLIC_FACEBOOK_URL` - Facebook oldal
- `NEXT_PUBLIC_LINKEDIN_URL` - LinkedIn profil
- `NEXT_PUBLIC_CONTACT_ADDRESS` - Fizikai cím

### Email Szolgáltatás
- `RESEND_API_KEY` - Resend.com API kulcs

### Captcha Beállítások
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` - hCaptcha site kulcs
- `HCAPTCHA_SECRET_KEY` - hCaptcha titkos kulcs


## 2. Teljesítmény Optimalizáció

1. **Képek Optimalizálása**
- Next/image komponens használata
- Lazy loading beállítása
- Placeholder és blur effektek

2. **Komponensek Lazy Betöltése**


3. **Memória Optimalizáció**
- useEffect cleanup implementálása minden eseménykezelőnél
- Nagy komponensek feldarabolása (max 200 sor/komponens)
- Virtuális scrolling nagy listákhoz (react-virtual)
- Memóriaszivárgás elleni védelem:
  - Event listener eltávolítás
  - Időzítők törlése
  - Aszinkron műveletek megszakítása
  - WebSocket kapcsolatok lezárása

### 2.4 Bundle Méret Optimalizáció
- Tree shaking beállítása
- Code splitting route-ok szerint
- Külső függőségek optimalizálása
- Webpack Bundle Analyzer használata

## 3. Biztonság

1. **Biztonsági Headerek**
- XSS és CSRF védelem
- HTTP-only és Secure cookie beállítások

2. **Adatvédelem**
- Adatvédelmi szabályok megvalósítása


3. **Form Biztonság**
- CSRF védelem
- Rate limiting
- Captcha integráció
- Input validáció és sanitization

## 4. Kapcsolati Űrlap

1. **Függőségek**
- @formspree/react
- @hcaptcha/react-hcaptcha
- zod (validációhoz)

2. **Implementáció**
- Formspree használata
- hCaptcha integráció
- Zod validáció
- Email küldés

3. **Typescript Szigorítások**
- Typeguard implementálása
- Type aliasok használata
- Interface használata
- Enum használata
{
"compilerOptions": {
"strict": true,
"noImplicitAny": true,
"strictNullChecks": true,
"noUncheckedIndexedAccess": true
}
}


### 4.1 ESLint Szabályok Bővítése

module.exports = {
extends: [
'next/core-web-vitals',
'plugin:@typescript-eslint/recommended',
'plugin:security/recommended'
],
rules: {
'no-console': ['error', { allow: ['warn', 'error'] }],
'@typescript-eslint/explicit-function-return-type': 'error',
'react-hooks/exhaustive-deps': 'error'
}
}

## 4.2 További Fejlesztési Tervek

1. **Felhasználói Élmény**
- Form állapot perzisztálása
- Automatikus piszkozat mentés
- Előnézet küldés előtt
- Visszaigazoló emailek

2. **Adminisztráció**
- Admin értesítések
- Üzenetkezelő felület
- Spam szűrés
- Statisztikák

3. **Kód Minőség**
- Unit tesztek bevezetése
- E2E tesztek implementálása
- Kód dokumentáció bővítése
- Teljesítmény monitoring

## 4.3 Deployment

A projekt Vercel-re van optimalizálva. Deployment lépések.

### 4.3 Tesztelési Stratégia
- Unit tesztek (Jest + React Testing Library)
- Komponens tesztek
- E2E tesztek (Cypress)
- API tesztek (Supertest)
- Teljesítmény tesztek (Lighthouse CI)

## 5. CI/CD Pipeline

### 5.1 GitHub Actions Workflow

### 5.2 Automatizált Folyamatok
- Lint ellenőrzés
- TypeScript típus ellenőrzés
- Tesztek futtatása
- Bundle méret ellenőrzés
- Lighthouse audit
- Automatikus dependency update (Dependabot)

## 6. Monitoring és Logging

### 6.1 Teljesítmény Monitoring
- Next.js Analytics beállítása
- Core Web Vitals követése
- Custom metrikák implementálása
- Error boundary-k minden oldalhoz

### 6.2 Logging Rendszer


## 7. SEO Optimalizáció

### 7.1 Metadata Kezelés

### 7.2 Strukturált Adatok
- JSON-LD implementálása
- Schema.org markup-ok
- Sitemap generálás
- Robots.txt konfiguráció

## 8. Accessibility (A11y)

### 8.1 Alapvető A11y Fejlesztések
- ARIA címkék
- Keyboard navigation
- Screen reader optimalizáció
- Színkontraszt ellenőrzés

### 8.2 A11y Tesztelés
- axe-core implementálása
- Manuális tesztelés screen readerrel
- Keyboard-only használat tesztelése

## 9. Internationalization (i18n)

### 9.1 Nyelvi Fájlok Strukturálása

### 9.2 SEO Nyelvi Kezelés
- Hreflang implementálása
- Nyelvi váltó optimalizálása
- URL struktúra finomítása

## 10. Dokumentáció

### 10.1 Kód Dokumentáció
- JSDoc minden publikus függvényhez
- Komponens dokumentáció (Storybook)
- API dokumentáció (Swagger/OpenAPI)

### 10.2 Fejlesztői Dokumentáció
- Telepítési útmutató
- Fejlesztési folyamatok leírása
- Troubleshooting guide
- Contribution guidelines


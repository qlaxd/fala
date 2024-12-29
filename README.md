# Fala Farm Weboldal

## A projektről

A Fala Farm hivatalos weboldala, amely Next.js-ben készült, többnyelvű támogatással (magyar és angol), modern UI komponensekkel és reszponzív dizájnnal.

## Rendszerkövetelmények

- Node.js (v18.0.0 vagy újabb) (jelenlegi: v23.4.0)
- npm (v9.0.0 vagy újabb) (jelenlegi: v11.0.0)

### Környezeti változók

A következő környezeti változókat kell beállítani a `.env.local` fájlban:

- NEXT_PUBLIC_CONTACT_EMAIL=info@falafarm.com
- NEXT_PUBLIC_CONTACT_PHONE=+36 20 555 5555
- NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/fala.farm/
- NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/levente-lajk%C3%B3-818805139/

Az .env.local.example fájlt nevezd át .env.local néven és állítsd be a megfelelő értékeket.

Megjegyzések:
- A `NEXT_PUBLIC_` prefix azért szükséges, mert ezek az értékek kliens oldalon is elérhetőek kell legyenek
- A `.env.local` fájlt mindenképp add hozzá a `.gitignore`-hoz
- Éles környezetben (pl. Vercel) külön kell beállítani ezeket az értékeket a környezeti változók között
- A fejlesztői környezetben használt `.env.local` fájl nem kerül fel a verziókezelőbe

### Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

### Contact Form
NEXT_PUBLIC_CONTACT_EMAIL=info@falafarm.com

### Analytics (opcionális)
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id

## Telepítés

1. Klónozza le a repository-t:```git clone https://github.com/your-username/fala-farm.git```
2. Navigáljon a projekt könyvtárába: ```cd fala-farm```
3. Telepítse a függőségeket: ```npm install```
4. Indítsa el a fejlesztőkörnyezetet: ```npm run dev```


A weboldal elérhető lesz a következő címen: `http://localhost:3000`

## Build készítése

Éles környezethez készítsen buildet:

```npm run build```

A build készítése után indísta el a szervert: ```npm start ```

A weboldal elérhető lesz a következő címen:
`http://localhost:3000/`


## Technológiák

- [Next.js](https://nextjs.org/) - React keretrendszer
- [Tailwind CSS](https://tailwindcss.com/) - CSS keretrendszer
- [Shadcn/ui](https://ui.shadcn.com/) - UI komponens könyvtár
- [Framer Motion](https://www.framer.com/motion/) - Animációk
- [TypeScript](https://www.typescriptlang.org/) - Típusos JavaScript

## Többnyelvűség

A weboldal alapértelmezetten magyar nyelvű, de támogatja az angol nyelvet is. A nyelvi fájlok a `messages/` könyvtárban találhatók.

## Deployment

A weboldal Vercel-re van optimalizálva, de bármely Node.js-t támogató hosting szolgáltatón futtatható.

### Vercel Deployment

1. Hozzon létre egy új projektet a Vercel-en
2. Kösse össze a GitHub repository-val
3. Állítsa be a környezeti változókat
4. A Vercel automatikusan buildeli és deployolja az alkalmazást

## Licenc

MIT

## Kapcsolat

Fala Farm - [info@falafarm.com](mailto:info@falafarm.com)

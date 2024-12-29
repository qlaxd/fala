## Teljesítmény Optimalizáció:
- Képek optimalizálása: Használjunk next/image komponenst minden képhez, és állítsuk be a megfelelő méreteket
- Komponensek lazy betöltése: A nagyobb komponenseket dinamikusan importáljuk
- Fontok optimalizálása: Használjuk a next/font modult

## Kód Szervezés:
- A lib könyvtár túl sok mindent tartalmaz, érdemes lenne szétbontani:
  - services/ - API hívások, külső szolgáltatások
  - utils/ - segédfüggvények
  - config/ - konfigurációs fájlok
  - types/ - típusdefiníciók
- A components könyvtár jól strukturált, de érdemes lenne:
  - Közös komponenseket áthelyezni a ui könyvtárba
  - Létrehozni egy shared könyvtárat az újrafelhasznált komponenseknek

## Clean Code Elvek:
- Egységes hibakezelés bevezetése
- Környezeti változók típusainak definiálása
- Konstansok központosítása
- Egységes naplózási rendszer bevezetése

## Clean Code Elvek:
- Egységes hibakezelés bevezetése
- Környezeti változók típusainak definiálása
- Konstansok központosítása
- Egységes naplózási rendszer bevezetése

## Memória Optimalizáció:
- React komponensek memóriaszivárgásának elkerülése (useEffect cleanup)
- Nagy komponensek feldarabolása
- Képek lazy betöltése
- Virtuális scrolling nagy listákhoz

# 1. Új könyvtárstruktúra:
src/
  ├── components/
  │   ├── ui/         # Alap UI komponensek
  │   ├── shared/     # Újrafelhasznált komponensek
  │   └── features/   # Funkció-specifikus komponensek
  ├── config/         # Konfigurációs fájlok
  ├── services/       # API hívások, külső szolgáltatások
  ├── utils/          # Segédfüggvények
  ├── types/          # Típusdefiníciók
  └── hooks/          # Egyedi React hookok

# 2. Képek optimalizálása:
// components/ui/image.tsx
export const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    {...props}
    src={src}
    alt={alt}
    loading="lazy"
    placeholder="blur"
    blurDataURL={`data:image/svg+xml;base64,...`}
  />
);

# 3. Vezessünk be lazy loadingot a nagyobb komponensekhez:
// app/[locale]/page.tsx
const ContactForm = dynamic(() => import('@/components/contact/ContactForm'), {
  loading: () => <LoadingSpinner />
});

# 4. Hozzunk létre egy környezeti változó típusdefiníciót:
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    DATABASE_URL: string;
    // ... további env változók
  }
}

# 5. Konstansok központosítása:
// config/constants.ts
export const APP_CONFIG = {
  imageQuality: 75,
  maxUploadSize: 5 * 1024 * 1024,
  apiTimeout: 5000,
  // ... további konstansok
} as const;
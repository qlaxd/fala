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

# 6. Kapcsolati űrlap implementáció:

## 6.1 Függőségek telepítése

```bash
npm install @formspree/react
npm install @hcaptcha/react-hcaptcha
```

## 6.2 Környezeti változók bővítése

.env.local
RESEND_API_KEY=re_123...
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
HCAPTCHA_SECRET_KEY=0x0000000000000000000000000000000000000000


## 6.3 API Route létrehozása
typescript:src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateCaptcha } from '@/utils/captcha';
import { rateLimit } from '@/utils/rateLimit';
const resend = new Resend(process.env.RESEND_API_KEY);
const limiter = rateLimit({
interval: 15 60 1000, // 15 perc
uniqueTokenPerInterval: 500,
max: 5, // 5 kérés / 15 perc / IP
});
export async function POST(request: Request) {
try {
const body = await request.json();
const { firstName, lastName, email, message, captchaToken } = body;
// Rate limiting ellenőrzés
const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
await limiter.check(ip);
// Captcha validáció
const captchaValid = await validateCaptcha(captchaToken);
if (!captchaValid) {
return NextResponse.json(
{ error: 'Invalid captcha' },
{ status: 400 }
);
}
// Email küldése
await resend.emails.send({
from: 'noreply@falafarm.com',
to: process.env.CONTACT_EMAIL as string,
subject: Új kapcsolatfelvétel - ${firstName} ${lastName},
text: message,
reply_to: email,
});
return NextResponse.json({ success: true });
} catch (error) {
return NextResponse.json(
{ error: 'Failed to send message' },
{ status: 500 }
);
}
}


## 6.4 Form komponens implementálása

typescript:src/components/features/contact/ContactForm.tsx
import { useForm } from 'react-hook-form';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
const formSchema = z.object({
firstName: z.string().min(2).max(50),
lastName: z.string().min(2).max(50),
email: z.string().email(),
message: z.string().min(10).max(1000),
honeypot: z.string().max(0), // spam védelem
});
type FormData = z.infer<typeof formSchema>;
export function ContactForm() {
const [captchaToken, setCaptchaToken] = useState<string>('');
const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
resolver: zodResolver(formSchema)
});
const onSubmit = async (data: FormData) => {
if (!captchaToken) {
toast.error('Kérjük, töltse ki a captcha-t');
return;
}
try {
const response = await fetch('/api/contact', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ ...data, captchaToken }),
});
if (!response.ok) throw new Error();
toast.success('Üzenet sikeresen elküldve!');
reset();
} catch (error) {
toast.error('Hiba történt az üzenet küldésekor');
}
};
return (

<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
<input type="text" {...register('honeypot')} className="hidden" />
<div className="grid grid-cols-2 gap-4">
<Input {...register('firstName')} placeholder="Keresztnév" />
<Input {...register('lastName')} placeholder="Vezetéknév" />
</div>
<Input {...register('email')} type="email" placeholder="Email cím" />
<Textarea {...register('message')} placeholder="Üzenet" />
<HCaptcha
sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string}
onVerify={token => setCaptchaToken(token)}
/>
<Button type="submit">Küldés</Button>
</form>
);
}


## 6.5 Rate Limiting Segédfüggvény
typescript:src/utils/rateLimit.ts
export const rateLimit = (options: {
interval: number;
uniqueTokenPerInterval: number;
max: number;
}) => {
const tokenCache = new Map();
return {
check: (token: string | null) => new Promise<void>((resolve, reject) => {
const tokenCount = tokenCache.get(token) || 0;
if (tokenCount >= options.max) {
reject(new Error('Rate limit exceeded'));
}
tokenCache.set(token, tokenCount + 1);
setTimeout(() => {
tokenCache.delete(token);
}, options.interval);
resolve();
}),
};
};


## 6.6 Captcha Validáció
typescript:src/utils/captcha.ts
export async function validateCaptcha(token: string): Promise<boolean> {
try {
const response = await fetch('https://hcaptcha.com/siteverify', {
method: 'POST',
headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
body: response=${token}&secret=${process.env.HCAPTCHA_SECRET_KEY},
});
const data = await response.json();
return data.success;
} catch {
return false;
}
}


## 6.7 Típusdefiníciók bővítése
typescript:src/types/env.d.ts
declare namespace NodeJS {
interface ProcessEnv {
RESEND_API_KEY: string;
NEXT_PUBLIC_HCAPTCHA_SITE_KEY: string;
HCAPTCHA_SECRET_KEY: string;
}
}

## 7. Form Validáció Bővítése

- Telefonszám validáció magyar formátumra
- Üzenet minimális hossz ellenőrzése
- Maximális karakterszám kijelzése
- Kötelező mezők jelölése

## 8. Biztonsági Kiegészítések

- CSRF token implementálása
- Input sanitization bővítése
- File feltöltés validáció (ha szükséges)
- IP alapú blacklist
- Spam szűrés bővítése (pl. Akismet integrációja)

## 9. Felhasználói Élmény

- Loading állapot kezelése
- Form állapot perzisztálása (ha a user véletlenül bezárja)
- Automatikus mentés piszkozatként
- Sikeres küldés után confirmation email
- Üzenet előnézet küldés előtt

## 10. Adminisztráció

- Admin értesítés új üzenetről
- Üzenetek kezelése admin felületen
- Spam jelentés lehetőség
- Automatikus válaszok kezelése
- Statisztikák gyűjtése (pl. válaszidő, spam arány)
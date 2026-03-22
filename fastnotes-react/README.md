FastNotes – Assignment 3

FastNotes er videreutviklet med støtte for bilder i notater og push-notifikasjoner. Ansatte hos Blodroed Consulting kan nå legge til bilder i notatene sine, og får et varsel når et nytt notat blir opprettet.

---

Teknologi

- React Native med Expo
- Supabase (autentisering, database og storage)
- TypeScript
- expo-image-picker
- expo-notifications

---

Kom i gang

Krav:
- Node.js (v18 eller nyere)
- Expo Go-appen eller en Android-emulator
- En Supabase-konto

Oppsett:
1. Klon repoet og naviger til prosjektmappen:
   cd fastnotes-react
   npm install

2. Opprett en .env fil i fastnotes-react/ mappen:
   EXPO_PUBLIC_SUPABASE_URL=din_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=din_anon_key

3. Kjør appen:
   npx expo start

Skann QR-koden med Expo Go, eller trykk a for å åpne i Android-emulator.

---

Database

Kjør følgende SQL i Supabase sitt SQL Editor for å sette opp databasen:

create table public.notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  user_id uuid references auth.users(id) not null,
  updated_at timestamptz default now() not null,
  image_url text
);

alter table public.notes enable row level security;

create policy "All users can read notes"
on public.notes for select to authenticated using (true);

create policy "Users can create notes"
on public.notes for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update notes"
on public.notes for update to authenticated
using (auth.uid() = user_id);

create policy "Users can delete notes"
on public.notes for delete to authenticated
using (auth.uid() = user_id);

For Storage, opprett en bucket kalt note-images og kjør:

create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'note-images');

create policy "Anyone can view images"
on storage.objects for select
to public
using (bucket_id = 'note-images');

create policy "Users can delete their own images"
on storage.objects for delete
to authenticated
using (bucket_id = 'note-images');

---

Krav implementert

Kamera-integrasjon
- Permissions: Appen ber om tilgang til kamera og bildegalleri første gang funksjonen brukes, og håndterer tilfeller der tilgang blir nektet med en tydelig feilmelding.
- Capture & Pick: Brukeren kan velge mellom å ta et nytt bilde med kameraet eller velge et eksisterende bilde fra galleriet.
- Preview: Valgt bilde vises som forhåndsvisning i notatvinduet før brukeren lagrer.

Storage & Validering
- Client-side Validation: Koden sjekker at bildet er under 15MB og i formatene JPG, PNG eller WebP før opplasting starter. Brukeren får en tydelig feilmelding hvis bildet ikke er gyldig.
- Supabase Upload: Bildet lastes opp til Supabase Storage med et unikt filnavn basert på tidsstempel og tilfeldig streng, slik at ingen filer overskrives.
- DB Linking: URL-en til det opplastede bildet lagres i image_url-kolonnen i notes-tabellen og knyttes til riktig notat.

UI/UX
- Loading States: En spinner vises mens bildet lastes opp, og Lagre-knappen deaktiveres underveis så brukeren ikke kan sende inn flere ganger.
- Aspect Ratio Handling: Bilder vises med riktig aspektforhold i notatlistene (16:9) og inne i notatet (4:3) slik at de aldri strekkes eller croppes feil.
- Error Messaging: Appen gir tydelige feilmeldinger for ugyldig format, for stor fil og opplastingsfeil.

Notifikasjoner
- System Permissions: Appen ber om tillatelse fra operativsystemet til å sende varsler ved oppstart.
- Lokal Trigger: Etter at et notat er lagret vellykket, sendes det en lokal notifikasjon til brukeren med tittelen på det nye notatet i formatet "Nytt notat: [tittel]".
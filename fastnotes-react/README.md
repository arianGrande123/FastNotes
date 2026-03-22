FastNotes – Assignment 4

FastNotes er nå produksjonsklar. I denne versjonen har vi lagt til automatiserte tester, optimalisert ytelsen og bygget en kjørbar Android-app.

---

Repo

https://github.com/arianGrande123/FastNotes

---

Kom i gang

Krav:
- Node.js (v20.19.4 eller nyere)
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

Kjør tester

npm test

---

Bygg APK med EAS

1. Installer EAS CLI:
   npm install -g eas-cli

2. Logg inn på Expo:
   eas login

3. Bygg APK:
   eas build -p android --profile preview

Bygget kjører i skyen og tar ca. 15-20 minutter. Du kan laste ned APK-filen fra expo.dev når bygget er ferdig.

---

Krav implementert

Testing (35%)

Unit test – validering og notatopprettelse: Tester sjekker at tomme titler og innhold avvises, og at gyldige notater godtas. Testene kjører med Jest og dekker kjernelogikken uten å være avhengig av eksterne tjenester.

Integration test – bildvalidering: Tester verifiserer at bilder over 15MB avvises, at ugyldige formater som GIF avvises, og at JPG, PNG og WebP godtas.

Auth guard test – tilgangskontroll: Tester verifiserer at brukerobjektet er null når ingen er logget inn, og at et gyldig brukerobjekt returneres når brukeren er autentisert.

Optimalisering (40%)

Log Cleanup: Alle console.log-setninger er fjernet fra kodebasen.

Resource Management – Kamera: Kamerakomponenten bruker useIsFocused fra Expo Navigation for å avmontere skjermen når brukeren navigerer bort. Dette forhindrer at kameraet kjører unødvendig i bakgrunnen.

Paginering: Notatlisten henter kun 5 notater om gangen ved hjelp av Supabase sin .range()-funksjon. En "Last mer"-knapp nederst i listen henter de neste 5 notatene.

Build og dokumentasjon (25%)

App-fil: En kjørbar .apk-fil er vedlagt innleveringen. Filen er bygget med EAS Build og kan installeres på en Android-enhet eller emulator.

Byggeinstruksjoner: Se "Bygg APK med EAS" over.
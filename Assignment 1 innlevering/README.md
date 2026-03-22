# FastNotes

FastNotes er en enkel notatapp laget som en del av et rammeverk-sammenligningsprosjekt. Appen er bygget i to forskjellige rammeverk — React Native og Native Android — for å sammenligne utvikleropplevelse og funksjonalitet.

I emulator dukker ikke tastaturet opp, men når man tester på mobil ser man at skjermen flyttes oppover når tastaturet åpnes.

## Prosjektstruktur

FastNotes/
├── fastnotes-react/     # React Native (Expo)
└── fastnotes-kotlin/    # Native Android (Jetpack Compose)


### React Native (Expo) - React

Du trenger Node.js (v18 eller nyere) og Expo Go-appen på telefonen din.
```bash
cd fastnotes-react
npm install
npx expo start
```

Skann QR-koden som dukker opp med Expo Go, så starter appen på telefonen din.


### Native Android (Jetpack Compose) - Kotlin

Du trenger Android Studio og en Android-emulator eller fysisk enhet.

1. Åpne Android Studio og velg Open
2. Naviger til `fastnotes-kotlin/` mappen
3. Vent til Gradle er ferdig med å synkronisere
4. Trykk på den grønne Run-knappen
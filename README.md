# SL Avgångstavla

Personlig avgångstavla för SL – inspirerad av egentur.se och SL:s egna skyltar.

## Kom igång

### 1. API-nyckel
Skaffa gratis nyckel på [trafiklab.se](https://trafiklab.se) → Mina nycklar → **Trafiklab Realtime APIs**

### 2. Starta proxy (krävs för CORS)
```bash
node proxy.js
```

### 3. Starta webbserver
```bash
python3 -m http.server 8080
```

### 4. Öppna
[http://localhost:8080](http://localhost:8080)

## Funktioner
- Sök och spara favorithållplatser som egna tavlor
- Realtidsavgångar via Trafiklab / SL Transport API
- Filtrera per färdsätt (tunnelbana, buss, tåg…)
- Design inspirerad av SL:s officiella hållplatsskyltar

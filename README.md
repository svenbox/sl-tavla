# SL Avgångstavla

Personlig avgångstavla för SL – inspirerad av SL:s egna hållplatsskyltar och perrongtavlor.

## Funktioner

- Sök och spara upp till 8 favorithållplatser som egna tavlor
- Realtidsavgångar via Trafiklab Realtime API med fallback till SL Transport API
- Tre kommande avgångar visas direkt på varje kort i översikten
- Filtrera per färdsätt (tunnelbana, buss, spårvagn, tåg, båt)
- Avgångstid och tid kvar i separata kolumner
- Förseningar visas med överstruken ursprungstid
- Officiella SL-ikoner och linjefärger (tunnelbanans blå/röd/grön)
- Mörkt läge (följer systeminställning)
- PWA – kan installeras på hemskärmen på iOS och Android
- Pull-to-refresh i detaljvyn

## Kom igång

### 1. API-nyckel
Skaffa gratis nyckel på [trafiklab.se](https://trafiklab.se) → Mina nycklar → **Trafiklab Realtime APIs**

### 2. Konfigurera miljövariabel
```bash
export TL_API_KEY=din_nyckel_här
```

### 3. Starta med Docker (rekommenderas)
```bash
docker compose up -d
```
Appen körs på [http://localhost:8087](http://localhost:8087)

### 4. Eller starta manuellt
```bash
# Terminal 1 – proxy
TL_API_KEY=din_nyckel node proxy.js

# Terminal 2 – webbserver
python3 -m http.server 8080
```
Öppna [http://localhost:8080](http://localhost:8080)

## Arkitektur

```
Browser → nginx (:8087) → /api/ → proxy (Node.js :3000) → Trafiklab / SL API
                        → /     → index.html (statisk)
```

- **proxy.js** – Node.js CORS-proxy som injicerar API-nyckeln server-side. Nyckeln exponeras aldrig i frontend.
- **index.html** – Hela appen i en enda fil. Sparar tavlor i `localStorage`.
- **nginx.conf** – Servar frontend och vidarebefordrar `/api/`-anrop till proxyn.

## Deployment med Docker

```bash
# Bygg och starta
docker compose up -d

# Uppdatera efter ändringar
docker compose build --no-cache && docker compose up -d

# Loggar
docker compose logs -f
```

## API-källor

| API | Används till |
|-----|-------------|
| Trafiklab Realtime API | Hållplatssökning och avgångar (primär) |
| SL Transport API | Avgångar (fallback vid kvotgräns) |

Data: [Trafiklab.se](https://trafiklab.se) / SL – CC BY 4.0

# GitHub Actions CI/CD Setup

Dieses Projekt ist für automatisiertes Deployment nach jedem Commit via GitHub Actions konfiguriert.

## Workflow Beschreibung

Die Datei [.github/workflows/ci.yml](.github/workflows/ci.yml) definiert einen automatisierten Workflow:

1. **Trigger**: Bei jedem Push zur `main` Branch
2. **Runner**: Windows (`windows-latest`)
3. **Schritte**:
   - Checkout des Repositories
   - Node.js 20 Setup + npm cache
   - Abhängigkeiten installieren (`npm ci`)
   - Markdown-Build ausführen (`build-markdown.ps1`)
   - Angular App bauen (`npm run build`)
   - In GitHub Pages deployen (`peaceiris/actions-gh-pages`)

## Erforderliche Einrichtung

### 1. GitHub Pages aktivieren
Gehe zu **Repository Settings → Pages**:
- **Source**: GitHub Actions (standard)
- **Branch** wird automatisch auf `gh-pages` gesetzt

### 2. Secrets (falls nötig)
Der Workflow nutzt `${{ secrets.GITHUB_TOKEN }}`, das automatisch by GitHub bereitgestellt wird. Keine zusätzlichen Secrets erforderlich.

### 3. build-markdown.ps1 Anforderungen
Das Skript versucht Assets von lokalen Paths zu kopieren:
- `D:\assets_raw\Zauber\Spell Images\*` → `src/assets/spellImages`
- `D:\assets_raw\Item Images\*` → `src/assets/itemImages`
- `D:\assets_raw\Rules\*` → `src/assets/rules`
- `D:\assets_raw\Campaigns\*` → `src/assets/campaigns`

**Im CI-Umfeld**: Falls diese Paths nicht vorhanden sind, werden sie übersprungen. Die Assets müssen dann bereits im Repository unter `src/assets/` vorliegen.

### 4. BASE_HREF konfigurieren
Der Workflow setzt automatisch:
```
https://<github-username>.github.io/<repository-name>/
```

Falls du eine Custom Domain nutzt oder die URL anders sein soll, ändere die Zeile:
```yaml
BASE_HREF: "https://deine-custom-url/"
```
in [ci.yml](.github/workflows/ci.yml).

## Deployment testen

1. Committe eine Änderung und pushe zur `main` Branch
2. Gehe zu **Actions** im Repository
3. Der Workflow sollte automatisch starten
4. Nach Erfolg ist die App unter deiner GitHub Pages URL verfügbar

## Fehlerbehandlung

Falls der Workflow fehlschlägt:
- Öffne die Logs im **Actions** Tab
- Häufige Fehler:
  - **Build fehlgeschlagen**: Check `npm install` & `ng build` Ausgaben
  - **MarkdownLinker Error**: Stelle sicher, dass `src/assets/rules/rulesToC.json` vorhanden ist
  - **Deploy fehlgeschlagen**: Prüfe GitHub Pages Settings

## Lokales Testen

Um den Build lokal zu testen, bevor du pushest:

```powershell
# Markdown vorbereiten
pwsh -NoProfile -ExecutionPolicy Bypass -File ./build-markdown.ps1

# Angular bauen
npm run build -- --base-href="https://dein-github-user.github.io/dein-repo/"
```

Falls lokal `D:\assets_raw` nicht vorhanden ist, nutze stattdessen `build-markdown.ci.ps1` (das Quellen überspringt).

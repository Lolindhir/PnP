# Baue Markdown über das Skript
$ErrorActionPreference = "Stop"
.\build-markdown.ci.ps1

# Baue das Projekt (nutze npx für CI-Umgebung)
npx ng build --base-href="https://lolindhir.github.io/PnP/"

# Kopiere die index.html zu 404.html
Copy-Item "docs/index.html" "docs/404.html" -Force

# Baue Markdown über das Skript
.\build-markdown.ps1

# Baue das Projekt
ng build --base-href="https://lolindhir.github.io/PnP/"

# Kopiere die index.html zu 404.html
Copy-Item "docs/index.html" "docs/404.html" -Force
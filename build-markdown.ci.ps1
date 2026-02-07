# CI-friendly version of build-markdown
$ErrorActionPreference = "Stop"

function Copy-IfExists($source, $dest, $recurse=$true) {
    if (Test-Path $source) {
        if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }
        Write-Host "Copying: $source -> $dest"
        if ($recurse) { Copy-Item -Path $source -Destination $dest -Force -Recurse } else { Copy-Item -Path $source -Destination $dest -Force }
    } else {
        Write-Error "Source not found: $source — Aborting. All required assets must be present."
        exit 1
    }
}

# Copy assets
$spellsSrc = "src\assets_raw\Zauber\spells.json"
$spellPropertiesSrc = "src\assets_raw\Zauber\spellProperties.json"
$spellImagesSrc = "src\assets_raw\Zauber\Spell Images\*"
$itemsSrc = "src\assets_raw\Items\items.json"
$itemImagesSrc = "src\assets_raw\Items\Item Images\*"
$featsSrc = "src\assets_raw\feats.json"
$featPropertiesSrc = "src\assets_raw\featProperties.json"
$rulesSrc = "src\assets_raw\Rules\*"
$rulesToCSrc = "src\assets_raw\rulesToC.json"
$campaignsSrc = "src\assets_raw\Campaigns\*"

Copy-IfExists $spellsSrc "src/assets/spells.json"
Copy-IfExists $spellPropertiesSrc "src/assets/spellProperties.json"
Copy-IfExists $spellImagesSrc "src/assets/spellImages"
Copy-IfExists $itemsSrc "src/assets/items.json"
Copy-IfExists $itemImagesSrc "src/assets/itemImages"
Copy-IfExists $featsSrc "src/assets/feats.json"
Copy-IfExists $featPropertiesSrc "src/assets/featProperties.json"
Copy-IfExists $rulesSrc "src/assets/rules"
Copy-IfExists $rulesToCSrc "src/assets/rules"
Copy-IfExists $campaignsSrc "src/assets/campaigns"

# Run MarkdownLinker if present
$mdLinkerExe = "src/markdownLinker/MarkdownLinker.exe"
if (Test-Path $mdLinkerExe) {
    Write-Host "Starting MarkdownLinker..."
    
    Write-Host "`n--- Processing Rules ---"
    & $mdLinkerExe "-t:src/assets/rules/rulesToC.json" "-r:src/assets/rules" "-p:rules/"
    if ($LASTEXITCODE -ne 0) { Write-Error "MarkdownLinker (rules) failed with exit code $LASTEXITCODE. Semantic errors in markdown files. Aborting build process."; exit $LASTEXITCODE }

    Write-Host "`n--- Processing Starter Campaign ---"
    & $mdLinkerExe "-t:src/assets/campaigns/campaignStarterToC.json" "-c:src/assets/rules/rulesToC.json" "-r:src/assets/campaigns/Starter" "-p:campaigns/starter/" "-g:src/assets/campaigns/Starter/GlossaryStarter.md" "-d" "-i" "-m"
    if ($LASTEXITCODE -ne 0) { Write-Error "MarkdownLinker (starter campaign) failed with exit code $LASTEXITCODE. Semantic errors in markdown files. Aborting build process."; exit $LASTEXITCODE }

    Write-Host "`n--- Processing Strahd Campaign ---"
    & $mdLinkerExe "-t:src/assets/campaigns/campaignStrahdToC.json" "-c:src/assets/rules/rulesToC.json" "-r:src/assets/campaigns/Strahd" "-p:campaigns/strahd/" "-g:src/assets/campaigns/Strahd/GlossaryStrahd.md" "-d" "-i" "-m"
    if ($LASTEXITCODE -ne 0) { Write-Error "MarkdownLinker (strahd campaign) failed with exit code $LASTEXITCODE. Semantic errors in markdown files. Aborting build process."; exit $LASTEXITCODE }
    
    Write-Host "`nMarkdownLinker completed successfully.`n"
} else {
    Write-Host "MarkdownLinker.exe not found (src/markdownLinker). Skipping linker run."
}

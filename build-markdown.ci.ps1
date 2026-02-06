# CI-freundliche Version von build-markdown
$ErrorActionPreference = "Stop"

function Copy-IfExists($source, $dest, $recurse=$true) {
    if (Test-Path $source) {
        if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }
        if ($recurse) { Copy-Item -Path $source -Destination $dest -Force -Recurse } else { Copy-Item -Path $source -Destination $dest -Force }
        return $true
    } else {
        Write-Host "Quelle nicht gefunden: $source - überspringe Kopieren"
        return $false
    }
}

# Assets kopieren
$spellsSrc = "D:\assets_raw\Zauber\spells.json"
$spellPropertiesSrc = "D:\assets_raw\Zauber\spellProperties.json"
$spellImagesSrc = "D:\assets_raw\Zauber\Spell Images\*"
$itemsSrc = "D:\assets_raw\Items\items.json"
$itemImagesSrc = "D:\assets_raw\Items\Item Images\*"
$featsSrc = "D:\assets_raw\feats.json"
$featPropertiesSrc = "D:\assets_raw\featProperties.json"
$rulesSrc = "D:\assets_raw\Rules\*"
$rulesToCSrc = "D:\assets_raw\rulesToC.json"
$campaignsSrc = "D:\assets_raw\Campaigns\*"

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

# Führe MarkdownLinker aus, falls vorhanden
$mdLinkerExe = "src/markdownLinker/MarkdownLinker.exe"
if (Test-Path $mdLinkerExe) {
    Write-Host "Starte MarkdownLinker..."
    $processRules = Start-Process -FilePath $mdLinkerExe -ArgumentList "`"-t:src/assets/rules/rulesToC.json`" `"-r:src/assets/rules`" `"-p:rules/`"" -NoNewWindow -Wait -PassThru
    if ($processRules.ExitCode -ne 0) { Write-Error "MarkdownLinker (rules) failed with exit code $($processRules.ExitCode). Aborting build process."; exit $processRules.ExitCode }

    $processStarter = Start-Process -FilePath $mdLinkerExe -ArgumentList "`"-t:src/assets/campaigns/campaignStarterToC.json`" `"-c:src/assets/rules/rulesToC.json`" `"-r:src/assets/campaigns/Starter`" `"-p:campaigns/starter/`" `"-g:src/assets/campaigns/Starter/GlossaryStarter.md`" -d -i -m" -NoNewWindow -Wait -PassThru
    if ($processStarter.ExitCode -ne 0) { Write-Error "MarkdownLinker (starter) failed with exit code $($processStarter.ExitCode). Aborting build process."; exit $processStarter.ExitCode }

    $processStrahd = Start-Process -FilePath $mdLinkerExe -ArgumentList "`"-t:src/assets/campaigns/campaignStrahdToC.json`" `"-c:src/assets/rules/rulesToC.json`" `"-r:src/assets/campaigns/Strahd`" `"-p:campaigns/strahd/`" `"-g:src/assets/campaigns/Strahd/GlossaryStrahd.md`" -d -i -m" -NoNewWindow -Wait -PassThru
    if ($processStrahd.ExitCode -ne 0) { Write-Error "MarkdownLinker (strahd) failed with exit code $($processStrahd.ExitCode). Aborting build process."; exit $processStrahd.ExitCode }
} else {
    Write-Host "MarkdownLinker.exe nicht gefunden (src/markdownLinker). Linker-Lauf wird übersprungen."
}

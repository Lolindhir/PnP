
# Lösche alte Dateien
Remove-Item "src/assets/spellImages/*" -Force
Remove-Item "src/assets/itemImages/*" -Force
Remove-Item "src/assets/rules/*" -Recurse -Force
Remove-Item "src/assets/campaigns/*" -Recurse -Force
Remove-Item "src/markdownLinker*" -Recurse -Force

# Kopiere neue Dateien
Copy-Item -Path "D:\OneDrive\D&D\Website Content\Zauber\Spell Images\*" -Destination "src/assets/spellImages" -Force -Recurse
Copy-Item -Path "D:\OneDrive\D&D\Karten - Items\_Images\*" -Destination "src/assets/itemImages" -Force -Recurse
Copy-Item -Path "D:\OneDrive\D&D\Website Content\Rules\*" -Destination "src/assets/rules" -Force -Recurse
Copy-Item -Path "D:\OneDrive\D&D\Website Content\rulesToC.json" -Destination "src/assets/rules" -Force
Copy-Item -Path "D:\OneDrive\D&D\Website Content\Campaigns\*" -Destination "src/assets/campaigns" -Force -Recurse
Copy-Item -Path "D:\OneDrive\D&D\Website Content\MarkdownLinker\*" -Destination "src/markdownLinker" -Force -Recurse

# Führe MarkdownLinker aus für Rules
$processRules = Start-Process -FilePath "src/markdownLinker/MarkdownLinker.exe" -ArgumentList "`"-t:src/assets/rules/rulesToC.json`" `"-r:src/assets/rules`" `"-p:rules/`"" -NoNewWindow -Wait -PassThru
if ($processRules.ExitCode -ne 0) {
    Write-Error "MarkdownLinker failed with exit code $($processRules.ExitCode). Aborting build process."
    exit $process.ExitCode
}

# Führe MarkdownLinker aus für Starter Kampagne
$processStarter = Start-Process -FilePath "src/markdownLinker/MarkdownLinker.exe" -ArgumentList "`"-t:src/assets/campaigns/campaignStarterToC.json`" `"-c:src/assets/rules/rulesToC.json`" `"-r:src/assets/campaigns/Starter`" `"-p:campaigns/starter/`" -d -i" -NoNewWindow -Wait -PassThru
if ($processStarter.ExitCode -ne 0) {
    Write-Error "MarkdownLinker failed with exit code $($processStarter.ExitCode). Aborting build process."
    exit $process.ExitCode
}

# Führe MarkdownLinker aus für Strahd Kampagne
$processStrahd = Start-Process -FilePath "src/markdownLinker/MarkdownLinker.exe" -ArgumentList "`"-t:src/assets/campaigns/campaignStrahdToC.json`" `"-c:src/assets/rules/rulesToC.json`" `"-r:src/assets/campaigns/Strahd`" `"-p:campaigns/strahd/`" -d -i" -NoNewWindow -Wait -PassThru
if ($processStrahd.ExitCode -ne 0) {
    Write-Error "MarkdownLinker failed with exit code $($processStrahd.ExitCode). Aborting build process."
    exit $process.ExitCode
}

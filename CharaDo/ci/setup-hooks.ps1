# Encoding: UTF-8
Write-Host "Setting up local git hooks path"

$projDir = "CharaDo"
$ciDir = "ci"

# (Get-Location).Path

# navigate to the ci directory.
Set-Location ..
# set local git hooks path to the ci directory
$hooksDir = "$projDir/$ciDir"
git config --local core.hooksPath "$hooksDir"
# confirm the change
git config --local --get core.hooksPath
# return to the project directory
Set-Location $projDir

Write-Host "Git hooks have been set up successfully."
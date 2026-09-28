<#
.SYNOPSIS
  Fresh-Windows preflight for the Siddaganga BrowserStack QA project.

.DESCRIPTION
  Checks system prerequisites that Node scripts cannot check for themselves (Node.js, npm, Git,
  Chrome, winget). By default it only REPORTS. With -Install it installs missing tools via winget
  (user-scope where possible) and then runs `npm run setup`.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File setup\setup.ps1            # report only
  powershell -ExecutionPolicy Bypass -File setup\setup.ps1 -Install   # install missing tools, then npm run setup
#>
param([switch]$Install)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Test-Cmd($name) { $null -ne (Get-Command $name -ErrorAction SilentlyContinue) }
function Show($status, $name, $detail) { Write-Host ("  [{0}] {1} - {2}" -f $status, $name, $detail) }

Write-Host "`nSiddaganga BrowserStack QA - Windows preflight ($root)`n"
Show 'INFO' 'Windows' ([System.Environment]::OSVersion.VersionString)

$tools = @(
  @{ Name = 'node';   Id = 'OpenJS.NodeJS.LTS'; Required = $true  },
  @{ Name = 'git';    Id = 'Git.Git';           Required = $false },
  @{ Name = 'chrome'; Id = 'Google.Chrome';     Required = $true  }
)

$chromeFound = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1

$missing = @()
foreach ($t in $tools) {
  $ok = if ($t.Name -eq 'chrome') { [bool]$chromeFound } else { Test-Cmd $t.Name }
  if ($ok) {
    $ver = if ($t.Name -eq 'chrome') { 'installed' } else { (& $t.Name --version) -join ' ' }
    Show ' OK ' $t.Name $ver
  } else {
    Show $(if ($t.Required) { 'FAIL' } else { 'WARN' }) $t.Name "missing (winget install -e --id $($t.Id))"
    $missing += $t
  }
}
if (Test-Cmd 'npm') { Show ' OK ' 'npm' (& npm -v) } elseif (Test-Cmd 'node') { Show 'FAIL' 'npm' 'missing - reinstall Node.js LTS' }

if ($missing.Count -gt 0) {
  if (-not $Install) {
    Write-Host "`nMissing tools. Re-run with -Install to install them via winget, or install manually (see SETUP.md)."
    exit 1
  }
  if (-not (Test-Cmd 'winget')) {
    Write-Host "`nwinget is not available. Install 'App Installer' from the Microsoft Store, or install the tools manually (SETUP.md)."
    exit 1
  }
  foreach ($t in $missing) {
    Write-Host "`nInstalling $($t.Id) ..."
    winget install -e --id $t.Id --accept-source-agreements --accept-package-agreements
  }
  # Pick up PATH changes made by the installers in this session.
  $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')
}

if (Test-Cmd 'node') {
  Write-Host "`nRunning project bootstrap (npm run setup) ..."
  npm run setup
  exit $LASTEXITCODE
} else {
  Write-Host "`nNode.js still not on PATH. Open a new terminal and run: npm run setup"
  exit 1
}

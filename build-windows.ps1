$ErrorActionPreference = "Stop"

$RepoRoot = $PSScriptRoot
$StagingDir = Join-Path $RepoRoot "staging"
$StagingApp = Join-Path $StagingDir "app"
$BackendDir = Join-Path $RepoRoot "backend"
$BuildDir = Join-Path $RepoRoot "build"

# Step 1: Build frontend
Write-Host ">>> Building frontend..." -ForegroundColor Cyan
Set-Location $RepoRoot
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed."; exit 1 }

# Step 2: Clean and recreate staging
Write-Host ">>> Creating staging directory..." -ForegroundColor Cyan
if (Test-Path $StagingDir) {
    Remove-Item -Recurse -Force $StagingDir
}
New-Item -ItemType Directory -Path $StagingApp | Out-Null

# Step 3: Copy backend to staging, excluding node_modules
Write-Host ">>> Copying backend to staging (excluding node_modules)..." -ForegroundColor Cyan
robocopy $BackendDir $StagingApp /E /XD node_modules /XF "*.log" | Out-Null
if ($LASTEXITCODE -ge 8) { Write-Error "robocopy failed with code $LASTEXITCODE"; exit 1 }

# Step 4: Install production dependencies inside staged backend
Write-Host ">>> Installing production dependencies..." -ForegroundColor Cyan
Set-Location $StagingApp
npm install --production
if ($LASTEXITCODE -ne 0) { Write-Error "npm install failed."; exit 1 }

# Step 5: Run NSIS
Write-Host ">>> Running NSIS compiler..." -ForegroundColor Cyan
Set-Location $RepoRoot

$NsisPaths = @(
    "C:\Program Files (x86)\NSIS\makensis.exe",
    "C:\Program Files\NSIS\makensis.exe"
)
$Makensis = $NsisPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $Makensis) {
    Write-Error "NSIS not found. Install NSIS or add its path to `$NsisPaths in this script."
    exit 1
}

& $Makensis "installer.nsi"
if ($LASTEXITCODE -ne 0) { Write-Error "NSIS compilation failed."; exit 1 }

Write-Host ">>> Build complete! Installer created." -ForegroundColor Green

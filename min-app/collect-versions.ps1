# save: collect-versions.ps1
$out = "project-versions.txt"
"`n==== Project versions collected on $(Get-Date -Format u) ====`n" | Out-File $out -Encoding utf8

# helper
function Append($title, $text){
    "`n--- $title ---`n" | Out-File $out -Append -Encoding utf8
    $text | Out-File $out -Append -Encoding utf8
}

# OS
try {
    $os = (Get-CimInstance Win32_OperatingSystem).Caption + " " + (Get-CimInstance Win32_OperatingSystem).Version
} catch {
    $os = [System.Environment]::OSVersion.ToString()
}
Append "OS" $os

# basic tools
try { Append "node -v" (node -v) } catch { Append "node -v" "(not found)" }
try { Append "npm -v" (npm -v) } catch { Append "npm -v" "(not found)" }
try { Append "yarn -v" (yarn -v) } catch { Append "yarn -v" "(not found)" }
try { Append "pnpm -v" (pnpm -v) } catch { Append "pnpm -v" "(not found)" }
try { Append "npx -v" (npx -v) } catch { Append "npx -v" "(not found)" }

# rust toolchain
try { Append "rustc --version" (rustc --version) } catch { Append "rustc --version" "(not found)" }
try { Append "cargo --version" (cargo --version) } catch { Append "cargo --version" "(not found)" }
try { Append "rustup --version" (rustup --version) } catch { Append "rustup --version" "(not found)" }
try { Append "rustup show" (rustup show 2>&1) } catch { Append "rustup show" "(not available)" }

# tauri CLI info (if available)
try {
    $tauriInfo = npx --no-install tauri info 2>&1
    Append "npx tauri info" $tauriInfo
} catch {
    Append "npx tauri info" "(tauri CLI not available via npx)"
}

# package.json dependencies
if (Test-Path package.json) {
    try {
        $pkg = Get-Content package.json -Raw | ConvertFrom-Json
        Append "package.json: name/version" ("$($pkg.name) $($pkg.version)")
        if ($pkg.dependencies) { Append "package.json dependencies" ($pkg.dependencies | ConvertTo-Json -Depth 5) }
        if ($pkg.devDependencies) { Append "package.json devDependencies" ($pkg.devDependencies | ConvertTo-Json -Depth 5) }
    } catch {
        Append "package.json parse" "(failed to parse package.json)"
    }
} else {
    Append "package.json" "(not found)"
}

# src-tauri/Cargo.toml parsing (simple)
$ct = "src-tauri/Cargo.toml"
if (Test-Path $ct) {
    $lines = Get-Content $ct
    Append "Cargo.toml (raw)" ($lines -join "`n")
    # simple extraction of dependency lines
    $inDeps = $false; $inBuildDeps=$false
    $depsOut = @(); $buildDepsOut = @()
    foreach ($line in $lines) {
        if ($line -match '^\s*\[dependencies\]') { $inDeps = $true; $inBuildDeps=$false; continue }
        if ($line -match '^\s*\[build-dependencies\]') { $inBuildDeps = $true; $inDeps=$false; continue }
        if ($line -match '^\s*\[') { $inDeps = $false; $inBuildDeps = $false; continue }
        if ($inDeps -and $line -match '^\s*([A-Za-z0-9_\-]+)\s*=\s*"(.*)"') {
            $depsOut += "$($matches[1]) = $($matches[2])"
        } elseif ($inDeps -and $line -match '^\s*([A-Za-z0-9_\-]+)\s*=\s*\{\s*version\s*=\s*"(.*)"') {
            $depsOut += "$($matches[1]) = $($matches[2])"
        }
        if ($inBuildDeps -and $line -match '^\s*([A-Za-z0-9_\-]+)\s*=\s*"(.*)"') {
            $buildDepsOut += "$($matches[1]) = $($matches[2])"
        } elseif ($inBuildDeps -and $line -match '^\s*([A-Za-z0-9_\-]+)\s*=\s*\{\s*version\s*=\s*"(.*)"') {
            $buildDepsOut += "$($matches[1]) = $($matches[2])"
        }
    }
    if ($depsOut.Count -gt 0) { Append "Cargo.toml dependencies (declared)" ($depsOut -join "`n") } else { Append "Cargo.toml dependencies (declared)" "(none parsed)" }
    if ($buildDepsOut.Count -gt 0) { Append "Cargo.toml build-dependencies (declared)" ($buildDepsOut -join "`n") } else { Append "Cargo.toml build-dependencies (declared)" "(none parsed)" }
} else {
    Append "src-tauri/Cargo.toml" "(not found)"
}

# Cargo.lock / cargo metadata (optional)
if (Test-Path "src-tauri/Cargo.lock") {
    Append "src-tauri/Cargo.lock (first 200 lines)" ((Get-Content "src-tauri/Cargo.lock")[0..([math]::Min(199, (Get-Content "src-tauri/Cargo.lock").Count-1))] -join "`n")
} else {
    Append "src-tauri/Cargo.lock" "(not found)"
}

try {
    $meta = cargo metadata --format-version 1 --no-deps 2>&1
    Append "cargo metadata --no-deps" $meta
} catch {
    Append "cargo metadata" "(not available / cargo missing)"
}

"`n==== end ====`n" | Out-File $out -Append -Encoding utf8
Write-Host "Wrote $out"

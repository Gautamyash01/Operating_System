$ErrorActionPreference = 'Stop'

$src = Join-Path $PSScriptRoot 'scheduler.c'
$out = Join-Path $PSScriptRoot 'scheduler.dll'

function Has-Command([string]$name) {
	$null -ne (Get-Command $name -ErrorAction SilentlyContinue)
}

if (Has-Command 'cl.exe') {
	Write-Host 'Building with cl.exe'
	Push-Location $PSScriptRoot
	cl /LD scheduler.c /Fescheduler.dll
	Pop-Location
}
elseif (Has-Command 'gcc') {
	Write-Host 'Building with gcc (mingw)'
	& gcc -shared -o $out -O2 -Wl,--out-implib,libscheduler.a -Wl,--export-all-symbols -I. $src
}
else {
	Write-Error 'No compiler found. Install Build Tools for Visual Studio or MinGW-w64.'
}

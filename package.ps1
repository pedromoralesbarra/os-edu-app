param()
# Empaqueta la app en un zip en Windows PowerShell
$Out = "os-edu-app.zip"
if(Test-Path $Out){ Remove-Item $Out }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[IO.Compression.ZipFile]::CreateFromDirectory((Get-Location).Path, $Out)
Write-Host "Paquete creado: $Out"

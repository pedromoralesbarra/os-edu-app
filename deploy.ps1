Param(
  [Parameter(Mandatory=$true)] [string] $Repo
)
# Requiere gh CLI y git
if (-not (Test-Path .git)){
  git init
  git add -A
  git commit -m "Initial commit: OS Explorer"
}
$exists = gh repo view $Repo 2>$null
if ($LASTEXITCODE -ne 0){
  gh repo create $Repo --public --source=. --remote=origin --push
}else{
  Write-Host "Repositorio ya existe en GitHub: $Repo"
  git push -u origin HEAD
}
Write-Host 'Listo. La acción de GitHub Pages publicará el sitio automáticamente.'

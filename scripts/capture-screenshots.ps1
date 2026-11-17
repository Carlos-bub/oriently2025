param(
  [ValidateSet("all", "login", "home", "agendar", "agenda", "detalhes")]
  [string]$Screen = "all",
  [string]$OutDir = "docs\images"
)

$adb = Join-Path $env:LOCALAPPDATA "Android\Sdk\platform-tools\adb.exe"
if (-not (Test-Path $adb)) {
  Write-Error "ADB não encontrado em: $adb"
  exit 1
}

$devices = & $adb devices | Select-String -Pattern "\tdevice$"
if (-not $devices) {
  Write-Error "Nenhum dispositivo Android conectado via ADB."
  exit 1
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

function Capture-Screen {
  param([string]$name)
  $target = Join-Path $OutDir "$name.png"
  cmd /c "`"$adb`" exec-out screencap -p > `"$target`""
  if (Test-Path $target) {
    $sizeKb = [Math]::Round((Get-Item $target).Length / 1KB, 1)
    Write-Host "Captura salva: $target ($sizeKb KB)"
  } else {
    Write-Warning "Falha ao salvar $target"
  }
}

if ($Screen -ne "all") {
  Capture-Screen -name $Screen
  exit 0
}

$screens = @(
  @{ Key = "login"; Prompt = "1/5: Abra a tela de LOGIN no aparelho e pressione Enter" },
  @{ Key = "home"; Prompt = "2/5: Abra a tela INÍCIO (Home) no aparelho e pressione Enter" },
  @{ Key = "agendar"; Prompt = "3/5: Abra a tela AGENDAR ORIENTAÇÃO e selecione uma data/horário, depois pressione Enter" },
  @{ Key = "agenda"; Prompt = "4/5: Abra a tela MEUS AGENDAMENTOS (Agenda) e pressione Enter" },
  @{ Key = "detalhes"; Prompt = "5/5: Abra a tela DETALHES DA ORIENTAÇÃO e pressione Enter" }
)

foreach ($item in $screens) {
  Read-Host $item.Prompt | Out-Null
  Capture-Screen -name $item.Key
}

Write-Host "Capturas concluídas em $OutDir."

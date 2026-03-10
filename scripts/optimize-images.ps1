Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

$targets = @(
  @{
    Path = Join-Path $root "src\assets\hero"
    MaxWidth = 1800
    MaxHeight = 1800
    Quality = 76
    Filter = "*.jpg"
  },
  @{
    Path = Join-Path $root "src\assets\categories"
    MaxWidth = 1200
    MaxHeight = 1500
    Quality = 74
    Filter = "*.jpg"
  },
  @{
    Path = Join-Path $root "src\assets\scent-families"
    MaxWidth = 1000
    MaxHeight = 1250
    Quality = 72
    Filter = "*.jpg"
  },
  @{
    Path = Join-Path $root "src\assets\products"
    MaxWidth = 1400
    MaxHeight = 1750
    Quality = 78
    Filter = "*.jpg"
  }
)

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" } |
  Select-Object -First 1

if (-not $jpegCodec) {
  throw "JPEG codec not available."
}

$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)

$totalBefore = 0L
$totalAfter = 0L
$optimizedCount = 0
$skippedCount = 0

foreach ($target in $targets) {
  if (-not (Test-Path $target.Path)) {
    continue
  }

  $files = Get-ChildItem -Path $target.Path -Recurse -File -Filter $target.Filter

  foreach ($file in $files) {
    $beforeSize = $file.Length
    $totalBefore += $beforeSize

    $sourceImage = $null
    $sourceStream = $null
    $bitmap = $null
    $graphics = $null
    $stream = $null
    $tempPath = "$($file.FullName).tmp"

    try {
      $sourceBytes = [System.IO.File]::ReadAllBytes($file.FullName)
      $sourceStream = New-Object System.IO.MemoryStream(,$sourceBytes)
      $sourceImage = [System.Drawing.Image]::FromStream($sourceStream)

      $scale = [Math]::Min(
        1.0,
        [Math]::Min(
          $target.MaxWidth / [double]$sourceImage.Width,
          $target.MaxHeight / [double]$sourceImage.Height
        )
      )

      $width = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $scale))
      $height = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $scale))

      $bitmap = New-Object System.Drawing.Bitmap($width, $height)
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.Clear([System.Drawing.Color]::White)
      $graphics.DrawImage($sourceImage, 0, 0, $width, $height)

      $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality,
        [long]$target.Quality
      )

      $stream = [System.IO.File]::Open($tempPath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
      $bitmap.Save($stream, $jpegCodec, $encoderParams)
      $stream.Close()
      $stream = $null

      $afterSize = (Get-Item $tempPath).Length

      if ($afterSize -lt $beforeSize) {
        [System.IO.File]::Copy($tempPath, $file.FullName, $true)
        Remove-Item -Path $tempPath -Force
        $totalAfter += $afterSize
        $optimizedCount++
      } else {
        Remove-Item -Path $tempPath -Force
        $totalAfter += $beforeSize
        $skippedCount++
      }
    }
    finally {
      if ($stream) { $stream.Dispose() }
      if ($graphics) { $graphics.Dispose() }
      if ($bitmap) { $bitmap.Dispose() }
      if ($sourceImage) { $sourceImage.Dispose() }
      if ($sourceStream) { $sourceStream.Dispose() }
      if (Test-Path $tempPath) {
        Remove-Item -Path $tempPath -Force -ErrorAction SilentlyContinue
      }
    }
  }
}

$savedBytes = $totalBefore - $totalAfter
$savedMb = [Math]::Round($savedBytes / 1MB, 2)

Write-Host "Optimized JPG files: $optimizedCount"
Write-Host "Skipped files: $skippedCount"
Write-Host "Saved MB: $savedMb"

# Windows Native PowerShell Cloudflare DNS Setup Script
$ErrorActionPreference = "Stop"

$DomainName = "criptana360.com"
$TargetCname = "llsandrozll.github.io"
$TargetIps = @(
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153"
)

Write-Host "=== Windows Native DNS Setup: $DomainName ===" -ForegroundColor Cyan

# Parse .env file for API Token
$EnvPath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $EnvPath)) {
    Write-Error "ERROR: .env file not found."
    exit 1
}

$EnvContent = Get-Content $EnvPath -Raw
if ($EnvContent -match "CLOUDFLARE_API_TOKEN=(.*)") {
    $ApiToken = $Matches[1].Trim()
}

if (-not $ApiToken) {
    Write-Error "ERROR: CLOUDFLARE_API_TOKEN not found in .env."
    exit 1
}

$Headers = @{
    "Authorization" = "Bearer $ApiToken"
    "Content-Type"  = "application/json"
}

try {
    # Step 1: Query Zone ID
    Write-Host ""
    Write-Host "Step 1: Querying Cloudflare for Zone ID..." -ForegroundColor Yellow
    $ZoneUrl = "https://api.cloudflare.com/client/v4/zones?name=$DomainName"
    $ZoneResponse = Invoke-RestMethod -Uri $ZoneUrl -Method Get -Headers $Headers
    
    if ($ZoneResponse.result.Count -eq 0) {
        Write-Error "ERROR: Domain $DomainName not found on your Cloudflare account. Please verify token permissions."
        exit 1
    }
    
    $ZoneId = $ZoneResponse.result[0].id
    Write-Host "   OK - Zone ID retrieved: $ZoneId" -ForegroundColor Green
    
    # Step 2: Delete conflicting records
    Write-Host ""
    Write-Host "Step 2: Clearing existing conflicting records..." -ForegroundColor Yellow
    $DnsUrl = "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records"
    $DnsResponse = Invoke-RestMethod -Uri $DnsUrl -Method Get -Headers $Headers
    
    foreach ($Record in $DnsResponse.result) {
        if (($Record.type -eq "A" -and $Record.name -eq $DomainName) -or 
            ($Record.type -eq "CNAME" -and $Record.name -eq "www.$DomainName")) {
            Write-Host "   - Deleting default $($Record.type) record ($($Record.content))..."
            $DeleteUrl = "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records/$($Record.id)"
            $Null = Invoke-RestMethod -Uri $DeleteUrl -Method Delete -Headers $Headers
        }
    }
    Write-Host "   OK - Existing DNS conflicts cleared." -ForegroundColor Green

    # Step 3: Inject A Records
    Write-Host ""
    Write-Host "Step 3: Injecting 4 root A records pointing to GitHub Pages..." -ForegroundColor Yellow
    foreach ($Ip in $TargetIps) {
        $Body = @{
            type    = "A"
            name    = "@"
            content = $Ip
            ttl     = 1
            proxied = $false
        } | ConvertTo-Json
        
        $Null = Invoke-RestMethod -Uri $DnsUrl -Method Post -Headers $Headers -Body $Body
        Write-Host "   OK - Created A Record: @ -> $Ip" -ForegroundColor Green
    }

    # Step 4: Inject CNAME Record
    Write-Host ""
    Write-Host "Step 4: Injecting CNAME record for www subdomain..." -ForegroundColor Yellow
    $CnameBody = @{
        type    = "CNAME"
        name    = "www"
        content = $TargetCname
        ttl     = 1
        proxied = $false
    } | ConvertTo-Json
    
    $Null = Invoke-RestMethod -Uri $DnsUrl -Method Post -Headers $Headers -Body $CnameBody
    Write-Host "   OK - Created CNAME Record: www -> $TargetCname" -ForegroundColor Green

    Write-Host ""
    Write-Host "=======================================================" -ForegroundColor Cyan
    Write-Host "SUCCESS! Criptana360.com DNS configured successfully." -ForegroundColor Green
    Write-Host "=======================================================" -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "ERROR: Cloudflare DNS Configuration Failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

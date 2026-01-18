$body = @{
    email = "saiful@cuet.ac.bd"
    password = "pass12345"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"

Write-Host "Login Response:"
$response | ConvertTo-Json -Depth 10

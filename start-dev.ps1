# Start EventHive with Socket.IO
Write-Host "Starting EventHive with Socket.IO..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Socket.IO server..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "socket-server.js" -WindowStyle Hidden

Write-Host "Waiting for Socket.IO server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting Next.js development server..." -ForegroundColor Yellow
npm run dev

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "    ORDER MANAGEMENT TEST" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Login as User
Write-Host "`n[1] Logging in as User..." -ForegroundColor Yellow
$loginBody = @{email="john@example.com"; password="password123"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.token
Write-Host "✅ Logged in as: $($response.name)" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. Get products
Write-Host "`n[2] Getting products..." -ForegroundColor Yellow
$products = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method GET
$productId = $products.products[0]._id
Write-Host "Product ID: $productId" -ForegroundColor Yellow

# 3. Add to cart
Write-Host "`n[3] Adding to cart..." -ForegroundColor Yellow
$cartBody = @{ productId = $productId; quantity = 2 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method POST -Body $cartBody -Headers $headers
Write-Host "✅ Added to cart" -ForegroundColor Green

# 4. Get cart
Write-Host "`n[4] Getting cart..." -ForegroundColor Yellow
$cart = Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method GET -Headers $headers
Write-Host "✅ Cart retrieved!" -ForegroundColor Green
Write-Host "  Items: $($cart.cart.items.Count)" -ForegroundColor Cyan
Write-Host "  Total: ₹$($cart.cart.totalAmount)" -ForegroundColor Cyan

# 5. Create order
Write-Host "`n[5] Creating order..." -ForegroundColor Yellow
$orderBody = @{
    shippingAddress = @{
        street = "123 Main St"
        city = "Mumbai"
        state = "Maharashtra"
        zipCode = "400001"
        country = "India"
    }
    paymentMethod = "card"
} | ConvertTo-Json

$order = Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method POST -Body $orderBody -Headers $headers
Write-Host "✅ Order created!" -ForegroundColor Green
Write-Host "  Order ID: $($order.order._id)" -ForegroundColor Cyan
Write-Host "  Total: ₹$($order.order.totalAmount)" -ForegroundColor Cyan

# 6. Get my orders
Write-Host "`n[6] Getting my orders..." -ForegroundColor Yellow
$myOrders = Invoke-RestMethod -Uri "http://localhost:5000/api/orders/my" -Method GET -Headers $headers
Write-Host "✅ Orders retrieved!" -ForegroundColor Green
Write-Host "  Total Orders: $($myOrders.count)" -ForegroundColor Cyan

# 7. Login as Admin
Write-Host "`n[7] Logging in as Admin..." -ForegroundColor Yellow
$adminLogin = @{email="admin@example.com"; password="admin123"} | ConvertTo-Json
$adminResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $adminLogin -ContentType "application/json"
$adminToken = $adminResponse.token
Write-Host "✅ Admin logged in" -ForegroundColor Green

$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

# 8. Get all orders (admin)
Write-Host "`n[8] Getting all orders (admin)..." -ForegroundColor Yellow
$allOrders = Invoke-RestMethod -Uri "http://localhost:5000/api/orders/admin/all" -Method GET -Headers $adminHeaders
Write-Host "✅ All orders retrieved!" -ForegroundColor Green
Write-Host "  Total Orders: $($allOrders.count)" -ForegroundColor Cyan

# 9. Update order status (admin)
Write-Host "`n[9] Updating order status (admin)..." -ForegroundColor Yellow
if ($allOrders.orders.Count -gt 0) {
    $orderId = $allOrders.orders[0]._id
    $statusBody = @{ orderStatus = "Processing" } | ConvertTo-Json
    
    $updated = Invoke-RestMethod -Uri "http://localhost:5000/api/orders/$orderId/status" -Method PUT -Body $statusBody -Headers $adminHeaders
    Write-Host "✅ Order status updated to 'Processing'" -ForegroundColor Green
} else {
    Write-Host "⚠️ No orders to update" -ForegroundColor Yellow
}

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "    ALL TESTS COMPLETED!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
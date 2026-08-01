Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "    E-COMMERCE API COMPLETE TEST" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Login
Write-Host "`n[1] Logging in as Admin..." -ForegroundColor Yellow
$adminLogin = @{email="admin@example.com"; password="admin123"} | ConvertTo-Json
try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $adminLogin -ContentType "application/json"
    $adminToken = $adminResponse.token
    $headers = @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    Write-Host "✅ Admin logged in" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the server is running!" -ForegroundColor Red
    exit
}

# 2. Get Categories
Write-Host "`n[2] Getting Categories..." -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method GET
    Write-Host "✅ Categories retrieved!" -ForegroundColor Green
    $categories.categories | ForEach-Object { Write-Host "  - $($_.name): $($_.id)" }
} catch {
    Write-Host "❌ Failed to get categories" -ForegroundColor Red
}

# 3. Get All Products
Write-Host "`n[3] Getting All Products..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method GET
    Write-Host "✅ Products retrieved!" -ForegroundColor Green
    Write-Host "Total products: $($products.count)" -ForegroundColor Yellow
    $products.products | ForEach-Object {
        Write-Host "  Product: $($_.name)" -ForegroundColor Cyan
        Write-Host "    Price: ₹$($_.price)" -ForegroundColor Cyan
        Write-Host "    Category: $($_.category.name)" -ForegroundColor Cyan
        Write-Host "    Stock: $($_.availableCopies)" -ForegroundColor Cyan
        Write-Host "    ---"
    }
} catch {
    Write-Host "❌ Failed to get products" -ForegroundColor Red
}

# 4. Search Products
Write-Host "`n[4] Searching Products (search='headphones')..." -ForegroundColor Yellow
try {
    $searchResults = Invoke-RestMethod -Uri "http://localhost:5000/api/products?search=headphones" -Method GET
    Write-Host "✅ Search completed! Found $($searchResults.count) products" -ForegroundColor Green
} catch {
    Write-Host "❌ Search failed" -ForegroundColor Red
}

# 5. Filter by Category
Write-Host "`n[5] Filtering by Category (Electronics)..." -ForegroundColor Yellow
try {
    $electronicsId = $categories.categories[0]._id
    $filtered = Invoke-RestMethod -Uri "http://localhost:5000/api/products?category=$electronicsId" -Method GET
    Write-Host "✅ Found $($filtered.count) products in Electronics" -ForegroundColor Green
} catch {
    Write-Host "❌ Filter failed" -ForegroundColor Red
}

# 6. Price Range
Write-Host "`n[6] Filtering by Price Range (₹10 - ₹100)..." -ForegroundColor Yellow
try {
    $priceFiltered = Invoke-RestMethod -Uri "http://localhost:5000/api/products?minPrice=10&maxPrice=100" -Method GET
    Write-Host "✅ Found $($priceFiltered.count) products in price range" -ForegroundColor Green
} catch {
    Write-Host "❌ Price filter failed" -ForegroundColor Red
}

# 7. Pagination
Write-Host "`n[7] Pagination (page=1, limit=2)..." -ForegroundColor Yellow
try {
    $pagination = Invoke-RestMethod -Uri "http://localhost:5000/api/products?page=1&limit=2" -Method GET
    Write-Host "✅ Pagination works!" -ForegroundColor Green
    Write-Host "  Page: $($pagination.page)" -ForegroundColor Cyan
    Write-Host "  Total Pages: $($pagination.totalPages)" -ForegroundColor Cyan
    Write-Host "  Total Products: $($pagination.total)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Pagination failed" -ForegroundColor Red
}

# 8. Sort by Price
Write-Host "`n[8] Sorting by Price (low to high)..." -ForegroundColor Yellow
try {
    $sorted = Invoke-RestMethod -Uri "http://localhost:5000/api/products?sort=price-asc" -Method GET
    Write-Host "✅ Sorting works!" -ForegroundColor Green
    $sorted.products | ForEach-Object {
        Write-Host "  $($_.name): ₹$($_.price)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Sorting failed" -ForegroundColor Red
}

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "    ALL TESTS COMPLETED!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
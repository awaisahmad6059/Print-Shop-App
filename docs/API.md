# API Documentation

## Orders
- `POST /api/orders` - Create new order (multipart form with file and config)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order status

## Shop
- `GET /api/shop/config` - Get shop configuration
- `POST /api/shop/config` - Update shop configuration

## Files
- `POST /api/files/upload` - Upload file
- Static files served from `/uploads/*`

### APIs end points docs

# 1 - Check live server
method : GET
url : http://localhost:3000/

header : none
Body : none

note : just to check if the server is up. returns "Test the server is live"

# 2 - Register
method : POST
url : http://localhost:3000/api/auth/register

header : Content-Type: application/json
Body :
{
  "username": "username",
  "email": "[EMAIL_ADDRESS]",
  "password": "Password123!",
  "phone": "01012345678"
}

note : password needs 1 uppercase, 1 lowercase, 1 number, 1 special char and min 8 chars.

# 3 - Verify OTP
method : POST
url : http://localhost:3000/api/auth/verifyOTP

header : Content-Type: application/json
Body :
{
  "email": "[EMAIL_ADDRESS]",
  "otp": "123456"
}

note : verify the code sent to your email to activate the account.

# 4 - Login
method : POST
url : http://localhost:3000/api/auth/login

header : Content-Type: application/json
Body :
{
  "email": "[EMAIL_ADDRESS]",
  "password": "Password123!"
}

note : returns accessToken. also sets refreshToken in cookies.

# 5 - Refresh Token
method : POST
url : http://localhost:3000/api/auth/refresh

header : none (but MUST include the `refreshToken` cookie sent automatically by the browser)
Body : none

note : This endpoint is used to get a new access token when the current one expires. It reads the `refreshToken` from the `httpOnly` cookie set during login, verifies it, and returns a new `accessToken` (while also rotating the refresh cookie).

# 6 - Check Auth Health
method : GET
url : http://localhost:3000/api/auth/checkAuthHealth

header : Authorization: Bearer <token>
Body : none

note : check if you are logged in correctly.

# 7 - Get Profile
method : GET
url : http://localhost:3000/api/auth/profile

header : Authorization: Bearer <token>
Body : none

note : gets user profile data.

# 8 - Update Profile
method : PUT
url : http://localhost:3000/api/auth/profile

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "username": "username",
  "phone": "01012345678"
}

note : update user username or phone. you must send at least one field.

# 9 - Change Password
method : PUT
url : http://localhost:3000/api/auth/change-password

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}

note : changes password. new password must be different.

# 10 - Forgot Password
method : POST
url : http://localhost:3000/api/auth/forgotPassword

header : Content-Type: application/json
Body :
{
  "email": "[EMAIL_ADDRESS]"
}

note : sends reset password otp code to email.

# 11 - Reset Password
method : POST
url : http://localhost:3000/api/auth/resetPassword

header : Content-Type: application/json
Body :
{
  "email": "[EMAIL_ADDRESS]",
  "otp": "123456",
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}

note : resets the password if otp is correct and passwords match.

# 12 - Logout
method : POST
url : http://localhost:3000/api/auth/logout

header : none
Body : none

note : clears refresh token cookie.

# 13 - Get All Products
method : GET
url : http://localhost:3000/api/products

header : none
Body : none

note : gets all products from database.

# 14 - Get Product by ID
method : GET
url : http://localhost:3000/api/products/[PRODUCT_ID]

header : none
Body : none

note : gets a single product's details using its ID.

# 15 - Create Product
method : POST
url : http://localhost:3000/api/products

header : Authorization: Bearer <token>, Content-Type: multipart/form-data
Body :
form-data:
- name: "T-Shirt"
- shortDescription: "a nice cotton shirt"
- description: "more details about this shirt..."
- price: 150
- stock: 50
- category: "fashion"
- images: [select files to upload]

note : creates a new product. requires login. you can upload up to 5 images.

# 16 - Update Product
method : PUT
url : http://localhost:3000/api/products/[PRODUCT_ID]

header : Authorization: Bearer <token>, Content-Type: multipart/form-data
Body :
form-data:
- name: "Updated T-Shirt name"
- price: 175
- stock: 40

note : updates a product using its ID. requires login. you can send only the fields you want to change.

# 17 - Delete Product
method : DELETE
url : http://localhost:3000/api/products/[PRODUCT_ID]

header : Authorization: Bearer <token>
Body : none

note : deletes a product. requires login.

# 18 - Get Cart
method : GET
url : http://localhost:3000/api/carts

header : Authorization: Bearer <token>
Body : none

note : gets the current user's cart with all items and total price.

# 19 - Add Item to Cart
method : POST
url : http://localhost:3000/api/carts/items

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "productId": "[PRODUCT_ID]",
  "quantity": 2
}

note : adds a product to the cart. quantity is optional, defaults to 1.

# 20 - Update Item Quantity
method : PATCH
url : http://localhost:3000/api/carts/items

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "productId": "[PRODUCT_ID]",
  "quantity": 5
}

note : updates the quantity of an existing item in the cart.

# 21 - Remove Item from Cart
method : DELETE
url : http://localhost:3000/api/carts/items/[PRODUCT_ID]

header : Authorization: Bearer <token>
Body : none

note : removes a single item from the cart using its product ID.

# 22 - Apply Coupon
method : POST
url : http://localhost:3000/api/carts/coupon

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "code": "SAVE10"
}

note : applies a coupon code to the cart.

# 23 - Remove Coupon
method : DELETE
url : http://localhost:3000/api/carts/coupon

header : Authorization: Bearer <token>
Body : none

note : removes the applied coupon from the cart.

# 24 - Clear Cart
method : DELETE
url : http://localhost:3000/api/carts/clear

header : Authorization: Bearer <token>
Body : none

note : removes all items from the cart.

---------------------------------------------------
# WISHLIST ENDPOINTS
---------------------------------------------------

# 25 - Get Wishlist
method : GET
url : http://localhost:3000/api/wishlist

header : Authorization: Bearer <token>
Body : none

note : returns all saved products in the user's wishlist.

# 26 - Add Product to Wishlist
method : POST
url : http://localhost:3000/api/wishlist

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "productId": "[PRODUCT_ID]"
}

note : saves a product to the wishlist. if it is already there it will not be added twice.

# 27 - Remove Product from Wishlist
method : DELETE
url : http://localhost:3000/api/wishlist/[PRODUCT_ID]

header : Authorization: Bearer <token>
Body : none

note : removes a single product from the wishlist using its product ID.

# 28 - Clear Wishlist
method : DELETE
url : http://localhost:3000/api/wishlist

header : Authorization: Bearer <token>
Body : none

note : removes all products from the wishlist.

---------------------------------------------------
# COUPON ENDPOINTS  (admin only)
---------------------------------------------------

# 29 - Create Coupon
method : POST
url : http://localhost:3000/api/coupons

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "code": "SAVE10",
  "discountType": "percentage",
  "discountValue": 10,
  "minOrderAmount": 100,
  "expiresAt": "2027-12-31T00:00:00.000Z",
  "isActive": true
}

note : creates a new coupon. discountType is "percentage" or "fixed". requires admin role.

# 30 - Get All Coupons
method : GET
url : http://localhost:3000/api/coupons

header : Authorization: Bearer <token>
Body : none

note : returns all coupons. requires admin role.

# 31 - Get Coupon by ID
method : GET
url : http://localhost:3000/api/coupons/[COUPON_ID]

header : Authorization: Bearer <token>
Body : none

note : returns a single coupon by its ID. requires admin role.

# 32 - Update Coupon
method : PATCH
url : http://localhost:3000/api/coupons/[COUPON_ID]

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "discountValue": 20,
  "isActive": false
}

note : updates any field of a coupon. send only the fields you want to change. requires admin role.

# 33 - Delete Coupon
method : DELETE
url : http://localhost:3000/api/coupons/[COUPON_ID]

header : Authorization: Bearer <token>
Body : none

note : permanently deletes a coupon. requires admin role.

---------------------------------------------------
# ORDER ENDPOINTS
---------------------------------------------------

# 34 - Place Order
method : POST
url : http://localhost:3000/api/orders

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "01012345678",
    "country": "Egypt",
    "city": "Cairo",
    "address": "123 Tahrir Street",
    "postalCode": "11511"
  },
  "paymentMethod": "cash",
  "customerNote": "Please call before delivery"
}

note : places a new order from the items currently in the user's cart. paymentMethod options are: cash, stripe, paypal, paymob. cart must not be empty. stock is checked and reduced automatically.

# 35 - Get My Orders
method : GET
url : http://localhost:3000/api/orders

header : Authorization: Bearer <token>
Body : none

note : returns all orders placed by the logged-in user, sorted from newest to oldest.

# 36 - Pay Order with Cash
method : POST
url : http://localhost:3000/api/orders/[ORDER_ID]/pay/cash

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "orderId": "[ORDER_ID]"
}

note : marks a cash order as paid and confirms it. only works if the order paymentMethod is "cash" and it has not been paid yet.

# 37 - Pay Order with Stripe (Create Checkout Session)
method : POST
url : http://localhost:3000/api/orders/[ORDER_ID]/pay/stripe/checkout

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "orderId": "[ORDER_ID]",
  "successUrl": "http://localhost:3000/success", // optional
  "cancelUrl": "http://localhost:3000/cancel" // optional
}

note : Creates a Stripe checkout session for an order with paymentMethod "stripe". Returns the checkout session URL and ID. 

**Test Cases / Examples:**
- **Pre-requisite**: The order must have `paymentMethod: "stripe"` and `paymentStatus: "pending"`.
- **Request Example**: `POST /api/orders/6a5bb054142f69782ea317d1/pay/stripe/checkout`
- **Expected Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "Stripe checkout session created successfully.",
    "data": {
      "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
      "sessionId": "cs_test_...",
      "amount": 620,
      "currency": "egp"
    }
  }
  ```
- **Error Case (400)**: If `paymentMethod` is `"cash"`, it returns `"This order is not configured for Stripe payment."`.
- **Error Case (400)**: If already paid, it returns `"This order has already been paid."`.

# 38 - Verify Stripe Checkout Payment
method : POST
url : http://localhost:3000/api/orders/[ORDER_ID]/pay/stripe/verify

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "orderId": "[ORDER_ID]",
  "sessionId": "cs_test_..." // optional, uses order's transactionId if omitted
}

note : Verifies a Stripe checkout session after payment is completed.

**Test Cases / Examples:**
- **Request Example**: `POST /api/orders/6a5bb054142f69782ea317d1/pay/stripe/verify`
- **Expected Success Response (200)** (Only works after user actually pays via the `checkoutUrl`):
  ```json
  {
    "success": true,
    "message": "Stripe checkout payment verified successfully.",
    "data": {
      "paymentStatus": "paid",
      "checkoutSessionStatus": "complete"
    }
  }
  ```
- **Expected Unpaid Response (400)** (If tested before paying the checkout link):
  ```json
  {
    "success": false,
    "message": "Checkout has not been completed yet.",
    "checkoutSessionStatus": "open",
    "checkoutPaymentStatus": "unpaid"
  }
  ```

# 39 - Stripe Webhook
method : POST
url : http://localhost:3000/api/webhooks/stripe

header : Stripe-Signature: <signature>, Content-Type: application/json (raw body)
Body : Stripe Event Object

note : Webhook endpoint for handling async Stripe events (e.g., checkout.session.completed). 

**Test Cases / Examples:**
- **How to test locally**: Install Stripe CLI and run:
  `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Once running, whenever a payment is made successfully via the checkout session, Stripe will automatically send a `checkout.session.completed` event to this endpoint, which marks the database order as paid.

# 40 - Get All Products (with Search, Filter, Pagination, Sort)
method : GET
url : http://localhost:3000/api/products?page=1&limit=10&search=Apple&price[gte]=500&sort=-price

header : none
Body : none

note : 
- `page` and `limit` are used for pagination (e.g. `page=1&limit=10`).
- `search` is used to search the product name (e.g. `search=Apple`).
- Filters can be applied to fields like price (e.g. `price[gte]=500` for price >= 500). Supported operators: `gte`, `gt`, `lte`, `lt`.
- `sort` sorts the results (e.g. `sort=-price` sorts by price descending, `sort=price` sorts by price ascending).
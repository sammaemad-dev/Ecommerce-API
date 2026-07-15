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

# 5 - Check Auth Health
method : GET
url : http://localhost:3000/api/auth/checkAuthHealth

header : Authorization: Bearer <token>
Body : none

note : check if you are logged in correctly.

# 6 - Get Profile
method : GET
url : http://localhost:3000/api/auth/profile

header : Authorization: Bearer <token>
Body : none

note : gets user profile data.

# 7 - Update Profile
method : PUT
url : http://localhost:3000/api/auth/profile

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "username": "username",
  "phone": "01012345678"
}

note : update user username or phone. you must send at least one field.

# 8 - Change Password
method : PUT
url : http://localhost:3000/api/auth/change-password

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}

note : changes password. new password must be different.

# 9 - Forgot Password
method : POST
url : http://localhost:3000/api/auth/forgotPassword

header : Content-Type: application/json
Body :
{
  "email": "[EMAIL_ADDRESS]"
}

note : sends reset password otp code to email.

# 10 - Reset Password
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

# 11 - Logout
method : POST
url : http://localhost:3000/api/auth/logout

header : none
Body : none

note : clears refresh token cookie.

# 12 - Get All Products
method : GET
url : http://localhost:3000/api/products

header : none
Body : none

note : gets all products from database.

# 13 - Get Product by ID
method : GET
url : http://localhost:3000/api/products/[PRODUCT_ID]

header : none
Body : none

note : gets a single product's details using its ID.

# 14 - Create Product
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

# 15 - Update Product
method : PUT
url : http://localhost:3000/api/products/[PRODUCT_ID]

header : Authorization: Bearer <token>, Content-Type: multipart/form-data
Body :
form-data:
- name: "Updated T-Shirt name"
- price: 175
- stock: 40

note : updates a product using its ID. requires login. you can send only the fields you want to change.

# 16 - Delete Product
method : DELETE
url : http://localhost:3000/api/products/[PRODUCT_ID]

header : Authorization: Bearer <token>
Body : none

note : deletes a product. requires login.

# 17 - Get Cart
method : GET
url : http://localhost:3000/api/carts

header : Authorization: Bearer <token>
Body : none

note : gets the current user's cart with all items and total price.

# 18 - Add Item to Cart
method : POST
url : http://localhost:3000/api/carts/items

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "productId": "[PRODUCT_ID]",
  "quantity": 2
}

note : adds a product to the cart. quantity is optional, defaults to 1.

# 19 - Update Item Quantity
method : PATCH
url : http://localhost:3000/api/carts/items

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "productId": "[PRODUCT_ID]",
  "quantity": 5
}

note : updates the quantity of an existing item in the cart.

# 20 - Remove Item from Cart
method : DELETE
url : http://localhost:3000/api/carts/items/[PRODUCT_ID]

header : Authorization: Bearer <token>
Body : none

note : removes a single item from the cart using its product ID.

# 21 - Apply Coupon
method : POST
url : http://localhost:3000/api/carts/coupon

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "code": "SAVE10"
}

note : applies a coupon code to the cart.

# 22 - Remove Coupon
method : DELETE
url : http://localhost:3000/api/carts/coupon

header : Authorization: Bearer <token>
Body : none

note : removes the applied coupon from the cart.

# 23 - Clear Cart
method : DELETE
url : http://localhost:3000/api/carts/clear

header : Authorization: Bearer <token>
Body : none

note : removes all items from the cart.

---------------------------------------------------
# WISHLIST ENDPOINTS
---------------------------------------------------

# 24 - Get Wishlist
method : GET
url : http://localhost:3000/api/wishlist

header : Authorization: Bearer <token>
Body : none

note : returns all saved products in the user's wishlist.

# 25 - Add Product to Wishlist
method : POST
url : http://localhost:3000/api/wishlist

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "productId": "[PRODUCT_ID]"
}

note : saves a product to the wishlist. if it is already there it will not be added twice.

# 26 - Remove Product from Wishlist
method : DELETE
url : http://localhost:3000/api/wishlist/[PRODUCT_ID]

header : Authorization: Bearer <token>
Body : none

note : removes a single product from the wishlist using its product ID.

# 27 - Clear Wishlist
method : DELETE
url : http://localhost:3000/api/wishlist

header : Authorization: Bearer <token>
Body : none

note : removes all products from the wishlist.

---------------------------------------------------
# COUPON ENDPOINTS  (admin only)
---------------------------------------------------

# 28 - Create Coupon
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

# 29 - Get All Coupons
method : GET
url : http://localhost:3000/api/coupons

header : Authorization: Bearer <token>
Body : none

note : returns all coupons. requires admin role.

# 30 - Get Coupon by ID
method : GET
url : http://localhost:3000/api/coupons/[COUPON_ID]

header : Authorization: Bearer <token>
Body : none

note : returns a single coupon by its ID. requires admin role.

# 31 - Update Coupon
method : PATCH
url : http://localhost:3000/api/coupons/[COUPON_ID]

header : Authorization: Bearer <token>, Content-Type: application/json
Body :
{
  "discountValue": 20,
  "isActive": false
}

note : updates any field of a coupon. send only the fields you want to change. requires admin role.

# 32 - Delete Coupon
method : DELETE
url : http://localhost:3000/api/coupons/[COUPON_ID]

header : Authorization: Bearer <token>
Body : none

note : permanently deletes a coupon. requires admin role.
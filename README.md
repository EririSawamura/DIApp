# DIApp
use localhost:3000/login to start


Need express js, node js, vue.js


To start app, use 
"npm start"
"npm install bcrypt"
"npm install express-recaptcha --save"
"npm install --save qrcode"

In Mysql, you need to set
SET @@session.block_encryption_mode="aes-128-cbc";
SET @init_vector= RANDOM_BYTES(16);

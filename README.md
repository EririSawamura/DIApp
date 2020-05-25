# DIApp
DIApp is a digital identity management website. Through the website, users can store unlimited username/password key pairs for different websites or systems. For some important key pairs, users can also choose to set an encryption password to encrypt the key pairs.

# App feature
●	Register/Login
To get started with DIApp, the first thing is to register an account. Username is unique. The login page supports Google reCAPTCHA which protects the website from spam and abuse. After logging in, the users will be redirected to the main page, where users can retrieve all the key pairs they have stored.

●	Create, update, and delete key pairs
In DIApp, users can create, update, and delete key pairs as they like. When creating a new key pair, users should choose to set the key pair private or not. To set the key pairs private, users need to provide a private key to encrypt the password content. If a key pair is not set as private, when users click this key pair on the main page, all the information about this key pair will be presented in plain text on the view page. If a key pair is private, when users click this key pair on the main page, the encrypted password will be presented on the view page, and users are required to input the corresponding private key to decrypt the content.

●	Search key pairs
All stored key pairs are shown on the main page, listed in the order of the last modified time. Users can search for a particular key pair by keywords.

●	The individual private key for key pairs 
The private key is different from the login password. It is set by the users but if using the symmetric encryption, it won’t be stored in the database. Different key pairs can have a different private key. The private key can be a string or QR code. If the private key is a string, users can input the password string for verification or decryption. If the private key is a QR code, users can upload QR code or use a scanner to scan QR code for verification and use the scanner to scan QR code for decryption.

# Security requirement
●	Dictionary attack prevention
DIApp uses Google reCAPTCHA to prevent a dictionary attack. Google reCAPTCHA is a free service that protects DIApp from spam and abuse. reCAPTCHA uses an advanced risk analysis engine and adaptive challenges to keep automated software from engaging in abusive activities on the website (reCAPTCHA, 2020). Google reCAPTCHA helps validate the user’s login conveniently and securely. In this way, attackers cannot use long-time attempts or offline attacks to attack the database.

●	AES-128-CBC encryption
One of the reasons to choose MySQL database is that it supports AES-128-CBC encryption. AES-128-CBC is an encryption algorithm that remains the most common mode in general use. With AES-128-CBC encryption, it is hard for attackers to do the password guessing. Also, we will not store the decryption password in the database, which makes the attacker harder to perform an attack.

●	SQL injection prevention
To prevent SQL injection, one way is to tweak the code so any user input is automatically escaped before executed. With MySQL and express.js, DIApp can specify which user inputs get escaped within the query() method itself. The specific method is named placeholders. Named placeholders map values in the array to placeholders in the same order as they are passed. The attribute names inside the object become the placeholders in the SQL query.

# Application installation guide
DIApp requires express js, node js, vue.js. They need to be installed before the start.

●	express.js: https://expressjs.com/en/starter/installing.html

●	node.js: https://nodejs.org/en/download/

●	Vue.js: https://vuejs.org/v2/guide/installation.html

Also, some modules are needed to install. They can be installed in the terminal.
●	{project_folder}> npm install bcrypt

●	{project_folder}> npm install express-recaptcha --save

●	{project_folder}> npm install --save qrcode

●	{project_folder}> npm install node-pre-gyp

DIApp uses the MySQL database. To create the database, developers need to execute a config.sql file inside the folder.

Moreover, developers need to apply their MySQL connection configuration to the express.js code inside the {project_folder}/routes/users.js and {project_folder}/routes/index.js. Developers need to change the MySQL connection configuration to their setup. The default connection configuration is shown here.

After all configuration, Users need to type localhost:3000/login to go to the login page.

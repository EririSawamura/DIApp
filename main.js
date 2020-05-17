var QRCode = require('qrcode');
var canvas = document.getElementById('canvas');
var str = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
var pwd = document.getElementById('qr_password');

pwd.innerHTML = str;
canvas.style.width = 100;
canvas.style.height = 100;

QRCode.toCanvas(canvas, str, function (error) {
  if (error) console.error(error);
  console.log('success!');
})
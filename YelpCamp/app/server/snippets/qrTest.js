const QRCode = require('qrcode');

QRCode.toString('I am a pony!', { errorCorrectionLevel: 'H' }, function (err, url) {
  console.log(url)
})

QRCode.toDataURL('some text', { errorCorrectionLevel: 'H' }, function (err, url) {
    console.log(url);
});

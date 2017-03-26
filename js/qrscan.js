var QRScanner = {};

QRScanner.canvas = document.createElement('canvas');
QRScanner.zbar = new Worker("js/zbar-processor.min.js");
QRScanner.image = null;
QRScanner.ctx = null;

/**
 * Initialise the QR Scanner
 *
 * @param pCallback Function to callback after scanning image
 */
QRScanner.init = function (pCallback) {

    QRScanner.image = new Image();

    // When an image is loaded, begin a scan
    QRScanner.image.onload = function () {

        // Resize image
        var Ratio = (640 + 480) / (QRScanner.image.width + QRScanner.image.height);
        QRScanner.canvas.width = Math.ceil(QRScanner.image.width * Ratio);
        QRScanner.canvas.height = Math.ceil(QRScanner.image.height * Ratio);

        // Draw to the canvas
        var ctx = QRScanner.canvas.getContext('2d');
        ctx.drawImage(QRScanner.image, 0, 0, QRScanner.image.width, QRScanner.image.height, 0, 0, QRScanner.canvas.width, QRScanner.canvas.height);

        var ImageData = ctx.getImageData(0, 0, QRScanner.canvas.width, QRScanner.canvas.height);
        if (ImageData.data)
            QRScanner.zbar.postMessage(ImageData);
    };

    // Completion of scan
    QRScanner.zbar.onmessage = function (pEvent) {

        if (pEvent.data.length > 0) {
            var Data = pEvent.data[0][2];

            pCallback(true, Data);
        } else {
            pCallback(false, "");
        }
    };

};

/**
 * Start the scan of an image
 *
 * @param pImageData
 */
QRScanner.scan = function (pImageData) {

    QRScanner.image.src = pImageData;
};

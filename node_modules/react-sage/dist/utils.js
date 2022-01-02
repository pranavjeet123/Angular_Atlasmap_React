"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.resizeImage = exports.areImageDimsValid = exports.loadImage = exports.loadFile = void 0;
/**
 * Wraps native File Reader API in a promise.
 */
var loadFile = function (file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            // convert image file to base64 string
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            }
        }, false);
        reader.addEventListener('error', function () {
            reject(new Error('There was an error uploading the file'));
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    });
};
exports.loadFile = loadFile;
/**
 * Wraps native image loader API in a promise.
 */
var loadImage = function (dataUrl) {
    return new Promise(function (resolve, reject) {
        // create a new html image element
        var img = new Image();
        // set the image src attribute to our dataUrl
        img.src = dataUrl;
        // listen for onload event
        img.addEventListener('load', function () { return resolve(img); }, false);
        img.addEventListener('error', function (ev) {
            reject("Error loading image: " + ev);
        });
    });
};
exports.loadImage = loadImage;
var areImageDimsValid = function (image, dims) {
    if (dims) {
        if (dims.minImageHeight && image.height < dims.minImageHeight) {
            return false;
        }
        if (dims.minImageWidth && image.width < dims.minImageWidth) {
            return false;
        }
        if (dims.maxImageHeight && image.height > dims.maxImageHeight) {
            return false;
        }
        if (dims.maxImageWidth && image.width > dims.maxImageWidth) {
            return false;
        }
    }
    return true;
};
exports.areImageDimsValid = areImageDimsValid;
var resizeImage = function (img, maxSize, mime, quality) {
    if (quality === void 0) { quality = 0.92; }
    return new Promise(function (resolve, reject) {
        var width = img.width, height = img.height;
        var maxDimension = Math.max(width, height);
        if (maxDimension > maxSize) {
            var scale = maxSize / maxDimension;
            width = scale * img.width;
            height = scale * img.height;
        }
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        var blobCallback = function (blob) {
            if (blob) {
                resolve(blob);
            }
            else {
                reject('Could not resize. Blob not available.');
            }
        };
        if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            ctx.canvas.toBlob(blobCallback, mime, quality);
        }
        else {
            reject('Could not reize. Canvas context not available.');
        }
    });
};
exports.resizeImage = resizeImage;
var sleep = function (milliseconds) {
    return new Promise(function (resolve) {
        window.setTimeout(resolve, milliseconds);
    });
};
exports.sleep = sleep;

'use strict';

const { Socket } = require('net');
const RSA = require('node-rsa');

class HESInterface {
    constructor(host, port) {
        this._client = new Socket();
        this._client.on('data', this._handlePublicKey.bind(this));
        this._client.connect(port, host);

        this._serverPublicKey = new RSA();
        this._myKey = new RSA();
        this._myKey.generateKeyPair();
    }

    _handlePublicKey(data) {
        this._serverPublicKey.importKey(data, 'pkcs1-public');
        this._client.write(this._myKey.exportKey('pkcs1-public'));

        this._client.on('data', this._handleResponse.bind(this));
    }

    _handleResponse(data) {

    }
}

module.exports = HESInterface;

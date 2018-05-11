'use strict';

const { Socket } = require('net');
const RSA = require('node-rsa');
const { EventEmitter } = require('events');

class HESInterface extends EventEmitter {
    get ready() {
        return this._ready;
    }

    constructor(host, port) {
        super();

        this._client = new Socket();
        this._client.on('data', this._handlePublicKey.bind(this));
        this._client.connect(port, host);

        this._serverPublicKey = new RSA();
        this._myKey = new RSA();
        this._myKey.generateKeyPair();

        this._ready = false;
    }

    request(action, value) {
        const requestObj = {
            action,
            value
        };

        const data = this._serverPublicKey.encrypt(JSON.stringify(requestObj));
        console.log(data);
        this._client.write(data);
    }

    _handlePublicKey(data) {
        this._serverPublicKey.importKey(data, 'pkcs1-public');
        this._client.write(this._myKey.exportKey('pkcs1-public'));

        this._client.on('data', this._handleResponse.bind(this));

        this._ready = true;
        this.emit('ready');
    }

    _handleResponse(data) {

    }
}

module.exports = HESInterface;

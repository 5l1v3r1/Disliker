'use strict';

const { createServer } = require('net');
const { EventEmitter } = require('events');
const RSA = require('node-rsa');

class Service extends EventEmitter {
    constructor(host, port) {
        super();

        this._host = host;
        this._port = port;

        this._clientKey = new RSA();
        this._key = new RSA();
        this._key.generateKeyPair();

        this._socket = null;
        this._server = createServer(socket => {
            console.info('Connected!');

            if (this._socket === null) {
                socket.write(this._key.exportKey('pkcs1-public'));
                socket.on('data', this._handlePublicKey.bind(this, socket));
                socket.on('error', (error) => {
                    console.error(error);
                });
                socket.on('end', () => {
                    this._socket = null;
                });
            }
        });
    }

    start() {
        this._server.listen(this._port, this._host);
    }

    _handlePublicKey(data) {
        this._clientKey.importKey(data, 'pkcs1-public');
    }

    _handleRequest(data) {
        console.log(data.toString());
    }
}

module.exports = Service;

/* eslint-disable */
'use strict';

const app = new Vue({
    el: '#app',
    data: {
        login: '',
        password: '',
        videoId: '',
        channelId: '',
        action: 0,
        tasks: window.tasks.slice(0, 5)
    },
    mounted: function() {
        setInterval(() => this.refresh(), 5 * 1000);
    },
    methods: {
        donate: function() {
            fetch('/api/donate', makeHeader('POST', {
                login: this.login,
                password: this.password
            })).then(async (resp) => {
                this.tasks.unshift(await resp.json());
            });

            this.login = '';
            this.password = '';
        },
        likeOrDis: function() {
            fetch('/api/task', makeHeader('POST', {
                data: { videoId: this.videoId },
                action: this.action
            })).then(async (resp) => {
                this.tasks.unshift(await resp.json());
            });
            this.videoId = '';
        },
        subscribe: function() {
            fetch('/api/task', makeHeader('POST', {
                data: { channelId: this.channelId },
                action: 3
            })).then(async (resp) => {
                this.tasks.unshift(await resp.json());
            });
            this.channelId = '';
        },
        refresh: function() {
            fetch('/api/task', makeHeader('GET'))
                .then(async (resp) => {
                    this.tasks = (await resp.json()).slice(0, 5);
                })
        }
    }
});

function makeHeader(method, formData) {
    return {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(formData)
    };
}

const express = require('express');
const { Worker } = require('worker_threads');

const app = express();

app.get('/', (req, res) => {
    res.send('I am alive!');
});

function run() {
    app.listen(8080, '0.0.0.0', () => {
        console.log('Server running on port 8080');
    });
}

function keep_alive() {
    const worker = new Worker(`
        const { parentPort } = require('worker_threads');
        const express = require('express');
        const app = express();
        app.get('/', (req, res) => res.send('I am alive!'));
        app.listen(8080, '0.0.0.0', () => {
            parentPort.postMessage('Server started');
        });
    `, { eval: true });
    worker.on('message', msg => console.log(msg));
}

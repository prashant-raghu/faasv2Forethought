const { Kafka } = require('kafkajs')
const { v4: uuidv4 } = require('uuid');
const kafka = new Kafka({
    clientId: 'my-app-client',
    brokers: ['0.0.0.0:9092'],
})
var express = require('express');
var app = express();

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'faasTrialv1' });
const EventEmitter = require('events');

class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();

app.get('/', async function (req, res) {
    //send an event to a topic, consume that, and respond that as the res of this api
    let id = uuidv4();
    let toSend = {
        id,
        message: "Sent to recieve"
    }
    myEmitter.on('event', (message) => {
        if (message.value) {
            let msg = message.value.toString();
            msg = JSON.parse(msg);
            if (msg && msg.id == id) {
                console.log(msg);
                res.status(200).send(msg);
            }
        }
        console.log('an event occurred!');
    });
    await producer.send({
        topic: 'faasTrialv1',
        messages: [
            { value: JSON.stringify(toSend) },
        ],
    })
});

app.listen(3000, async function () {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: 'faasTrialv1' });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            myEmitter.emit('event', message);
        }
    })
    console.log('nodeKafkaJsRest listening on port 3000!');
});
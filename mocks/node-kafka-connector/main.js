const { Kafka } = require('kafkajs')
const kafka = new Kafka({
    clientId: 'my-app-client',
    brokers: ['0.0.0.0:9092'],
})
const admin = kafka.admin()

const producer = kafka.producer()

async function main() {
    await producer.connect()
    const consumer = kafka.consumer({ groupId: 'my-group' })
    await consumer.connect()
    await consumer.subscribe({ topic: 'faasTrialv1' })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value)
                console.log(message.value.toString()
                    //     {
                    //     key: message.key.toString(),
                    //     value: message.value.toString(),
                    //     headers: message.headers,
                    // }
                )
        },
    })
    setInterval(async () => {
        console.log("sending")
        await producer.send({
            topic: 'faasTrialv1',
            messages: [
                { value: 'Hello KafkaJS user!' },
            ],
        })
    }, 3000)
    console.log("about to disconnect")
    // await producer.disconnect()
    // return 1;
}
main()
    .then(r => {

    })
    .catch(err => console.log)
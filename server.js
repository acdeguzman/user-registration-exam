const app = require('./app');
const { client } = require('./redis');

const port = process.env.PORT || 3000;

// connect to redis client
client
    .connect()
    .then(() => {
        console.log('Successfully connected to redis server')
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
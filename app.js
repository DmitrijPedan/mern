const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const app = express();

const PORT = config.get('port') || 5000;

// app.use(express.bodyParser())

app.use('/api/auth', require('./routes/auth.routes'));

async function start () {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`));
    } catch (e) {
        console.log('server error: ', e);
        process.exit(1);
    }
}

start();


require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');

const port = process.env.PORT;
app.set('port', port);
app.use(cors());
app.use(express.json());
app.use((request, response, next) => {
    console.log(`${request.method} ${request.url}`);
    next();
});
app.use('/api/v1', routes);
app.listen(app.get('port'), () => {
    console.log(`-- Server listens on port ${app.get('port')}`);
});

const m = require('./language/en')
const express = require('express')
require('dotenv').config();
const app_routing = require('./modules/app_routing');

const app = express();


app.use(express.json());

app_routing.v1(app);


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log("Server running on port :", port);
});
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const pool = require('./database/db_connect');
const itemRouter = require('./routers/item_router');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// List api : Comment out this before release
app.get("/", async (req, res) => {
    const listApi = `
    1. <a href="/item/get_items">/item/get_items </a> : POST get all items <br>
    `;

    res.send(listApi);
});
//
app.use('/item', itemRouter);

//////////////////tet web 3
const metamask = require('./metamask/metamask');
app.get("/mm", async (req, res) => {

    const votelog = await metamask.vote_item(2);
    res.send("test smart contract: " + (JSON.stringify(votelog)));
});




const PORT = process.env.PORT ||5000;

app.listen(PORT, (err) => {
    console.log("Listening at: " + PORT);
});


const express= require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const keys = require("keys")

const  { Configuration, PlaidApi, PlaidEnvironments } =  require('plaid');

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': keys.PLAID_CLIENT_ID,
            'PLAID-SECRET': keys.PLAID_SECRET,
        },
    },
});

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get("/hello", (req, res) => {
    res.json({message: "sever has started"})
})

app.post("/echo", (req, res) => {
    const name = req.body.name
    res.json({name: name})
})

app.listen(8000, () => {
    console.log("server has started on 8000")
})
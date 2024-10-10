const express= require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
// const keys = require("keys")

const  { Configuration, PlaidApi, PlaidEnvironments } =  require('plaid');

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': '6707aa4eecfe30001a6edc5d',
            'PLAID-SECRET': 'af624199c70ae5fd9dd1fc033e4ba5'
        },
    },
});

const plaidClient = new PlaidApi(configuration);



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


app.post('/create_link_token', async function (request, response) {
    // Get the client_user_id by searching for the current user
    // const user = await User.find(...);
    // const clientUserId = user.id;
    const plaidRequest = {
        user: {
            // This should correspond to a unique id for the current user.
            client_user_id: "user",
        },
        client_name: 'Plaid Test App',
        products: ['auth'],
        language: 'en',
        redirect_uri: 'http://localhost:3000/',
        country_codes: ['US'],
    };
    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        response.json(createTokenResponse.data);
    } catch (error) {
        // handle error
        console.error(error)
        response.status(500).json({})
    }
});

app.post('/exchange_public_token', async function (
    request,
    response,
    next,
) {
    const publicToken = request.body.public_token;
    console.log("publicToken: ",publicToken)
    try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        // These values should be saved to a persistent database and
        // associated with the currently signed-in user
        const accessToken = plaidResponse.data.access_token;
        const itemID = plaidResponse.data.item_id;

        console.log("response: ", response )
        response.json({ accessToken: accessToken });
    } catch (error) {
        // handle error
        response.status(500).json("failed")
    }
});

app.post('/authenticate', async function (request, response) {
    try {
        const accessToken = request.body.access_token;
        console.log("access token: " ,accessToken)
        const plaidRequestBody = {
            access_token: accessToken,
        }
        const plaidResponse = await plaidClient.authGet(plaidRequestBody)
        response.json(plaidResponse.data);
    } catch (error) {
        // console.error(error)
        response.status(500).json("failed")
    }
})

app.listen(8000, () => {
    console.log("server has started on 8000")
})
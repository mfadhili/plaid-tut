import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from "axios";
import { usePlaidLink } from 'react-plaid-link';
// import './App.css'

axios.defaults.baseURL="http://localhost:8000"


function PlaidAuth({publicToken}) {
    const [account, setAccount] = useState()

    useEffect(() => {
        async function fetch() {
            let access_token = await axios.post("/exchange_public_token",{
                public_token: publicToken,
            });
            console.log("access Token: ",access_token.data)

            const auth = await axios.post("/authenticate", {access_token: access_token.data.accessToken});
            console.log("auth data ", auth.data)
            setAccount(auth.data.numbers.ach[0])
        }

        fetch();
    }, []);

    return account && (
        <div>
                <p>
                    Account Number: {account.account}
                </p>
                <p>
                    Account routing number: {account.routing}
                </p>
        </div>
    )

    ;
}

function App() {
    const [linkToken, setLinkToken] = useState('')
    const [publicToken, setPublicToken] = useState()

    useEffect(
      () => {
        async function fetch() {
          const resp = await axios.post("/create_link_token");
          setLinkToken(resp.data.link_token)
            console.log("response: ", resp.data)
        }

        fetch()
      }, []
    );



    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            // send public_token to server
            setPublicToken(public_token)
            console.log("success : ", public_token, metadata)
        },
    });


  return publicToken ?
      (
          <PlaidAuth publicToken={publicToken}></PlaidAuth>
      ):
      (
          <div>
              Client Page
              <button onClick={() => open()} disabled={!ready}>
                  Connect a bank account
              </button>
          </div>
      )

}

export default App

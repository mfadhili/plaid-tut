import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from "axios";
// import './App.css'

axios.defaults.baseURL="http://localhost:8000"
function App() {

  useEffect(
      () => {
        async function fetch() {
          const resp = await axios.post("/echo", {name: "mfadhili"});
            console.log("response: ", resp.data)
        }

        fetch()
      }, []
  );


  return (
    <div> Client Page</div>
  )
}

export default App



import {useEffect, useState} from 'react'
import Web3 from "web3"
import 'bootstrap/dist/css/bootstrap.min.css';

const nodeEndpoint = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getMessage",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newMessage",
        "type": "string"
      }
    ],
    "name": "setMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress = '0x53dC100B2d9E0EBc6B90c6Ad6A3AE956338D7b8a'

function App() {

 // estados locales
  const [message, setMessage] = useState("")
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)
  const [transactionHash, setTransactionHash] = useState(null)
  const [recibo, setRecibo] = useState([])
  const [alert, setAlert] = useState(false)
   console.log(recibo)

// conexion con el contrato, se llama a instacia del contrato y accedemos a sus metodos
// GET
  function getMessageFrom(){
    const web3 = new Web3(nodeEndpoint)
    const helloWorld = new web3.eth.Contract(abi, contractAddress);
    helloWorld.methods.getMessage().call()
      .then(m => setMessage(m) )      
  }

  function handleChange(e){
    setValue(e.target.value)
  }
  //SET
  function setTheMessage(){
    setValue('')
    setSending(true)
    setTransactionHash(null)

    window.ethereum.enable()
    .then(accounts => {
      const web3 = new Web3(window.ethereum);
      const helloWorld = new web3.eth.Contract(abi, contractAddress);
      helloWorld.methods.setMessage(value).send({from: accounts[0]})
      .on('transactionHash', transactionHash => setTransactionHash(transactionHash))
      .on('receipt', (rec) => {
        setSending(false);
        setRecibo([...recibo, rec])
        setAlert(true)
      })   
    })
    
  }

  function handleAlert(){
    setAlert(false)
  }
  
  return (
    <div style={{padding: 80}}>
      <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
        <span class="navbar-brand mb-0 h1 ">Angeles´ DAPP</span>
        </div>
      </nav>

      <hr />

      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Last Message sent:</h5>
          <p class="card-text">{message}</p>
          <button type="button" class="btn btn-primary btn-sm" onClick={getMessageFrom}>get message</button>
        </div>
      </div>
      
      <hr />

      <div class="card">
        <div class="card-header">
          Mew messages
        </div>
        <div class="card-body">
          <h5 class="card-title">Write the message you want to send</h5>
          <input placeholder='message...' type="text" value={value} onChange={handleChange}/>
        { alert === true ?
          <p class="card-text">TransactionHash: {transactionHash}</p>
          :
          null

        }
    
          <button type="button" class="btn btn-primary btn-sm" onClick={setTheMessage} disabled={sending}>set message</button>  
        </div>
      </div>
{
  sending === true ?

  <div class="alert alert-danger" role="alert">
  Wait for the transaction to be confirmed.
  </div>
: 
null
}

{
alert === true ?
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Transaccion succesfully made!</strong> 
  <button onClick={handleAlert} type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>


:
null
}
<hr />

<table class="table">
  <thead>
    
    <tr>
    
      <th scope="col">From</th>
      <th scope="col">To</th>
      <th scope="col">Gas Used</th>
      <th scope="col">Block Number</th>
    </tr>
  </thead>

  { recibo?.map(e =>{
    return(
    <tbody>
    <tr>
      <td>{e.from}</td>
      <td>{e.to}</td>
      <td>{e.gasUsed}</td>
      <td>{e.blockNumber}</td>
    </tr>
  </tbody>
    )
  })
    
  }
</table>  

    </div> 



  );
}

export default App;

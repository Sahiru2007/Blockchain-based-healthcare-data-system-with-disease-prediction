const fs = require('fs');
const {Web3} = require('web3');



const abi = JSON.parse(fs.readFileSync("/Users/sahiru/Final Project/Healthcare Data management sytem/backend/contracts/Cruds.abi"));
const bytecode = fs.readFileSync("/Users/sahiru/Final Project/Healthcare Data management sytem/backend/contracts/Cruds.bin").toString();

const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"));

async function deploy() {
    // const w3 = new Web3(window.ethereum);
    let contract = new web3.eth.Contract(abi);
    contract = contract.deploy({data: bytecode});

    const deployContract = await contract.send({
        from: "0xf8328Eb18d6dCD7497655663C06f4f83ABA89CA8",
        gas: "6721975",
    })
    console.log(deployContract.options.address);
}

deploy();

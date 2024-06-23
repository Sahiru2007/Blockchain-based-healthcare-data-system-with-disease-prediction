const {Web3} = require('web3');
const solc = require('solc');
const fs = require('fs');

// Set up Web3
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

// Read the Solidity contract source file
const sourceCode = fs.readFileSync('/Users/sahiru/Final Project/Healthcare Data management sytem/backend/contracts/Cruds.sol').toString();

// Prepare the input for the Solidity compiler
const input = {
    language: 'Solidity',
    sources: {
        'Cruds.sol': {
            content: sourceCode,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Handle the output (errors, compiled code, etc.)
if (output.errors) {
    output.errors.forEach(err => {
        console.error(err.formattedMessage);
    });
    throw new Error('Compilation failed');
} else {
    // Assuming 'Cruds' is the contract name and 'Cruds.sol' is the filename
    const contractName = 'Cruds'; // Update this to your actual contract name
    const compiledContract = output.contracts['Cruds.sol'][contractName];

    // ABI and bytecode
    const abi = compiledContract.abi;
    const bytecode = compiledContract.evm.bytecode.object;

    // Deploy the contract
    let MyContract = new web3.eth.Contract(abi);
MyContract = MyContract.deploy({data: bytecode});


    const deployContract =  MyContract.send({
        from: "0xf8328Eb18d6dCD7497655663C06f4f83ABA89CA8",
        gas: "6721975",
    })
    
}

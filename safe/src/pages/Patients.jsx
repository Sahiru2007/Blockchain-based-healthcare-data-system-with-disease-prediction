import React, { useState, Fragment, useEffect, useRef } from "react";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import Sidebar2 from "../components/Sidebar2";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import { create } from 'ipfs-http-client'

const Patients = () => {
    const web3 = new Web3(window.ethereum);
    const mycontract = new web3.eth.Contract(
        contract["abi"],
        contract["address"]
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [accessiblePatients, setAccessiblePatients] = useState([]);
    const [cookies, setCookies] = useCookies();

    useEffect(() => {
        async function getPatients() {
            const pat = [];
            const patientData = {}; // Object to store patient data by email
            await mycontract.methods.getPatient().call().then(async (res) => {
                console.log(res);
                for (let i = res.length - 1; i >= 0; i--) {
                    const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
                    const selected = data.selectedDoctors;
                    if (!patientData[data.mail]) {
                        patientData[data.mail] = [];
                    }
                    data.hash = res[i]; // Add the hash to the patient data
                    patientData[data.mail].push(data);
                    console.log(data)
                }
                
                // Iterate through patient data by email
                for (const [email, records] of Object.entries(patientData)) {
                    // Sort records by number in descending order
                    records.sort((a, b) => b.number - a.number);
                    // Add the record with the highest number for the email to pat array
                    if (records.length > 0) {
                        pat.push(records[0]);
                    }
                }
                setPatients(pat);
                // Filter the patient records based on whether the current doctor's hash is included in selectedDoctors
                const filteredPatients = pat.filter(patient => patient.selectedDoctors.includes(cookies['hash']));
                setAccessiblePatients(filteredPatients);
            });
        }
        getPatients();
    }, [cookies['hash']]);
    
    
console.log(patients)
    function view(phash) {
        const url = `patientInfo/${phash}`
        window.location.href = url;
    }

    async function treated(phash) {
        var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        var currentaddress = accounts[0];

        const web3 = new Web3(window.ethereum);
        const mycontract = new web3.eth.Contract(contract['abi'], contract['address']);

        const data = await (await fetch(`http://localhost:8080/ipfs/${phash}`)).json();
        const drs = data.selectedDoctors;
        const newList = [];

        for (let i = 1; i < drs.length; i++) {
            if (drs[i] === cookies['hash']) {
                continue;
            }
            else {
                newList.push(drs[i]);
            }
        }

        data.selectedDoctors = newList;

        let client = create();
        client = create(new URL('http://127.0.0.1:5001'));
        const { cid } = await client.add(JSON.stringify(data));
        const hash = cid['_baseCache'].get('z');

        await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
            alert("Patient Removed");
            window.location.reload();
        }).catch((err) => {
            console.log(err);
        })
    }
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        const filteredPatients = patients.filter(patient =>
          patient.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
          patient.mail.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setAccessiblePatients(filteredPatients);
      };
    const showPatients = () => accessiblePatients.map(patient => (
        <tr key={patient.hash}>
          <td >{patient.name}</td>
          <td >{patient.mail}</td>
          <td >
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => view(patient.hash)}
            >
              View
            </button>
          </td>
          <td >
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => treated(patient.hash)}
            >
              Treated
            </button>
          </td>
        </tr>
      ));
    
      return (
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
          <input
            type="text"
            placeholder="Search patients..."
            className="mb-4 px-4 py-2 border rounded"
            onChange={handleSearch}
          />
          <div className="overflow-x-auto">
          <table className="modernTable">
              <thead>
              <tr >
                  <th>Name</th>
                  <th >Email</th>
                  <th >Details</th>
                  <th >Treated?</th>
                </tr>
              </thead>
              <tbody>
                {showPatients()}
              </tbody>
            </table>
          </div>
        </div>
      );
    };
    
    export default Patients;
    
import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import { create } from 'ipfs-http-client';
import { FaEvernote, FaGoogle, FaWikipediaW } from "react-icons/fa";
import { FaSearch } from 'react-icons/fa';
const Doctors = () => {
    const [cookies, setCookie] = useCookies();
    const [doctors, setDoc] = useState([]);
    const [approvedDoctors, setApprovedDoctors] = useState([]);
    const [unapprovedDoctors, setUnapprovedDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchApprovedTerm, setSearchApprovedTerm] = useState("");
    const web3 = new Web3(window.ethereum);
    const mycontract = new web3.eth.Contract(contract["abi"], contract["address"]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await mycontract.methods.getDoctor().call();
                const doc = [];
                for (let i = 0; i < res.length; i++) {
                    const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
                    data['hash'] = res[i];
                    doc.push(data);
                }
                setDoc(doc);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const currentAddress = accounts[0];
                const patientData = await (await fetch(`http://localhost:8080/ipfs/${cookies['hash']}`)).json();
                const approvedDoctors = doc.filter(doctor => patientData.selectedDoctors.includes(doctor.hash));
                const unapprovedDoctors = doc.filter(doctor => !patientData.selectedDoctors.includes(doctor.hash));
                setApprovedDoctors(approvedDoctors);
                setUnapprovedDoctors(unapprovedDoctors);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDoctors();
    }, []);

    async function removeAccess(dhash) {
        var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        var currentaddress = accounts[0];
        const data = await (await fetch(`http://localhost:8080/ipfs/${cookies["hash"]}`)).json();
        const drs = data.selectedDoctors;
        const newList = drs.filter(doctor => doctor !== dhash);
        data.number += 1;
        data.selectedDoctors = newList;

        let client = create();
        client = create(new URL('http://127.0.0.1:5001'));
        const { cid } = await client.add(JSON.stringify(data));
        const hash = cid['_baseCache'].get('z');
        setCookie('hash', hash);
        await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
            alert("Patient Removed");
            window.location.reload();
        }).catch((err) => {
            console.log(err);
        });
    }

    async function add(hash) {
        var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        var currentaddress = accounts[0];

        mycontract.methods.getPatient().call()
            .then(async (res) => {
                for (let i = res.length - 1; i >= 0; i--) {
                    if (res[i] === cookies['hash']) {
                        const pat = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
                        const drs = pat.selectedDoctors;

                        if (!drs.includes(hash)) {
                            drs.push(hash);
                            pat.selectedDoctors = drs;
                            pat.number += 1;
                            let client = create();
                            client = create(new URL('http://127.0.0.1:5001'));
                            const { cid } = await client.add(JSON.stringify(pat));
                            const nhash = cid['_baseCache'].get('z');

                            mycontract.methods.addPatient(nhash).send({ from: currentaddress }).then(() => {
                                setCookie('hash', nhash);
                                alert("Doctor added");
                            }).catch((err) => {
                                console.log(err);
                            });
                        } else {
                            alert("Doctor already added");
                        }
                        break;
                    }
                }
            });
    }

    function showDoctors() {
        return unapprovedDoctors
            .filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(data => {
                return (
                    <tr key={data.hash}>
                        <td>{data.name}</td>
                        <td>{data.mail}</td>
                        <td><input type="button" value="Grant Access" onClick={() => add(data.hash)} className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:bg-red-700" /></td>
                    </tr>
                );
            });
    }

    function showApprovedDoctors() {
        return approvedDoctors
            .filter(data => data.name.toLowerCase().includes(searchApprovedTerm.toLowerCase()))
            .map(data => {
                return (
                    <tr key={data.hash}>
                        <td>{data.name}</td>
                        <td>{data.mail}</td>
                        <td><input type="button" value="Revoke Access" onClick={() => removeAccess(data.hash)} className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:bg-red-700" /></td>
                    </tr>
                );
            });
    }

    return (
        <div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
            <div className="overflow-x-auto mb-6">
                <h3 className="text-white">All Doctors</h3>
                <div className="flex items-center py-2 px-4 rounded-lg bg-white" style={{ maxWidth: '400px', marginLeft: 'auto', marginRight: '0', width: '100%' }}>
                        <FaSearch className="text-gray-400 mr-2" />
                        <input
                    type="text"
                    placeholder="Search Doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow bg-white border-none rounded-md py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                    </div>

                <table className="modernTable">
                    <thead>
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Grant Access</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showDoctors()}
                    </tbody>
                </table>
            </div>
            </div>
             <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
             <div className="overflow-x-auto mb-6">
            <div className="overflow-x-auto">
                <h3 className="text-white">Approved Doctors</h3>
                <div className="flex items-center py-2 px-4 rounded-lg bg-white" style={{ maxWidth: '400px', marginLeft: 'auto', marginRight: '0', width: '100%' }}>
                        <FaSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search Approved Doctors..."
                    value={searchApprovedTerm}
                    onChange={(e) => setSearchApprovedTerm(e.target.value)}
                    className="flex-grow bg-white border-none rounded-md py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
                <table className="modernTable">
                    <thead>
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Revoke Access</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showApprovedDoctors()}
                    </tbody>
                </table>
            </div>
            </div>
            </div></div>
        
    );
};




export default Doctors;

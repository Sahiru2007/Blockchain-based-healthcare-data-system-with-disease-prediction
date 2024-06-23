import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Web3 from "web3";
import contract from "../contracts/contract.json";
import { create } from 'ipfs-http-client';
import { useStateContext } from "../contexts/ContextProvider";
import '../commonTable.css'
const Insurance = () => {
  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(
    contract["abi"],
    contract["address"]
  );
  const [cookies, setCookie] = useCookies();
  const [insurances, setInsurance] = useState([]);
  const { setCurrentColor, setCurrentMode } = useStateContext();
  
  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
    const fetchData = async () => {
      try {
        const res = await mycontract.methods.getPatient().call();
        const ins = [];
        for (let i = res.length - 1; i >= 0; i--) {
          if (res[i] === cookies['hash']) {
            const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
            ins.push(data.insurance);
            break;
          }
        }
        setInsurance(ins);
      } catch (error) {
        console.error("Error fetching insurance data:", error);
      }
    };
    fetchData();
  }, [cookies['hash']]);

  const [addFormData, setAddFormData] = useState({
    company: "",
    policyNo: "",
    expiry: "",
    coverageType: "",
    effectiveDate: "",
    expirationDate: "",
    coPayment: "",
    deductible: "",
    coinsurance: "",
    networkProviders: "",
    authorizationRequirements: "",
    emergencyCoverage: ""
  });

  const handleAddFormChange = (event) => {
    const newFormData = { ...addFormData };
    newFormData[event.target.name] = event.target.value;
    setAddFormData(newFormData);
  };

 
async function submit() {
  var accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  var currentaddress = accounts[0];

  mycontract.methods
    .getPatient()
    .call()
    .then(async (res) => {
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === cookies['hash']) {
          const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
          const ins = data.insurance;
          console.log(data)
          data.number += 1;
          ins.push(addFormData);
          console.log(data)
          data.insurance = ins;
          let client = create();
          client = create(new URL('http://127.0.0.1:5001'));
          const { cid } = await client.add(JSON.stringify(data));
          const hash = cid['_baseCache'].get('z');

          await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
            setCookie('hash', hash);
            alert("Insurance Added");
            window.location.reload();
          }).catch((err) => {
            console.log(err);
          })
        }
      }
    });
}



async function del(policy) {
  var accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  var currentaddress = accounts[0];

  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(
    contract["abi"],
    contract["address"]
  );

  mycontract.methods.getPatient().call().then(async (res) => {
    for (let i = res.length - 1; i >= 0; i--) {
      if (res[i] === cookies['hash']) {
        const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
        const alls = data.insurance;
        const newList = [];
        for (let i = 1; i < alls.length; i++) {
          if (alls[i].policyNo === policy) {
            continue;
          }
          else {
            newList.push(alls[[i]]);
          }
        }
        data.insurance = newList;

        let client = create();
        client = create(new URL('http://127.0.0.1:5001'));
        const { cid } = await client.add(JSON.stringify(data));
        const hash = cid['_baseCache'].get('z');

        await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
          setCookie('hash', hash);
          alert("Deleted");
          window.location.reload();
        }).catch((err) => {
          console.log(err);
        })
      }
    }
  })
}

  function showInsurances() {
    if (insurances.length > 0) {
      return insurances[0].map((data, index) => {
        if (index ===  null) {
          // Skip rendering the first element
          return null;
        }
        return (
          <tr key={index} className="text-gray-700 dark:text-gray-400">
            <td className="px-4 py-3">{data.company}</td>
            <td className="px-4 py-3">{data.policyNo}</td>
            <td className="px-4 py-3">{data.expiry}</td>
            <td className="px-4 py-3">{data.coverageType}</td>
            <td className="px-4 py-3">{data.effectiveDate}</td>
            <td className="px-4 py-3">{data.expirationDate}</td>
            <td className="px-4 py-3">{data.coPayment}</td>
            <td className="px-4 py-3">{data.deductible}</td>
            <td className="px-4 py-3">{data.coinsurance}</td>
            <td className="px-4 py-3">{data.networkProviders}</td>
            <td className="px-4 py-3">{data.authorizationRequirements}</td>
            <td className="px-4 py-3">{data.emergencyCoverage}</td>
            <td className="px-4 py-3">
              <input
                onClick={() => del(data.policyNo)}
                className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:bg-red-700"  
                type="button"
                value="Delete" 
              />
            </td>
          </tr>
        );
      });
    }
  }
  
  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className="dark:bg-main-dark-bg  bg-main-bg min-h-screen ml-10 w-full">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
        <form className="p-6 rounded-lg ">
  <h2 className="text-gray-400">Add an Insurance</h2>
  <div className="grid grid-cols-2 gap-4">
    <input
      type="text"
      name="company"
      required
      placeholder="Insurance Provider"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="policyNo"
      required
      placeholder="Policy Number"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="expiry"
      required
      placeholder="Expiration Date"
      onFocus={(e) => (e.target.type = 'date')}
      onBlur={(e) => (e.target.type = 'text')}
      pattern="\d{4}-\d{2}-\d{2}"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="coverageType"
      required
      placeholder="Coverage Type"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="effectiveDate"
      required
      placeholder="Effective Date"
      onFocus={(e) => (e.target.type = 'date')}
      onBlur={(e) => (e.target.type = 'text')}
      pattern="\d{4}-\d{2}-\d{2}"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="expirationDate"
      required
      placeholder="Expiration Date"
      onFocus={(e) => (e.target.type = 'date')}
      onBlur={(e) => (e.target.type = 'text')}
      pattern="\d{4}-\d{2}-\d{2}"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="coPayment"
      required
      placeholder="Co-payment"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="deductible"
      required
      placeholder="Deductible"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="coinsurance"
      required
      placeholder="Coinsurance"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="networkProviders"
      required
      placeholder="Network Providers"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="authorizationRequirements"
      required
      placeholder="Authorization Requirements"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />

    <input
      type="text"
      name="emergencyCoverage"
      required
      placeholder="Emergency Coverage"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black w-full"
    />
  </div>
  <input type="button" value="Save" onClick={submit} className="bg-teal-600 mt-5 text-white font-bold p-3 rounded hover:bg-teal-700 transition duration-300"/>
</form>


        </div>
       
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
          <h2 className="text-gray-400">Insurance Details</h2>
          <form className="w-full">
            <div className="overflow-x-auto">
            <table className="modernTable">
                <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-4 py-3">Insurance Provider</th>
                    <th className="px-4 py-3">Policy Number</th>
                    <th className="px-4 py-3">Expiration Date</th>
                    <th className="px-4 py-3">Coverage Type</th>
                    <th className="px-4 py-3">Effective Date</th>
                    <th className="px-4 py-3">Expiration Date</th>
                    <th className="px-4 py-3">Co-payment</th>
                    <th className="px-4 py-3">Deductible</th>
                    <th className="px-4 py-3">Coinsurance</th>
                    <th className="px-4 py-3">Network Providers</th>
                    <th className="px-4 py-3">Authorization Requirements</th>
                    <th className="px-4 py-3">Emergency Coverage</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {showInsurances()}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Insurance;

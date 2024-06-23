import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import { create } from 'ipfs-http-client'
import '../commonTable.css'
const Allergies = () => {
  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(
    contract["abi"],
    contract["address"]
  );
  const [cookies, setCookie] = useCookies();
  const [allergies, setAllergies] = useState([]);

  useEffect(() => {
    const allergiesData = [];
    async function getAllergies() {
      await mycontract.methods
        .getPatient()
        .call()
        .then(async (res) => {
          for (let i = res.length - 1; i >= 0; i--) {
            if (res[i] === cookies['hash']) {
              const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
              allergiesData.push(data.allergies);
              break;
            }
          }
        });
      setAllergies(allergiesData);
    }
    getAllergies();
    return;
  }, [allergies.length]);

  const [addFormData, setAddFormData] = useState({
    allergen: "",
    typeOfReaction: "",
    severity: "",
    dateOfOnset: "",
    lastReactionDate: "",
    symptoms: "",
    treatment: "",
    additionalNotes: "",
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
    var currentAddress = accounts[0];

    mycontract.methods.getPatient().call().then(async (res) => {
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === cookies['hash']) {
          const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
          const allergiesData = data.allergies;
          allergiesData.push(addFormData);
          data.allergies = allergiesData;

          let client = create();
          client = create(new URL('http://127.0.0.1:5001'));
          const { cid } = await client.add(JSON.stringify(data));
          const hash = cid['_baseCache'].get('z');

          await mycontract.methods.addPatient(hash).send({ from: currentAddress }).then(() => {
            setCookie('hash', hash);
            alert("Added");
            window.location.reload();
          }).catch((err) => {
            console.log(err);
          })
        }
      }
    });
  }

  async function del(allergen) {
    var accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    var currentAddress = accounts[0];

    mycontract.methods.getPatient().call().then(async (res) => {
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === cookies['hash']) {
          const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
          const allergiesData = data.allergies;
          const newList = allergiesData.filter(allergy => allergy.allergen !== allergen);
          data.allergies = newList;

          let client = create();
          client = create(new URL('http://127.0.0.1:5001'));
          const { cid } = await client.add(JSON.stringify(data));
          const hash = cid['_baseCache'].get('z');

          await mycontract.methods.addPatient(hash).send({ from: currentAddress }).then(() => {
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

  function showAllergies() {
    if (allergies.length > 0) {
      return allergies[0].map((allergy, index) => {
        if (index === null) {
          // Skip rendering the first element
          return null;
        }

        return (
          <tr key={index} className="text-gray-700 dark:text-gray-400">
            <td className="px-4 py-3">{allergy.allergen}</td>
            <td className="px-4 py-3">{allergy.typeOfReaction}</td>
            <td className="px-4 py-3">{allergy.severity}</td>
            <td className="px-4 py-3">{allergy.dateOfOnset}</td>
            <td className="px-4 py-3">{allergy.lastReactionDate}</td>
            <td className="px-4 py-3">{allergy.symptoms}</td>
            <td className="px-4 py-3">{allergy.treatment}</td>
            <td className="px-4 py-3">{allergy.additionalNotes}</td>
            <td className="px-4 py-3">
              <input type="button" onClick={() => del(allergy.allergen)} className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:bg-red-700" value="Delete" />
            </td>
          </tr>
        )
      })
    }
  }

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className={"dark:bg-main-dark-bg bg-main-bg min-h-screen ml-10 w-full  "}>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
        <form className="flex flex-col gap-4 p-6 rounded-lg">
  <h2 className="text-gray-400">Add an Allergy</h2>
  <div className="grid grid-cols-2 gap-4">
    <input
      type="text"
      name="allergen"
      required
      placeholder="Allergen"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
    />
    <input
      type="text"
      name="typeOfReaction"
      required
      placeholder="Type of Reaction"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
    />
    <input
      type="text"
      name="severity"
      required
      placeholder="Severity"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
    />
    <input
      type="text"
      name="dateOfOnset"
      required
      placeholder="Date of Onset"
      pattern="\d{4}-\d{2}-\d{2}"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
      onFocus={(e) => (e.target.type = 'date')}
      onBlur={(e) => (e.target.type = 'text')}
      
    />
    <input
      type="text"
      name="lastReactionDate"
      required
      placeholder="Last Reaction Date"
      pattern="\d{4}-\d{2}-\d{2}"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
      onFocus={(e) => (e.target.type = 'date')}
      onBlur={(e) => (e.target.type = 'text')}
    />
    <input
      type="text"
      name="symptoms"
      required
      placeholder="Symptoms"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
    />
    <input
      type="text"
      name="treatment"
      required
      placeholder="Treatment"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
    />
    <input
      type="text"
      name="additionalNotes"
      required
      placeholder="Additional Notes"
      onChange={handleAddFormChange}
      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
    />
  </div>
  <input
    type="button"
    value="Save"
    onClick={submit}
    className="bg-teal-600 text-white font-bold p-3 rounded hover:bg-teal-700 transition duration-300"
  />
</form>



        </div>
       
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
          
          <h2 className="text-gray-400">Allergies Details</h2>
          <form className="w-full">
          <table className="modernTable">
              <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">Allergen</th>
                  <th className="px-4 py-3">Type of Reaction</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Date of Onset</th>
                  <th className="px-4 py-3">Last Reaction Date</th>
                  <th className="px-4 py-3">Symptoms</th>
                  <th className="px-4 py-3">Treatment</th>
                  <th className="px-4 py-3">Additional Notes</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody >
                {showAllergies()}
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Allergies;

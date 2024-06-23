import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import { create } from 'ipfs-http-client';

const HospitalizationHistory = () => {
  const [cookies, setCookie] = useCookies();
  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(
    contract["abi"],
    contract["address"]
  );
  const [hospHistory, setHospHistory] = useState([]);

  useEffect(() => {
    const hosphis = [];
    async function getHospHistory() {
      await mycontract.methods
        .getPatient()
        .call()
        .then(async (res) => {
          for (let i = res.length - 1; i >= 0; i--) {
            if (res[i] === cookies['hash']) {
              const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
              hosphis.push(data.hospitalizationhistory);
              break;
            }
          }
        });
      setHospHistory(hosphis);
    }
    getHospHistory();
    return;
  }, [hospHistory.length]);

  const [addFormData, setAddFormData] = useState({
    datefrom: "",
    dateto: "",
    reason: "",
    surgery: "",
    hospital: "",
    doctor: "",
    notes: ""
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
            const hosphis = data.hospitalizationhistory;
            hosphis.push(addFormData);

            data.hospitalizationhistory = hosphis;
            let client = create();
            client = create(new URL('http://127.0.0.1:5001'));
            const { cid } = await client.add(JSON.stringify(data));
            const hash = cid['_baseCache'].get('z');

            await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
              setCookie('hash', hash);
              alert("Hospitalization record added");
              window.location.reload();
            }).catch((err) => {
              console.log(err);
            })
          }
        }
      });
  }

  async function del(datefrom) {
    var accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    var currentaddress = accounts[0];

    mycontract.methods.getPatient().call().then(async (res) => {
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === cookies['hash']) {
          const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
          const hosphis = data.hospitalizationhistory;
          const newList = hosphis.filter(item => item.datefrom !== datefrom);
          data.hospitalizationhistory = newList;

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

  function showHospRecords() {
    if (hospHistory.length > 0) {
      return hospHistory[0].map((data, index) => {
        return (
          <tr className="text-gray-700 dark:text-gray-400" key={index}>
            <td className="px-4 py-3">{data.datefrom}</td>
            <td className="px-4 py-3">{data.dateto}</td>
            <td className="px-4 py-3">{data.reason}</td>
            <td className="px-4 py-3">{data.surgery}</td>
            <td className="px-4 py-3">{data.hospital}</td>
            <td className="px-4 py-3">{data.doctor}</td>
            <td className="px-4 py-3">{data.notes}</td>
            <td className="px-4 py-3">
              <input type="button" value="Delete" onClick={() => del(data.datefrom)} 
                className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:bg-red-700"  
              />
            </td>
          </tr>
        )
      })
    }
  }

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className={"dark:bg-main-dark-bg bg-main-bg min-h-screen ml-10 w-full"}>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
          <form className="flex flex-col gap-4 p-6 rounded-lg">
            <h2 className="text-gray-400">Add your Hospitalization history</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="datefrom"
                required
                placeholder="Admitted On"
                pattern="\d{4}-\d{2}-\d{2}"
                onChange={handleAddFormChange}
                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
              <input
                type="text"
                name="dateto"
                required
                placeholder="Discharged On"
                pattern="\d{4}-\d{2}-\d{2}"
                onChange={handleAddFormChange}
                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
              <input
                type="text"
                name="reason"
                required
                placeholder="Reason"
                onChange={handleAddFormChange}
                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
              />
              <input
                type="text"
                name="surgery"
                required
                placeholder="Surgery, if any?"
                onChange={handleAddFormChange}
                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
              />
              <input
                type="text"
                name="hospital"
                required
                placeholder="Hospital"
                onChange={handleAddFormChange}
                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
              />
              <input
                type="text"
                name="doctor"
                required
                placeholder="Doctor"
                onChange={handleAddFormChange}
                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
              />
              <input
                type="text"
                name="notes"
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
          <h2 className="text-gray-400">Hospitalization History</h2>
          <form className="w-full">
            <div className="overflow-x-auto">
              <table className="modernTable">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-4 py-3">Admitted On</th>
                    <th className="px-4 py-3">Discharged On</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Surgery</th>
                    <th className="px-4 py-3">Hospital</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Additional Notes</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody >
                  {showHospRecords()}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalizationHistory;

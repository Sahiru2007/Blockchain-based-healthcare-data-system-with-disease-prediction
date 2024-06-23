import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Web3 from "web3";
import contract from "../contracts/contract.json";

const PatientInfo = () => {
    const { phash } = useParams();
    const [patient, setPatient] = useState([]);
    const web3 = new Web3(window.ethereum);
    const mycontract = new web3.eth.Contract(
        contract["abi"],
        contract["address"]
    );

    useEffect(() => {
        const pat = [];
        async function getPatient() {
            const data = await (await fetch(`http://localhost:8080/ipfs/${phash}`)).json();
            pat.push(data);
            setPatient(pat);
            console.log(data)
        }
        getPatient();
        return;

    }, [patient.length])

    function showInsurance() {
        if (patient.length > 0 && patient[0].hasOwnProperty('insurance')) {
            return patient[0]['insurance'].map((d) => {
                if (d.hasOwnProperty('company')) {
                    return (
                        <tr key={d.company}>
                            <td>{d.company}</td>
                            <td>{d.policyNo}</td>
                            <td>{d.expiry}</td>
                            <td>{d.coverageType}</td>
                            <td>{d.effectiveDate}</td>
                            <td>{d.expirationDate}</td>
                            <td>{d.coPayment}</td>
                            <td>{d.deductible}</td>
                            <td>{d.coinsurance}</td>
                            <td>{d.networkProviders}</td>
                            <td>{d.authorizationRequirements}</td>
                            <td>{d.emergencyCoverage}</td>
                        </tr>
                    )
                }
            })
        }
    }

    function showAllergies() {
        if (patient.length > 0 && patient[0].hasOwnProperty('allergies')) {
            return patient[0]['allergies'].map((d) => {
                if (d.hasOwnProperty('allergen')) {
                    return (
                        <tr key={d.allergen}>
                            <td>{d.allergen}</td>
                            <td>{d.typeOfReaction}</td>
                            <td>{d.severity}</td>
                            <td>{d.dateOfOnset}</td>
                            <td>{d.lastReactionDate}</td>
                            <td>{d.symptoms}</td>
                            <td>{d.treatment}</td>
                            <td>{d.additionalNotes}</td>
                        </tr>
                    )
                }
            })
        }
    }

    function showMedHistory() {
        if (patient.length > 0 && patient[0].hasOwnProperty('medicalhistory')) {
            return patient[0]['medicalhistory'].map((d) => {
                if (d.hasOwnProperty('disease')) {
                    return (
                        <tr key={d.disease}>
                            <td>{d.disease}</td>
                            <td>{d.diagnosedDate}</td>
                            <td>{d.status}</td>
                            <td>{d.treatment}</td>
                            <td>{d.doctor}</td>
                            <td>{d.hospital}</td>
                            <td>{d.notes}</td>
                        </tr>
                    )
                }
            })
        }
    }

    function showHospHistory() {
        if (patient.length > 0 && patient[0].hasOwnProperty('hospitalizationhistory')) {
            return patient[0]['hospitalizationhistory'].map((d) => {
                if (d.hasOwnProperty('datefrom')) {
                    return (
                        <tr key={d.datefrom}>
                            <td>{d.datefrom}</td>
                            <td>{d.dateto}</td>
                            <td>{d.reason}</td>
                            <td>{d.surgery}</td>
                            <td>{d.hospital}</td>
                            <td>{d.doctor}</td>
                            <td>{d.notes}</td>
                        </tr>
                    )
                }
            })
        }
    }

    function showCheckUpHistory() {
        if (patient.length > 0 && patient[0].hasOwnProperty('visit')) {
            return patient[0]['visit'].map((d) => {
                if (d.hasOwnProperty('name')) {
                    return (
                        <tr key={d.name}>
                            <td>{d.name}</td>
                            <td>{d.date}</td>
                            <td>{d.reason}</td>
                            <td>{d.treatment}</td>
                            <td>{d.notes}</td>
                        </tr>
                    )
                }
            })
        }
    }
    

    return (
        <div className="flex relative dark:bg-main-dark-bg">
            <div className={"dark:bg-main-dark-bg bg-main-bg min-h-screen ml-10 w-full"}>
                <div style={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
                        <h1 className="text-white" style={{ fontSize: '2rem' }}>Insurance</h1>
                        <table className="modernTable">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Policy No.</th>
                                    <th>Expiry</th>
                                    <th>Coverage Type</th>
                                    <th>Effective Date</th>
                                    <th>Expiration Date</th>
                                    <th>Co-payment</th>
                                    <th>Deductible</th>
                                    <th>Coinsurance</th>
                                    <th>Network Providers</th>
                                    <th>Authorization Requirements</th>
                                    <th>Emergency Coverage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showInsurance()}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
                        <h1 className="text-white" style={{ fontSize: '2rem' }}>Allergies</h1>
                        <table className="modernTable">
                            <thead>
                                <tr>
                                    <th>Allergen</th>
                                    <th>Type of Reaction</th>
                                    <th>Severity</th>
                                    <th>Date of Onset</th>
                                    <th>Last Reaction Date</th>
                                    <th>Symptoms</th>
                                    <th>Treatment</th>
                                    <th>Additional Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showAllergies()}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
                        <h1 className="text-white" style={{ fontSize: '2rem' }}>Medical History</h1>
                        <table className="modernTable">
                            <thead>
                                <tr>
                                    <th>Disease</th>
                                    <th>Diagnosed Date</th>
                                    <th>Status</th>
                                    <th>Treatment</th>
                                    <th>Doctor</th>
                                    <th>Hospital</th>
                                    <th>Additional Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showMedHistory()}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
                        <h1 className="text-white" style={{ fontSize: '2rem' }}>Hospitalization History</h1>
                        <table className="modernTable">
                            <thead>
                                <tr>
                                    <th>Admitted On</th>
                                    <th>Discharged On</th>
                                    <th>Reason</th>
                                    <th>Surgery</th>
                                    <th>Hospital</th>
                                    <th>Doctor</th>
                                    <th>Additional Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showHospHistory()}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
    <h1 className="text-white" style={{ fontSize: '2rem' }}>Checkup History</h1>
    <table className="modernTable">
        <thead>
            <tr>
                <th>Name Of Professional</th>
                <th>Date Of Visit</th>
                <th>Reason</th>
                <th>Treatment</th>
                <th>Additional Notes</th>
            </tr>
        </thead>
        <tbody>
            {showCheckUpHistory()}
        </tbody>
    </table>
</div>

                </div>
            </div>
        </div>
    );
}

export default PatientInfo;

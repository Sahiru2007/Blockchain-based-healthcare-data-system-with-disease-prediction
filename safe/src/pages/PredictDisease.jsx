import React, { useState, Fragment } from "react";
import { nanoid } from "nanoid";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useCookies } from "react-cookie";
import { FaEvernote, FaGoogle, FaWikipediaW } from "react-icons/fa";
import { FaSearch } from 'react-icons/fa';

const Insurance = () => {
    const [symptomsState, setSymptomsState] = useState({
        "Itching": false, "Skin Rash": false, "Nodal Skin Eruptions": false, "Continuous Sneezing": false,
        "Shivering": false, "Chills": false, "Joint Pain": false, "Stomach Pain": false, "Acidity": false,
        "Ulcers On Tongue": false, "Muscle Wasting": false, "Vomiting": false, "Burning Micturition": false,
        "Spotting Urination": false, "Fatigue": false, "Weight Gain": false, "Anxiety": false,
        "Cold Hands And Feets": false, "Mood Swings": false, "Weight Loss": false, "Restlessness": false,
        "Lethargy": false, "Patches In Throat": false, "Irregular Sugar Level": false, "Cough": false,
        "High Fever": false, "Sunken Eyes": false, "Breathlessness": false, "Sweating": false,
        "Dehydration": false, "Indigestion": false, "Headache": false, "Yellowish Skin": false,
        "Dark Urine": false, "Nausea": false, "Loss Of Appetite": false, "Pain Behind The Eyes": false,
        "Back Pain": false, "Constipation": false, "Abdominal Pain": false, "Diarrhoea": false,
        "Mild Fever": false, "Yellow Urine": false, "Yellowing Of Eyes": false, "Acute Liver Failure": false,
        "Swelling Of Stomach": false, "Swelled Lymph Nodes": false, "Malaise": false, "Blurred And Distorted Vision": false,
        "Phlegm": false, "Throat Irritation": false, "Redness Of Eyes": false, "Sinus Pressure": false,
        "Runny Nose": false, "Congestion": false, "Chest Pain": false, "Weakness In Limbs": false,
        "Fast Heart Rate": false, "Pain During Bowel Movements": false, "Pain In Anal Region": false,
        "Bloody Stool": false, "Irritation In Anus": false, "Neck Pain": false, "Dizziness": false,
        "Cramps": false, "Bruising": false, "Obesity": false, "Swollen Legs": false, "Swollen Blood Vessels": false,
        "Puffy Face And Eyes": false, "Enlarged Thyroid": false, "Brittle Nails": false, "Swollen Extremeties": false,
        "Excessive Hunger": false, "Extra Marital Contacts": false, "Drying And Tingling Lips": false,
        "Slurred Speech": false, "Knee Pain": false, "Hip Joint Pain": false, "Muscle Weakness": false,
        "Stiff Neck": false, "Swelling Joints": false, "Movement Stiffness": false, "Spinning Movements": false,
        "Loss Of Balance": false, "Unsteadiness": false, "Weakness Of One Body Side": false, "Loss Of Smell": false,
        "Bladder Discomfort": false, "Foul Smell Of Urine": false, "Continuous Feel Of Urine": false,
        "Passage Of Gases": false, "Internal Itching": false, "Toxic Look (Typhos)": false, "Depression": false,
        "Irritability": false, "Muscle Pain": false, "Altered Sensorium": false, "Red Spots Over Body": false,
        "Belly Pain": false, "Abnormal Menstruation": false, "Dischromic Patches": false,"Watering From Eyes": false,
        "Increased Appetite": false, "Polyuria": false, "Family History": false, "Mucoid Sputum": false,
        "Rusty Sputum": false, "Lack Of Concentration": false, "Visual Disturbances": false,
        "Receiving Blood Transfusion": false, "Receiving Unsterile Injections": false, "Coma": false,
        "Stomach Bleeding": false, "Distention Of Abdomen": false, "History Of Alcohol Consumption": false,
        "Fluid Overload": false, "Blood In Sputum": false, "Prominent Veins On Calf": false, "Palpitations": false,
        "Painful Walking": false, "Pus Filled Pimples": false, "Blackheads": false, "Scurring": false,
        "Skin Peeling": false, "Silver Like Dusting": false, "Small Dents In Nails": false, "Inflammatory Nails": false,
        "Blister": false, "Red Sore Around Nose": false, "Yellow Crust Ooze": false,
    });
    const [disease, setDisease] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); 

    const filteredSymptoms = Object.keys(symptomsState).filter(symptom =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function check() {
        const data = {
            "Itching": symptomsState["Itching"],
            "Skin Rash": symptomsState["Skin Rash"],
            "Nodal Skin Eruptions": symptomsState["Nodal Skin Eruptions"],
            "Continuous Sneezing": symptomsState["Continuous Sneezing"],
            "Shivering": symptomsState["Shivering"],
            "Chills": symptomsState["Chills"],
            "Joint Pain": symptomsState["Joint Pain"],
            "Stomach Pain": symptomsState["Stomach Pain"],
            "Acidity": symptomsState["Acidity"],
            "Ulcers On Tongue": symptomsState["Ulcers On Tongue"],
            "Muscle Wasting": symptomsState["Muscle Wasting"],
            "Vomiting": symptomsState["Vomiting"],
            "Burning Micturition": symptomsState["Burning Micturition"],
            "Spotting Urination": symptomsState["Spotting Urination"],
            "Fatigue": symptomsState["Fatigue"],
            "Weight Gain": symptomsState["Weight Gain"],
            "Anxiety": symptomsState["Anxiety"],
            "Cold Hands And Feets": symptomsState["Cold Hands And Feets"],
            "Mood Swings": symptomsState["Mood Swings"],
            "Weight Loss": symptomsState["Weight Loss"],
            "Restlessness": symptomsState["Restlessness"],
            "Lethargy": symptomsState["Lethargy"],
            "Patches In Throat": symptomsState["Patches In Throat"],
            "Irregular Sugar Level": symptomsState["Irregular Sugar Level"],
            "Cough": symptomsState["Cough"],
            "High Fever": symptomsState["High Fever"],
            "Sunken Eyes": symptomsState["Sunken Eyes"],
            "Breathlessness": symptomsState["Breathlessness"],
            "Sweating": symptomsState["Sweating"],
            "Dehydration": symptomsState["Dehydration"],
            "Indigestion": symptomsState["Indigestion"],
            "Headache": symptomsState["Headache"],
            "Yellowish Skin": symptomsState["Yellowish Skin"],
            "Dark Urine": symptomsState["Dark Urine"],
            "Nausea": symptomsState["Nausea"],
            "Loss Of Appetite": symptomsState["Loss Of Appetite"],
            "Pain Behind The Eyes": symptomsState["Pain Behind The Eyes"],
            "Back Pain": symptomsState["Back Pain"],
            "Constipation": symptomsState["Constipation"],
            "Abdominal Pain": symptomsState["Abdominal Pain"],
            "Diarrhoea": symptomsState["Diarrhoea"],
            "Mild Fever": symptomsState["Mild Fever"],
            "Yellow Urine": symptomsState["Yellow Urine"],
            "Yellowing Of Eyes": symptomsState["Yellowing Of Eyes"],
            "Acute Liver Failure": symptomsState["Acute Liver Failure"],
            "Swelling Of Stomach": symptomsState["Swelling Of Stomach"],
            "Swelled Lymph Nodes": symptomsState["Swelled Lymph Nodes"],
            "Malaise": symptomsState["Malaise"],
            "Blurred And Distorted Vision": symptomsState["Blurred And Distorted Vision"],
            "Phlegm": symptomsState["Phlegm"],
            "Throat Irritation": symptomsState["Throat Irritation"],
            "Redness Of Eyes": symptomsState["Redness Of Eyes"],
            "Sinus Pressure": symptomsState["Sinus Pressure"],
            "Runny Nose": symptomsState["Runny Nose"],
            "Congestion": symptomsState["Congestion"],
            "Chest Pain": symptomsState["Chest Pain"],
            "Weakness In Limbs": symptomsState["Weakness In Limbs"],
            "Fast Heart Rate": symptomsState["Fast Heart Rate"],
            "Pain During Bowel Movements": symptomsState["Pain During Bowel Movements"],
            "Pain In Anal Region": symptomsState["Pain In Anal Region"],
            "Bloody Stool": symptomsState["Bloody Stool"],
            "Irritation In Anus": symptomsState["Irritation In Anus"],
            "Neck Pain": symptomsState["Neck Pain"],
            "Dizziness": symptomsState["Dizziness"],
            "Cramps": symptomsState["Cramps"],
            "Bruising": symptomsState["Bruising"],
            "Obesity": symptomsState["Obesity"],
            "Swollen Legs": symptomsState["Swollen Legs"],
            "Swollen Blood Vessels": symptomsState["Swollen Blood Vessels"],
            "Puffy Face And Eyes": symptomsState["Puffy Face And Eyes"],
            "Enlarged Thyroid": symptomsState["Enlarged Thyroid"],
            "Brittle Nails": symptomsState["Brittle Nails"],
            "Swollen Extremeties": symptomsState["Swollen Extremeties"],
            "Excessive Hunger": symptomsState["Excessive Hunger"],
            "Extra Marital Contacts": symptomsState["Extra Marital Contacts"],
            "Drying And Tingling Lips": symptomsState["Drying And Tingling Lips"],
            "Slurred Speech": symptomsState["Slurred Speech"],
            "Knee Pain": symptomsState["Knee Pain"],
            "Hip Joint Pain": symptomsState["Hip Joint Pain"],
            "Muscle Weakness": symptomsState["Muscle Weakness"],
            "Stiff Neck": symptomsState["Stiff Neck"],
            "Swelling Joints": symptomsState["Swelling Joints"],
            "Movement Stiffness": symptomsState["Movement Stiffness"],
            "Spinning Movements": symptomsState["Spinning Movements"],
            "Loss Of Balance": symptomsState["Loss Of Balance"],
            "Unsteadiness": symptomsState["Unsteadiness"],
            "Weakness Of One Body Side": symptomsState["Weakness Of One Body Side"],
            "Loss Of Smell": symptomsState["Loss Of Smell"],
            "Bladder Discomfort": symptomsState["Bladder Discomfort"],
            "Foul Smell Of Urine": symptomsState["Foul Smell Of Urine"],
            "Continuous Feel Of Urine": symptomsState["Continuous Feel Of Urine"],
            "Passage Of Gases": symptomsState["Passage Of Gases"],
            "Internal Itching": symptomsState["Internal Itching"],
            "Toxic Look (Typhos)": symptomsState["Toxic Look (Typhos)"],
            "Depression": symptomsState["Depression"],
            "Irritability": symptomsState["Irritability"],
            "Muscle Pain": symptomsState["Muscle Pain"],
            "Altered Sensorium": symptomsState["Altered Sensorium"],
            "Red Spots Over Body": symptomsState["Red Spots Over Body"],
            "Belly Pain": symptomsState["Belly Pain"],
            "Abnormal Menstruation": symptomsState["Abnormal Menstruation"],
            "Dischromic Patches": symptomsState["Dischromic Patches"],
            "Watering From Eyes": symptomsState["Watering From Eyes"],
            "Increased Appetite": symptomsState["Increased Appetite"],
            "Polyuria": symptomsState["Polyuria"],
            "Family History": symptomsState["Family History"],
            "Mucoid Sputum": symptomsState["Mucoid Sputum"],
            "Rusty Sputum": symptomsState["Rusty Sputum"],
            "Lack Of Concentration": symptomsState["Lack Of Concentration"],
            "Visual Disturbances": symptomsState["Visual Disturbances"],
            "Receiving Blood Transfusion": symptomsState["Receiving Blood Transfusion"],
            "Receiving Unsterile Injections": symptomsState["Receiving Unsterile Injections"],
            "Coma": symptomsState["Coma"],
            "Stomach Bleeding": symptomsState["Stomach Bleeding"],
            "Distention Of Abdomen": symptomsState["Distention Of Abdomen"],
            "History Of Alcohol Consumption": symptomsState["History Of Alcohol Consumption"],
            "Fluid Overload": symptomsState["Fluid Overload"],
            "Blood In Sputum": symptomsState["Blood In Sputum"],
            "Prominent Veins On Calf": symptomsState["Prominent Veins On Calf"],
            "Palpitations": symptomsState["Palpitations"],
            "Painful Walking": symptomsState["Painful Walking"],
            "Pus Filled Pimples": symptomsState["Pus Filled Pimples"],
            "Blackheads": symptomsState["Blackheads"],
            "Scurring": symptomsState["Scurring"],
            "Skin Peeling": symptomsState["Skin Peeling"],
            "Silver Like Dusting": symptomsState["Silver Like Dusting"],
            "Small Dents In Nails": symptomsState["Small Dents In Nails"],
            "Inflammatory Nails": symptomsState["Inflammatory Nails"],
            "Blister": symptomsState["Blister"],
            "Red Sore Around Nose": symptomsState["Red Sore Around Nose"],
            "Yellow Crust Ooze": symptomsState["Yellow Crust Ooze"],
        };
        
        await fetch(`http://127.0.0.1:5000/${JSON.stringify(data)}`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        
        .then(res => res.json())
        .then(d => {
            // Remove double quotes from the response
            const diseaseName = d.replace(/"/g, '');
            setDisease(diseaseName);
        })
        .catch(error => {
            window.alert(error);
            return;
        });
    }

    const googleSearch = () => {
        if (disease) {
            window.open(`https://www.google.com/search?q=${encodeURI(disease)}`, "_blank");
        }
    }
    const wikipediaSearch = () => {
        if (disease) {
            window.open(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURI(disease)}`, "_blank");
        }
    };
    const handleSymptomChange = (symptom) => {
        setSymptomsState(prevState => ({
            ...prevState,
            [symptom]: !prevState[symptom]
        }));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="flex relative dark:bg-main-dark-bg min-h-screen overflow-hidden">
            <div className="dark:bg-main-dark-bg bg-main-bg min-h-screen ml-10 w-full flex flex-col items-center">
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto text-gray-200" style={{ height: '75vh', overflowY: 'auto', marginTop: '2rem' }}>
                    <div className="flex items-center py-2 px-4 rounded-lg bg-white" style={{ maxWidth: '400px', marginLeft: 'auto', marginRight: '0', width: '100%' }}>
                        <FaSearch className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search symptoms..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="flex-grow bg-white border-none rounded-md py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Search symptoms"
                        />
                    </div>
                    <div className="flex flex-col items-center justify-start f-500 text-white animate-fadeInScaleUp">
                        <h2 className="text-3xl font-bold mb-6 text-white">Select Your Symptoms</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSymptoms.map((symptom) => (
                                <div
                                    key={symptom}
                                    className={`flex items-center border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-500 transition-colors duration-300 space-x-4 text-white ${symptomsState[symptom] ? 'bg-green-500' : ''}`}
                                    onClick={() => handleSymptomChange(symptom)}
                                >
                                    <h3 className="text-xl font-semibold text-white">{symptom.replace(/_/g, ' ')}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                    <input
                        style={{
                            marginTop: '1rem',
                            backgroundColor: "rgb(3, 201, 215)",
                            padding: "8px 12px",
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        type="button"
                        value="Submit"
                        onClick={check}
                    />
                </div>
                {disease && (
                     <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mx-auto text-gray-200" style={{ height: 'auto', overflowY: 'auto', marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                     <div className="flex items-center gap-2">
                         <div>Predicted Diagnosis: {disease.replace(/"/g, '')}</div>
                         <button className="bg-blue-500 hover:bg-blue-700 rounded-full p-2 flex items-center justify-center" onClick={googleSearch} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <FaGoogle className="text-white" size={20} />
                         </button>
                         <button className="bg-green-500 hover:bg-green-700 rounded-full p-2 flex items-center justify-center" onClick={wikipediaSearch} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <FaWikipediaW className="text-white" size={20} />
                         </button>
                     </div>
                 </div>
                )}
            </div>
        </div>
    );
    
    
};

export default Insurance;

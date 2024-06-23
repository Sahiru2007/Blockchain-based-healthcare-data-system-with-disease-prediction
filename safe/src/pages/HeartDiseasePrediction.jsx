import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CSVLink } from 'react-csv';

function HeartDiseaseForm() {
    const [formData, setFormData] = useState({
        age: '',
        sex: '1 = male; 0 = female',
        cp: 'Chest pain type (1-4)',
        trestbps: 'Resting blood pressure',
        chol: 'Serum cholestoral in mg/dl',
        fbs: 'Fasting blood sugar > 120 mg/dl (1 = true; 0 = false)',
        restecg: 'Resting electrocardiographic results (0-2)',
        thalach: 'Maximum heart rate achieved',
        exang: 'Exercise induced angina (1 = yes; 0 = no)',
        oldpeak: 'ST depression induced by exercise relative to rest',
        slope: 'The slope of the peak exercise ST segment',
        ca: 'Number of major vessels (0-3) colored by flourosopy',
        thal: '3 = normal; 6 = fixed defect; 7 = reversable defect'
    });

    const [prediction, setPrediction] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:5000/predictHeartDisease/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        const advice = data.prediction ? 'Please consult a cardiologist immediately for further evaluation and treatment.' : 'Continue maintaining a healthy lifestyle and schedule regular check-ups.';
        setPrediction({
            message: `Prediction: ${data.prediction ? 'Likely a heart disease' : 'Do not have a heart disease'}`,
            hasDisease: data.prediction,
            advice: advice
        });
    };

    const downloadPDF = async () => {
        const input = document.getElementById('report');
        input.style.display = 'block';
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, 595.28, 841.89);
        pdf.save('Heart_Disease_Prediction_Report.pdf');
        input.style.display = 'none';
    };

    const jsonData = {
        ...formData,
        prediction: prediction.message,
        advice: prediction.advice
    };

    const csvData = [
        ['Field', 'Value'],
        ...Object.entries(formData),
        ['Prediction', prediction.message],
        ['Advice', prediction.advice]
    ];

    return (
        <div className="flex flex-col items-center justify-start pt-10 dark:bg-main-dark-bg min-h-screen p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
                <h1 className='text-white' style={{fontSize: '24px'}}>Heart Disease Prediction</h1>
                <p className='text-gray-400'>This Heart Disease Prediction model will determine whether an individual has a heart disease or not with an accuracy of 81.4%</p>
                <br />
                <div className="flex flex-wrap -m-4">
                    {Object.entries(formData).map(([key, placeholder]) => (
                        <div key={key} className="p-2 w-1/3 mb-6">
                            <label htmlFor={key} className="block text-sm font-medium mb-1">
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </label>
                            <input type="text"
                                   name={key}
                                   id={key}
                                   required
                                   placeholder={placeholder}
                                   onChange={handleChange}
                                   className="mt-1 block w-full rounded-md bg-white border-gray-300 shadow-sm text-gray-700 h-12 pl-3 pr-3"/>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-4">
                    <button type="submit" className="bg-teal-600 text-white font-bold p-3 rounded hover:bg-teal-700 transition duration-300">
                        Predict
                    </button>
                </div>
            </form>
            {prediction && (
                <div className={`mt-4 p-4 text-lg font-semibold rounded-md w-full md:w-1200 mx-auto ${prediction.hasDisease ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
                    {prediction.message}
                   
                    <div className="flex justify-center mt-4">
                        <button onClick={downloadPDF} className="bg-blue-600 text-white font-bold p-3 rounded mr-2 hover:bg-blue-700 transition duration-300">
                            Download PDF
                        </button>
                        <CSVLink data={csvData} filename="Heart_Disease_Prediction_Report.csv" className="bg-blue-600 text-white font-bold p-3 rounded mr-2 hover:bg-blue-700 transition duration-300">
                            Download CSV
                        </CSVLink>
                        <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jsonData, null, 2))}`}
                           download="Heart_Disease_Prediction_Report.json"
                           className="bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-700 transition duration-300">
                            Download JSON
                        </a>
                    </div>
                </div>
            )}
            <div id="report" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', display: 'none' }}>
                <div style={{ backgroundColor: '#ddeeff', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
                    <img src="https://images.unsplash.com/photo-1588417263878-2f4b02ba8c0e" alt="Medical Header" style={{ width: '100px', float: 'left', marginRight: '10px' }} />
                    <h1 style={{ color: '#003366' }}>Vital Guard Hospital</h1>
                    <h2 style={{ color: '#003366' }}>Heart Disease Prediction Report</h2>
                </div>
                <h3 style={{ color: '#003366' }}>Patient Information:</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Name:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.name}</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Age:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.age}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Sex:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.sex === '1' ? 'Male' : 'Female'}</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Chest Pain Type:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.cp}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Resting Blood Pressure:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.trestbps}</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Cholesterol:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.chol}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Fasting Blood Sugar:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.fbs}</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Resting ECG:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.restecg}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Max Heart Rate:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.thalach}</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Exercise Induced Angina:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.exang}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>ST Depression:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.oldpeak}</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Slope:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.slope}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Number of Major Vessels:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.ca}</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>Thalassemia:</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{formData.thal}</td>
                        </tr>
                    </tbody>
                </table>
                <h3 style={{ color: '#003366' }}>Prediction:</h3>
                <p>{prediction.message}</p>
                <h3 style={{ color: '#003366' }}>Advice:</h3>
                <p>{prediction.advice}</p>
                <div style={{ backgroundColor: '#ddeeff', padding: '10px', borderRadius: '5px', marginTop: '20px' }}>
                    <img src="https://images.unsplash.com/photo-1588417263878-2f4b02ba8c0e" alt="Medical Footer" style={{ width: '100px', float: 'left', marginRight: '10px' }} />
                    <p style={{ color: '#003366' }}>Vital Guard Hospital, 123 Main Street, City, State, ZIP</p>
                    <p style={{ color: '#003366' }}>Phone: (123) 456-7890 | Email: info@vitalguardhospital.com</p>
                </div>
            </div>
        </div>
    );
}

export default HeartDiseaseForm;

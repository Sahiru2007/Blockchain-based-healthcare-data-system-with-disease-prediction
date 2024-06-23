import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CSVLink } from 'react-csv';

function Diabetes() {
  const [formData, setFormData] = useState({
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: '',
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/predictDiabetes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    const advice = data.prediction ? 'Please consult an endocrinologist for further evaluation and treatment.' : 'Continue maintaining a healthy lifestyle and schedule regular check-ups.';
    setPrediction({
        message: `Prediction: ${data.prediction ? 'Diabetic' : 'Not Diabetic'}`,
        isDiabetic: data.prediction,
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
    pdf.save('Diabetes_Prediction_Report.pdf');
    input.style.display = 'none';
  };

  const jsonData = prediction ? {
    ...formData,
    prediction: prediction.message,
    advice: prediction.advice
  } : {};

  const csvData = [
    ['Field', 'Value'],
    ...Object.entries(formData),
    ['Prediction', prediction ? prediction.message : ''],
    ['Advice', prediction ? prediction.advice : '']
  ];

  return (
    <div className="flex flex-col items-center justify-start pt-10 dark:bg-main-dark-bg min-h-screen p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
        <h1 className='text-white' style={{fontSize: '24px'}}>Diabetes Prediction</h1>
        <p className='text-gray-400'>This Diabetes Prediction model will determine whether an individual has diabetes or not with an accuracy of 85.2%</p>
        <br />
        <div className="flex flex-wrap -m-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="p-2 w-1/3 mb-6">
              <label htmlFor={key} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </label>
              <input type="text"
                     name={key}
                     id={key}
                     value={formData[key]}
                     onChange={handleChange}
                     required
                     placeholder={key} // Placeholder is the same as the key for simplicity, adjust if needed
                     className="mt-1 block w-full rounded-md bg-white border-gray-300 shadow-sm text-gray-700 h-12 pl-3 pr-3"/>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition duration-300">
            Predict
          </button>
        </div>
      </form>
      {prediction && (
        <div className={`mt-4 p-4 text-lg font-semibold rounded-md w-full md:w-1200 mx-auto ${prediction.isDiabetic ? 'bg-red-500 bg-opacity-30 text-red-700' : 'bg-green-500 bg-opacity-50 text-green-700'}`}>
          {prediction.message}
          <p>{prediction.advice}</p>
          <div className="flex justify-center mt-4">
            <button onClick={downloadPDF} className="bg-blue-600 text-white font-bold p-3 rounded mr-2 hover:bg-blue-700 transition duration-300">
              Download PDF
            </button>
            <CSVLink data={csvData} filename="Diabetes_Prediction_Report.csv" className="bg-blue-600 text-white font-bold p-3 rounded mr-2 hover:bg-blue-700 transition duration-300">
              Download CSV
            </CSVLink>
            <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jsonData, null, 2))}`}
               download="Diabetes_Prediction_Report.json"
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
          <h2 style={{ color: '#003366' }}>Diabetes Prediction Report</h2>
        </div>
        <h3 style={{ color: '#003366' }}>Patient Information:</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <tbody>
            {Object.entries(formData).map(([key, value]) => (
              <tr key={key}>
                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{key}:</td>
                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {prediction && (
          <>
            <h3 style={{ color: '#003366' }}>Prediction:</h3>
            <p>{prediction.message}</p>
            <h3 style={{ color: '#003366' }}>Advice:</h3>
            <p>{prediction.advice}</p>
          </>
        )}
        <div style={{ backgroundColor: '#ddeeff', padding: '10px', borderRadius: '5px', marginTop: '20px' }}>
          <img src="https://images.unsplash.com/photo-1588417263878-2f4b02ba8c0e" alt="Medical Footer" style={{ width: '100px', float: 'left', marginRight: '10px' }} />
          <p style={{ color: '#003366' }}>Vital Guard Hospital, 123 Main Street, City, State, ZIP</p>
          <p style={{ color: '#003366' }}>Phone: (123) 456-7890 | Email: info@vitalguardhospital.com</p>
        </div>
      </div>
    </div>
  );
}

export default Diabetes;

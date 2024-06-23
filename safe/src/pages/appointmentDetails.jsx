import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import { useCookies } from 'react-cookie';
import contract from '../contracts/contract.json';
import '../table.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(
    contract["abi"],
    contract["address"]
  );
  const [cookies] = useCookies();
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState("");

  useEffect(() => {
    const hash = cookies['hash'];
    fetch(`http://localhost:8080/ipfs/${hash}`)
      .then(res => res.json())
      .then(res => {
        setEmail(res.mail);
        console.log(res)
      })
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8050/api/appointments/getAllAppointments`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setAppointments(data);
          setLoading(false);
        } else {
          console.error('Failed to fetch appointments:', response.statusText);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    if (startDate && endDate) {
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
      });
    }

    if (status) {
      filtered = filtered.filter(appointment => appointment.status === status);
    }

    if (mode) {
      filtered = filtered.filter(appointment => appointment.mode === mode);
    }

    setFilteredAppointments(filtered);
  }, [appointments, startDate, endDate, status, mode]);

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAppointments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'appointments_report.xlsx');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Appointments Report", 20, 10);
    doc.autoTable({
      head: [['Patient Email', 'Patient Name', 'Contact', 'Date', 'Time', 'Mode', 'Status', 'Room ID', 'Payment Amount', 'Payment Method', 'Payment Status']],
      body: filteredAppointments.map(appointment => [
        appointment.patientEmail,
        appointment.patientName,
        appointment.patientContactNo,
        new Date(appointment.date).toISOString().split('T')[0],
        appointment.time,
        appointment.mode,
        appointment.status,
        appointment.roomID,
        appointment.paymentAmount,
        appointment.paymentMethod,
        "Payed",
      ]),
    });
    doc.save('appointments_report.pdf');
  };

  return (
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
      <h1 className='text-black text-3xl font-bold mb-6'>All Appointments</h1>
      <div className="flex justify-between mb-4">
        <div className="flex">
          <div className="mr-4">
            <label className="mr-2 text-black">Start Date:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-4 py-2 rounded border border-gray-300 text-black" />
          </div>
          <div className="mr-4">
            <label className="mr-2 text-black">End Date:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-4 py-2 rounded border border-gray-300 text-black" />
          </div>
        </div>
        <div className="flex">
          <div className="mr-4">
            <label className="mr-2 text-black">Status:</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="px-4 py-2 rounded border border-gray-300 text-black">
              <option value="">All</option>
              <option value="RequestPending">RequestPending</option>
              <option value="RequestAccepted">RequestAccepted</option>
              <option value="RequestDenied">RequestDenied</option>
              <option value="AppointmentFinalized">AppointmentFinalized</option>
              <option value="RequestCanceled">RequestCanceled</option>
            </select>
          </div>
          <div className="mr-4">
            <label className="mr-2 text-black">Mode:</label>
            <select value={mode} onChange={e => setMode(e.target.value)} className="px-4 py-2 rounded border border-gray-300 text-black">
              <option value="">All</option>
              <option value="In-person">In-person</option>
              <option value="Online">Online</option>
            </select>
          </div>
        </div>
        <div className="flex">
          <button onClick={handleDownloadExcel} className="bg-[#00897b] text-white px-4 py-2 rounded mr-2">Download Excel</button>
          <button onClick={handleDownloadPDF} className="bg-[#00897b] text-white px-4 py-2 rounded">Download PDF</button>
        </div>
      </div>
      {loading ? (
        <p className="text-black">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="modernTable w-full">
            <thead>
              <tr>
                <th>Patient Email</th>
                <th>Patient Name</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Time</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Room ID</th>
                <th>Payment Amount</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.patientEmail}</td>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.patientContactNo}</td>
                  <td>{new Date(appointment.date).toISOString().split('T')[0]}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.mode}</td>
                  <td>{appointment.status}</td>
                  <td>{appointment.roomID}</td>
                  <td>{appointment.paymentAmount}</td>
                  <td>{appointment.paymentMethod}</td>
                  <td>{appointment.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;

import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import { useCookies } from 'react-cookie';
import contract from '../contracts/contract.json';
import '../table.css';
const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(contract["abi"], contract["address"]);
  const [cookies, setCookie] = useCookies();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    const hash = cookies['hash'];
    fetch(`http://localhost:8080/ipfs/${hash}`)
      .then(res => res.json())
      .then(res => {
        setName(res.name);
        setEmail(res.mail);
        setPassword(res.password);
        setContactNumber(res.contactNumber);
        console.log(res);
      });
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8050/api/appointments/patient/${email}`);
        if (response.ok) {
          const data = await response.json();
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

    if (email) {
      fetchAppointments();
    }
  }, [email]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'RequestPending': return { color: '#FFA500' }; // yellow
      case 'RequestDenied': return { color: '#FF0000' }; // red
      case 'RequestAccepted': return { color: '#008000' }; // green
      default: return { color: '#FFFFFF' }; // white for unknown status
    }
  };
  const statusIndicator = (status) => ({
    height: '10px',
    width: '10px',
    borderRadius: '50%',
    display: 'inline-block',
    marginLeft: '10px',
    backgroundColor: {
      'RequestPending': '#FFA500', // Yellow
      'RequestDenied': '#FF0000', // Red
      'RequestAccepted': '#008000', // Green
    }[status] || '#FFFFFF', // Default to white if status is unknown
  });
  const formatStatusText = (status) => {
    // Insert a space before all caps except for the first character
    return status.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
      <h1 className='text-white ' style={{fontSize: '20pt'}}>Pending Appointments</h1>
      <table className="modernTable">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Specialization</th>
            <th>Date</th>
            <th>Time</th>
            <th>Mode</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index}>
            <td>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={`http://localhost:8050/${appointment.doctorID.profilePicture}`} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
              <span>{appointment.doctorID.name}</span>
            </div>
          </td>
          
              <td>{appointment.specialization}</td>
              <td>{new Date(appointment.date).toISOString().split('T')[0]}</td>
              <td>{appointment.time}</td>
              <td>{appointment.mode}</td>
              <td>{appointment.description}</td>
             <td>
  <div className="doctorInfo">
    <span className={`statusIndicator ${appointment.status}`}></span>
    {formatStatusText(appointment.status)}
  </div>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
/*<td style={{ ...tdStyle, justifyContent: 'space-between' }}>
{appointment.status.replace(/([a-z])([A-Z])/g, '$1 $2')}
<span style={statusIndicator(appointment.status)}></span>
</td> */

export default Appointments;
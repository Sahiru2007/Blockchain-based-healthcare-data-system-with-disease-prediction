import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import { useCookies } from 'react-cookie';
import contract from '../contracts/contract.json';
import '../table.css';
import { FaVideo } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { useHistory } from 'react-router-dom'; // Import useHistory hook
import { TiCancel } from "react-icons/ti";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(
    contract["abi"],
    contract["address"]
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cookies, setCookie] = useCookies();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [meetingID, setmeetingID] = useState("");


function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}




  useEffect(() => {
    const hash = cookies['hash'];
    fetch(`http://localhost:8080/ipfs/${hash}`)
      .then(res => res.json())
      .then(res => {
        setName(res.name);
        setEmail(res.mail);
        setPassword(res.password);
        setContactNumber(res.contactNumber)
        console.log(res)
      })
      
  }, []); 

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8050/api/appointments/doctor/${email}`);
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
  
    const fetchAcceptedAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8050/api/appointments/acceptedAppointments/${email}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setAcceptedAppointments(data);
          setLoading(false);
        } else {
          console.error('Failed to fetch accepted appointments:', response.statusText);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching accepted appointments:', error);
        setLoading(false);
      }
    };
  
    if (email) { 
      fetchAppointments();
      fetchAcceptedAppointments();
    }
  }, [email]);
  useEffect(() => {
    console.log("Updated meetingID:", meetingID);
  }, [meetingID]);
  
  const handleAccept = async (appointmentId, mode) => {
    try {
      let requestBody = {
        method: 'PUT'
      };

      if (mode === "Online") {
        const roomID = randomID(); // Generate roomID if mode is Online
        requestBody.body = JSON.stringify({ roomID }); // Send roomID in the request body
        requestBody.headers = {
          'Content-Type': 'application/json'
        };
      }

      const response = await fetch(`http://localhost:8050/api/appointments/acceptAppointment/${appointmentId}`, requestBody);
      if (response.ok) {
        // Handle success
      } else {
        console.error('Failed to accept appointment');
      }
    } catch (error) {
      console.error('Error accepting appointment:', error);
    }
  };
;

  const handleDeny = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8050/api/appointments/denyAppointment/${appointmentId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        // Handle success
      } else {
        console.error('Failed to deny appointment');
      }
    } catch (error) {
      console.error('Error denying appointment:', error);
    }
  };
  const handleFinalize = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8050/api/appointments/finalizeAppointment/${appointmentId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        // Handle success
      } else {
        console.error('Failed to deny appointment');
      }
    } catch (error) {
      console.error('Error denying appointment:', error);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8050/api/appointments/cancelAppointment/${appointmentId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        // Handle success
      } else {
        console.error('Failed to deny appointment');
      }
    } catch (error) {
      console.error('Error denying appointment:', error);
    }
  };
  // Function to trigger notifications
async function triggerNotifications(appointmentID, meetingID) {
  try {
    const response = await fetch(`http://localhost:8050/api/meetings/notifyPatient/${appointmentID}/${meetingID}`, {
      method: 'POST', // or 'GET', depending on how your backend expects to receive the request
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as required, like authorization headers
      },
      // No need to send body if the request method is GET
      // body: JSON.stringify({ appointmentID }), // Uncomment and adjust if your API expects a body
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Notification triggered successfully:', data);
    // Further actions upon successful notification trigger, if necessary
  } catch (error) {
    console.error('Error triggering notifications:', error);
  }
}

  const MeetingData = async (appointmentID) => {
    console.log(appointmentID)
    if (appointmentID) {
      try {
        const response = await fetch(`http://localhost:8050/api/meetings/createMeeting/${appointmentID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Meeting created successfully:', data);
          const meeting = data.meeting._id;
          console.log(meeting)
          setmeetingID(data.meeting._id)
          console.log(meetingID)
          // Handle success cases here
        } else {
          console.error('Failed to create meeting:', response.statusText);
          // Handle error cases here
        }
      } catch (error) {
        console.error('Error creating meeting:', error);
        // Handle error cases here
      }
    } else {
      console.log("appointment data hasn't been loaded yet")
    }
  };
  return (
    <div>
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
      <h1 className='text-white text-3xl font-bold mb-6'>Appointment Requests</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="modernTable w-full">
            <thead>
              <tr>
                <th>Patient Email</th>
                <th>Patient Name</th>
                <th>Contact </th>
                <th>Date</th>
                <th>Time</th>
                <th>Mode</th>
                <th>Description</th>
                <th style={{width:'200px'}}>Action</th>

              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.patientEmail}</td>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.patientContactNo}</td>
                  <td>{new Date(appointment.date).toISOString().split('T')[0]}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.mode}</td>
                  <td>{appointment.description}</td>
                  <td>
                    {/* Buttons for accept and deny */}
                    <button className="text-white bg-green-600 hover:bg-green-700 ml-3 focus:outline-none focus:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:bg-red-700"  onClick={() => handleAccept(appointment._id, appointment.mode)}><TiTick /></button>
                    <button  className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:bg-red-700" onClick={() => handleDeny(appointment._id)}><TiCancel /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full md:w-1200 mb-4 mx-auto">
      <h1 className='text-white text-3xl font-bold mb-6'>Active Appointments</h1>
      {loading ? (
        <p>Loading...</p>
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
                <th>Description</th>
                <th>Room ID</th>
                <th style={{width:'250px'}}>Action</th>

              </tr>
            </thead>
            <tbody>
              {acceptedAppointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.patientEmail}</td>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.patientContactNo}</td>
                  <td>{new Date(appointment.date).toISOString().split('T')[0]}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.mode}</td>
                  <td>{appointment.description}</td>
                  <td>{appointment.roomID}</td>
                  <td>
                {/*
<button className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:bg-blue-700  font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:bg-green-700" onClick={() => {}}><AiFillMessage /></button>
*/}
 {appointment.mode === "Online" && (
        <button
          className="text-white ml-5 bg-green-600 hover:bg-green-700 focus:outline-none focus:bg-green-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:bg-green-700"
          onClick={async () => {
            try {
              // Create a new meeting and wait for meetingID to be set
              await MeetingData(appointment._id);
             
              // Once meetingID is set, construct the URL with room ID, doctor's name, and meetingID
              const url = `http://localhost:3000/videoCall/${appointment.roomID}/${name}/doctor/${appointment._id}/${meetingID}`;
              await triggerNotifications(appointment._id, meetingID);
              // Open the URL in a new window
              window.open(url, '_blank');
            } catch (error) {
              console.error('Error creating meeting:', error);
            }
          }}
        >
          <FaVideo />
        </button>
      )}




                <button className="text-white ml-5 bg-red-600 hover:bg-red-700 focus:outline-none focus:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:bg-red-700" onClick={() => handleCancel(appointment._id)}><TiCancel /></button>
                <button className="text-white bg-green-600 hover:bg-green-700 ml-3 focus:outline-none focus:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:bg-red-700"  onClick={() => handleFinalize(appointment._id)}><TiTick /></button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>

  );
};

export default Appointments;

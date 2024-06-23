import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import { useCookies } from 'react-cookie';
import contract from '../contracts/contract.json';
import Modal from 'react-modal';
import '../table.css';
import '../details.css';

// Updated custom styles for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#2C2F36', // Dark background for the modal content
    color: '#FFF', // White text color for readability
    borderRadius: '10px',
    border: '1px solid #444',
    padding: '20px',
    maxWidth: '600px',
    width: '90%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark overlay
  },
};

Modal.setAppElement('#root'); // Assuming the root element of your app has the ID 'root'

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const web3 = new Web3(window.ethereum);
  const myContract = new web3.eth.Contract(contract["abi"], contract["address"]);
  const [cookies] = useCookies(['hash']);
  const [email, setEmail] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const hash = cookies['hash'];
    fetch(`http://localhost:8080/ipfs/${hash}`)
      .then(res => res.json())
      .then(({ mail }) => {
        setEmail(mail);
      });
  }, [cookies]);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (email) {
        try {
          const response = await fetch(`http://localhost:8050/api/meetings/doctor/${email}`);
          if (response.ok) {
            const data = await response.json();
            setMeetings(data);
          } else {
            console.error('Failed to fetch appointments:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching appointments:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMeetings();
  }, [email]);

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      alert("Copied to clipboard");
    }, (err) => {
      console.error('Error copying text: ', err);
    });
  };

  return (
    <div className="appointments-container">
      <h1 className='session-title text-white'>Telemedicine Sessions</h1>
      <div className="table-container">
        <table className="modernTable appointment-table">
          <thead>
            <tr>
              <th>Patient Email</th>
              <th>Time</th>
              <th>Actions</th> {/* Updated to include "Actions" header */}
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting, index) => (
              <tr key={index}>
                <td>{meeting.patientEmail}</td>
                <td>{new Date(meeting.time).toLocaleString()}</td>
                <td> {/* Combined "View Summary" and "View Transcript" under "Actions" */}
                  <button onClick={() => openModal('Summary', meeting.summary)}>View Summary</button>
                  <button onClick={() => openModal('Transcript', meeting.transcription)}>View Transcript</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <p>Loading...</p>}

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Meeting Detail" style={customStyles}>
        <h2 style={{ color: '#FFF' }}>{modalTitle}</h2> {/* Ensured modal title is white */}
        <p>{modalContent}</p>
        <button onClick={() => copyToClipboard(modalContent)}>Copy</button>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Appointments;

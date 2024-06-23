import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaVideo, FaUser } from 'react-icons/fa';
import Calendar from 'react-calendar';
import '../custom_calender.css';
import { FaArrowLeft, FaCheck, FaArrowRight } from 'react-icons/fa';
import { 
  FaStethoscope, FaHeartbeat, FaBrain, FaBone, FaEye, FaSearch, 
  FaBaby, FaAllergies, FaRadiationAlt, FaVirus, Fasearch,
  FaSyringe, FaTablets, FaXRay, FaMicroscope, FaShieldVirus, FaUserNurse
} from 'react-icons/fa';
import Web3 from "web3";
import { useCookies } from 'react-cookie';
import contract from '../contracts/contract.json';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { loadStripe } from '@stripe/stripe-js';

const specializations = [
  "Primary Care",
  "Surgery",
  "Internal Medicine",
  "Pediatrics",
  "Obstetrics and Gynecology",
  "Psychiatry",
  "Dermatology",
  "Ophthalmology",
  "Orthopedics",
  "Neurology",
  "Cardiology",
  "Gastroenterology",
  "Pulmonology",
  "Nephrology",
  "Endocrinology",
  "Radiology",
  "Pathology",
  "Allergy and Immunology",
  "Infectious Diseases",
  "Emergency Medicine"
];
const baseFee = 5000; // Hypothetical base fee in LKR for a 1-hour consultation in primary care

const specializationPricing = {
  "Primary Care": 1.0, // No additional multiplier
  "Surgery": 1.8,
  "Internal Medicine": 1.3,
  "Pediatrics": 1.2,
  "Obstetrics and Gynecology": 1.5,
  "Psychiatry": 1.4,
  "Dermatology": 1.4,
  "Ophthalmology": 1.3,
  "Orthopedics": 1.5,
  "Neurology": 1.6,
  "Cardiology": 1.7,
  "Gastroenterology": 1.3,
  "Pulmonology": 1.2,
  "Nephrology": 1.3,
  "Endocrinology": 1.2,
  "Radiology": 1.5,
  "Pathology": 1.1,
  "Allergy and Immunology": 1.2,
  "Infectious Diseases": 1.3,
  "Emergency Medicine": 1.5,
  // Add other specializations as needed
};

const specializationIcons = {
  "Primary Care": <FaUserNurse />,
  "Surgery": <FaSyringe />,
  "Internal Medicine": <FaStethoscope />,
  "Pediatrics": <FaBaby />,
  "Obstetrics and Gynecology": <FaBaby />,
  "Psychiatry": <FaBrain />,
  // Since FaSkin isn't available, you can use a general icon for Dermatology or an alternative
  "Dermatology": <FaUserNurse />, // Alternative suggestion
  "Ophthalmology": <FaEye />,
  "Orthopedics": <FaBone />,
  "Neurology": <FaBrain />,
  "Cardiology": <FaHeartbeat />,
  "Gastroenterology": <FaTablets />,
  // Add other specializations as needed with available icons
  "Default": <FaStethoscope /> // Default icon for any unspecified specialization
};

const times = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 AM', '1:00 PM', '1:30 AM', '2:00 PM', '2:30 AM',
  '3:00 PM', '3:30 AM', '4:00 PM', '4:30 AM', '5:00 PM'
];

const ProgressBar = ({ stages, currentStage }) => {
  const totalStages = stages.length;
  const currentStageIndex = stages.indexOf(currentStage);
  const progressPercentage = ((currentStageIndex + 1) / totalStages) * 100;

  return (
    <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
      <div
        className="bg-blue-500 h-4 rounded-full"
        style={{ width: `${progressPercentage}%`, transition: 'width 0.3s' }}
      />
    </div>
  );
};

const ModeButton = ({ mode, selectedMode, setSelectedMode }) => {
  const icons = {
    Online: <FaVideo />,
    Physical: <FaUser />,
  };
  const descriptions = {
    Online: "Consult from anywhere.",
    "In-person": "Visit us in person.",
  };

  return (
    <button
      className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-md text-lg ${
        selectedMode === mode ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
      } transition-colors duration-300`}
      onClick={() => setSelectedMode(mode)}
    >
      <span className="text-2xl">{icons[mode]}</span>
      <div>
        <div>{mode}</div>
        <div className="text-sm text-gray-400">{descriptions[mode]}</div>
      </div>
    </button>
  );
};

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
};

const AppointmentBooking = () => {
  const [stage, setStage] = useState('home'); // Using descriptive stage names
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [stripe, setStripe] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [Payment, setPayment] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState({
    description: '',
    mode: ''
  });
  const [value, onChange] = useState(new Date());
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const stages = ['home', 'selectSpecialization', 'selectDate', 'viewDoctors', 'paymentSelection', 'appointmentDetails', 'paymentSelection', 'confirmation'];

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const initializeStripe = async () => {
    try {
      const stripeKey = 'pk_test_51OaK8GIHxKiWcbbg97KaguBIGQhZnbfUF3YV77LXPFzLsijL0sqJswWSwClIO3GEVMpFTsd77WQo1JxxhHcrPW6W00KdYpfNWO';
      const stripeObject = await loadStripe(stripeKey);
      setStripe(stripeObject);
      console.log("done");
    } catch (error) {
      console.error('Error initializing Stripe:', error.message || error);
    }
  };

  useEffect(() => {
    initializeStripe();
    const savedDetails = sessionStorage.getItem('appointmentDetails');
    const savedStage = sessionStorage.getItem('bookingStage');
    if (savedDetails) {
      const details = JSON.parse(savedDetails);
      setSelectedSpecialization(details.selectedSpecialization);
      setSelectedDate(new Date(details.selectedDate));
      setSelectedTime(details.selectedTime);
      setSelectedDoctor(details.selectedDoctor);
      setPayment(details.Payment);
      setSelectedMode(details.selectedMode);
      setAppointmentDetails(details.appointmentDetails);
      setPaymentMethod(details.paymentMethod);
    }
    if (savedStage) {
      setStage(savedStage);
    }

    const fetchDoctorData = async () => {
      try {
        const response = await fetch(`http://localhost:8050/api/appointments/getDoctors`);
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
          console.log(data);
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };
    fetchDoctorData();
  }, []);

  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(contract["abi"], contract["address"]);
  const [cookies, setCookie] = useCookies();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");

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
  });

  const saveAppointmentDetails = () => {
    const detailsToSave = {
      selectedSpecialization,
      selectedDate: selectedDate.toString(),
      selectedDoctor,
      selectedTime,
      selectedMode,
      appointmentDetails,
      Payment,
      paymentMethod,
    };
    sessionStorage.setItem('appointmentDetails', JSON.stringify(detailsToSave));
    sessionStorage.setItem('bookingStage', stage);
  };

  const handleBuyClick = async () => {
    saveAppointmentDetails();
    if (stripe) {
      try {
        sessionStorage.setItem('bookingStage', 'appointmentDetails');
        const response = await fetch('http://localhost:8050/api/payments/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment: Payment }),
        });

        if (!response.ok) {
          let errorMessage = '';
          try {
            const errorResponse = await response.json();
            errorMessage = errorResponse.error;
          } catch (jsonError) {
            errorMessage = 'An unexpected error occurred.';
          }
          throw new Error(errorMessage);
        }

        const session = await response.json();
        await stripe.redirectToCheckout({ sessionId: session.id });
      } catch (error) {
        console.error('Error:', error.message || error);
      }
    } else {
      console.error('Stripe.js not loaded');
    }
  };

  const calculateAppointmentFee = (specialization) => {
    const multiplier = specializationPricing[specialization] || 1.0;
    const payment = baseFee * multiplier;
    setPayment(payment);
  };

  const goToNextStage = () => {
    const currentIndex = stages.findIndex((current) => current === stage);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setStage(nextStage);
    }
  };

  const goToPreviousStage = () => {
    const currentIndex = stages.findIndex((current) => current === stage);
    if (currentIndex > 0) {
      const prevStage = stages[currentIndex - 1];
      setStage(prevStage);
    }
  };

  const getFilteredDoctors = () => doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderHomeStage = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#21232a] text-gray-200 animate-fadeInScaleUp ">
        <h1 className="text-6xl font-bold mb-4 text-teal-400">Welcome to Vital Guard</h1>
        <p className="text-xl mb-8 max-w-md text-center text-gray-300">Begin your journey towards better health. Conveniently book appointments with top specialists.</p>
        <button
          onClick={() => setStage('selectSpecialization')}
          className="bg-gradient-to-r from-teal-500 to-teal-400 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl"
        >
          Start Booking Process
        </button>
      </div>
    );
  };

  const renderSpecializationSelection = () => {
    const handleSpecializationSelection = (spec) => {
      setStage('selectDate');
      console.log('Selected specialization:', spec);
      setSelectedSpecialization(spec);
      calculateAppointmentFee(spec);
    };

    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#21232a] text-white animate-fadeInScaleUp">
        <h2 className="text-3xl font-bold mb-6 text-white">Select a Specialization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specializations.map((spec) => (
            <div
              key={spec}
              className="flex items-center border border-gray-600 rounded-lg p-4 shadow-lg cursor-pointer hover:bg-gray-500 transition-colors duration-300 space-x-4 text-white"
              onClick={() => handleSpecializationSelection(spec)}
            >
              <div className="text-2xl text-white">
                {specializationIcons[spec] || specializationIcons["Default"]}
              </div>
              <h3 className="text-xl font-semibold text-white">{spec}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDateSelection = () => {
    const modes = [
      { type: "Online", icon: <FaVideo />, description: "Consult from anywhere." },
      { type: "In-person", icon: <FaUser />, description: "Visit us in person." },
    ];

    return (
      <div className="flex flex-col md:flex-row items-start justify-center min-h-screen bg-[#21232a] p-4 text-white">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <h2 className="text-3xl font-bold mb-6 text-gray-200">Select a Date</h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            inline
            minDate={new Date()}
            className="react-datepicker-custom w-full text-white"
          />
          <div className="flex flex-wrap gap-2 mt-4">
            {times.map((time) => (
              <button
                key={time}
                className={`text-sm md:text-base lg:text-lg px-4 py-2 rounded-full ${selectedTime === time ? 'bg-blue-500' : 'bg-gray-700'}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/3 mt-10 md:mt-0 md:ml-10">
          <h2 className="text-3xl font-bold mb-6 text-white">Select Mode</h2>
          {modes.map((mode) => (
            <div key={mode.type} className="mb-4">
              <button
                className={`flex items-center gap-2 w-full text-left h-full px-4 py-3 w-full rounded-lg text-lg ${selectedMode === mode.type ? 'bg-blue-500' : 'bg-gray-700'}`}
                onClick={() => setSelectedMode(mode.type)}
              >
                {mode.icon}
                <div>
                  <div>{mode.type}</div>
                  <div className="text-sm text-gray-400">{mode.description}</div>
                </div>
              </button>
            </div>
          ))}
          <div className="text-right mt-6">
            <button
              className="bg-teal-600 text-white font-bold p-3 rounded hover:bg-teal-700 transition duration-300"
              onClick={() => {
                if (selectedDate && selectedTime && selectedMode) {
                  setStage('viewDoctors');
                } else {
                  alert("Please select date, time, and mode to continue.");
                }
              }}
            >
              Continue to next step
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDoctorSelection = () => {
    const filteredDoctors = getFilteredDoctors();

    const handleCardClick = (doctor) => {
      setSelectedDoctor(doctor);
      goToNextStage();
    };

    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#21232a] text-white animate-fadeInScaleUp">
        <div className="w-full max-w-md mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded leading-tight pl-10"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const profilePicUrl = doctor.profilePicture
              ? `http://localhost:8050/${doctor.profilePicture}`
              : 'https://via.placeholder.com/150';

            return (
              <div
                key={doctor._id}
                className="doctor-card bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer"
                style={{ width: '300px', height: '500px' }}
                onClick={() => handleCardClick(doctor)}
              >
                <div className="doctor-card-inner relative w-full h-full text-center">
                  <div className="doctor-card-front absolute w-full h-full flex flex-col items-center justify-center p-4">
                    <img
                      src={profilePicUrl}
                      alt={`${doctor.name} profile`}
                      className="rounded-full border-4 border-green-500 mx-auto"
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                    <h3 className="text-xl font-bold text-white mt-4">{doctor.name}</h3>
                    <p className="text-blue-400">{doctor.specialization}</p>
                    <div className="mt-4 inline-block bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                      Contact No: {doctor.contactNumber}
                    </div>
                    <button
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.currentTarget.parentNode.parentNode.style.transform = 'rotateY(180deg)';
                      }}
                    >
                      View More
                    </button>
                  </div>
                  <div className="doctor-card-back absolute w-full h-full bg-gray-700 rounded-xl transform rotateY-180 flex flex-col items-center justify-center p-4">
                    <button
                      className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.currentTarget.parentNode.parentNode.style.transform = '';
                      }}
                    >
                      Close
                    </button>
                    <p className="text-white text-sm p-2">{doctor.biography || 'No biography provided'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAppointmentDetails = () => {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#21232a] text-white animate-fadeInScaleUp mt-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Confirm Your Appointment</h2>
          <p className="text-lg text-gray-400 mb-6">Please provide a brief description of your reason for the visit.</p>
        </div>

        <div className="w-full max-w-lg">
          <textarea
            placeholder="Describe the reason for your appointment..."
            className="w-full bg-gray-700 text-white rounded-lg p-4 mb-8 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={appointmentDetails.description}
            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, description: e.target.value })}
          />

          <div className="text-center">
            <button
              onClick={() => submitAppointmentRequest()}
              className="text-lg py-3 px-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full font-bold text-white shadow-lg hover:from-blue-600 hover:to-green-600 transition duration-300 ease-in-out"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#21232a] p-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-green-400 mb-6">Success!</h2>
          <p className="flex items-center justify-center text-white text-xl mb-8">
            <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Your appointment request has been submitted successfully.
          </p>
          <p className="text-gray-400 mb-10">You will receive a confirmation shortly. Thank you for choosing us.</p>
          <button
            onClick={() => setStage('home')}
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out"
          >
            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path></svg>
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  };

  const submitAppointmentRequest = async () => {
    try {
      let paymentStatus = "NotPaid";
      if (paymentMethod === "Online") {
        paymentStatus = "Paid";
      }

      const response = await fetch('http://localhost:8050/api/appointments/createAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientEmail: email,
          patientName: name,
          patientContactNo: contactNumber,
          doctorID: selectedDoctor._id,
          doctorEmail: selectedDoctor.email,
          specialization: selectedSpecialization,
          date: selectedDate,
          time: selectedTime,
          mode: selectedMode,
          description: appointmentDetails.description,
          status: "RequestPending",
          paymentAmount: Payment,
          paymentMethod: paymentMethod,
          paymentStatus: paymentStatus
        })
      });

      if (response.ok) {
        sessionStorage.removeItem('appointmentDetails');
        sessionStorage.removeItem('bookingStage');
        setStage('confirmation');
      } else {
        console.error('Failed to create appointment: ', response.statusText);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const renderBackButton = () => {
    return (
      <button
        onClick={goToPreviousStage}
        className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out mb-4 -mt-2"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
    );
  };

  const renderNextButton = () => {
    if (stages.indexOf(stage) < stages.length - 1) {
      return (
        <button
          onClick={goToNextStage}
          className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out ml-auto mb-4"
        >
          Next <FaArrowRight className="ml-2" />
        </button>
      );
    }
    return null;
  };

  const renderPaymentSelection = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#21232a] p-4 text-white">
        <h2 className="text-3xl font-bold mb-4 text-white">Select Payment Method</h2>
        <div className="flex flex-col gap-4">
          {selectedMode !== "Online" && (
            <button
              onClick={() => {
                setPaymentMethod("Cash");
                goToNextStage();
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Pay with Cash
            </button>
          )}
          <button
            onClick={() => {
              setPaymentMethod("Online");
              handleBuyClick();
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Pay Online
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentStage = () => {
    const stageComponents = {
      home: renderHomeStage(),
      selectSpecialization: renderSpecializationSelection(),
      selectDate: renderDateSelection(),
      viewDoctors: renderDoctorSelection(),
      appointmentDetails: renderAppointmentDetails(),
      paymentSelection: renderPaymentSelection(),
      confirmation: renderConfirmation(),
    };

    return (
      <div className="flex flex-col min-h-screen bg-[#21232a] text-white ml-20 mr-20">
        <ProgressBar stages={stages} currentStage={stage} />
        {stage !== 'home' && renderBackButton()}
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={stage}
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            classNames="fade"
          >
            <div>{stageComponents[stage]}</div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    );
  };

  return renderCurrentStage();
};

export default AppointmentBooking;

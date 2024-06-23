import React, { useState } from 'react';
import { AiFillEdit, AiOutlineMail, AiOutlinePhone, AiOutlineCamera } from 'react-icons/ai';
import { MdSave } from 'react-icons/md';
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar2 from "../components/Sidebar2";
import Footer from "../components/Footer";
import { useCookies } from 'react-cookie';
import Web3 from "web3";
import contract from '../contracts/contract.json';

const EditDoctorProfile = () => {
  const [isEditing, setisEditing] = useState(false);
  const [DoctorData, setDoctorData] =useState("")
  const [profilePic, setProfilePic] = useState('');
  const [cookies, setCookie] = useCookies();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [licenseno, setLicenseno] = React.useState("");
  const [contactnNo, setContactNo] = React.useState("");
  const [speciality, setSpeciality] = React.useState("");
  const [hospital, setHospital] = React.useState("");
  const [medicalQualifications, setMedicalQualifications] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [biography, SetBiography] = useState("");
  const [contactNumber, SetContactNumber] = useState("");
  const [boardCertifications, setBoardCertifications] = useState("");
  const [affiliations, setAffiliations] = useState("");
  const [positions, setPositions] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [medicalInterests, setMedicalInterests] = useState("");
  const [proceduresPerformed, setProceduresPerformed] = useState("");
  const [researchInterests, setResearchInterests] = useState("");
  const [spokenLanguages, setSpokenLanguages] = useState("");
  const [professionalMemberships, setProfessionalMemberships] = useState("");

  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(
    contract["abi"],
    contract["address"]
  );


  useEffect(() => {

    const hash = cookies['hash'];
    fetch(`http://localhost:8080/ipfs/${hash}`)
      .then(res => res.json())
      .then(res => {
        setName(res.name);
        setEmail(res.mail);
        setPassword(res.password);
        setLicenseno(res.license);
        setContactNo(res.contactnNumber)
        setHospital(res.hospital)
        setSpeciality(res.speciality)
      })
      async function save() {
        setCookie("name", name);
        setCookie("mail", email);
        setCookie("password", password);
        setCookie("licenseno", licenseno);
        setCookie("contactNumber", contactnNo);
        setCookie("hospital", hospital);
        setCookie('speciality',speciality )
        var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        var currentaddress = accounts[0];
        console.log(cookies["name"]);
        const web3 = new Web3(window.ethereum);
        const mycontract = new web3.eth.Contract(contract['abi'], contract['address']);
        // console.log(mycontract);
        mycontract.methods.updateData(parseInt(cookies['index']), JSON.stringify(auth)).send({ from: currentaddress })
          .then(res => {
            console.log(res);
          })
      }
    
  },[cookies]);
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        if (email) {
          const response = await fetch(`http://localhost:8050/api/doctors/details/${email}`);
          if (response.ok) {
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
            setSpeciality(data.specialization);
            setMedicalQualifications(data.medicalQualifications.join(", "));
            setLicenseNumber(data.licenseNumber);
            SetBiography(data.biography);
            setBoardCertifications(data.boardCertifications.join(", "));
            SetContactNumber(data.contactNumber);
            // Adjust the profile picture path
            const profilePicUrl = data.profilePicture ? `http://localhost:8050/${data.profilePicture}` : 'https://via.placeholder.com/150';
            console.log(profilePicUrl)
            setProfilePic(profilePicUrl);
            console.log(profilePic)
            console.log(data);
          }
           else {
            console.error('Failed to fetch doctor data');
          }
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };
  
    fetchDoctorData();
  }, [email]); // Dependency array ensures this runs when `email` changes
   console.log(profilePic)
  
  const [auth, setAuth] = useState({
    "type": "user",
    "name": name,
    "mail": email,
    "password": password,
  })

  const [disabled, setDisabled] = useState(true);

  function handleGameClick() {
    setDisabled(!disabled);
  }



  async function show() {
    const web3 = new Web3(window.ethereum);
    const mycontract = new web3.eth.Contract(
      contract["abi"],
      contract["networks"]["5777"]["address"]
    );
    mycontract.methods
      .getdata()
      .call()
      .then(res => {
        res.map(data => {
          var d = JSON.parse(data);
          console.log(d);
        })
      })
  }


  // const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const profileData = {
    name: 'Rayna Westervelt M.Psi',
    specialty: 'ENT Doctor',
    hospital: 'Siloam Hospitals, West Bekasi, Bekasi',
    bio: 'With a seasoned career spanning four years, our ENT specialist brings a wealth of experience...',
    contactInfo: {
      email: 'rayna@hospital.com',
      phone: '+1234567890',
    },
  };



 const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('specialization', speciality);
    formData.append('medicalQualifications', medicalQualifications);
    formData.append('licenseNumber', licenseNumber);
    formData.append('boardCertifications', boardCertifications);
    formData.append('biography', biography);
    formData.append('contactNumber', contactNumber);
    const fileInput = document.getElementById('image');
    if (fileInput && fileInput.files[0]) {
      formData.append('profilePicture', fileInput.files[0]);
    }
  
    try {
      const response = await fetch('http://localhost:8050/api/doctors/', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
      } else {
        console.error('Submission failed', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#20232A' }}>
      <div className="container mx-auto max-w-4xl rounded-lg p-3" style={{ backgroundColor: '#33373E' }}>
      <h2 className='ml-10 mt-5 text-white'>Dr. {name}</h2>
        <div className="p-6 rounded-lg shadow-lg space-y-6 br-40" >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="relative group mx-auto" style={{
              width: '200px', // Increased width
              height: '200px', // Increased height to maintain aspect ratio
            }}>
              <div style={{
                width: '100%', // Make sure it takes the full size of its parent
                height: '100%', // Make sure it takes the full size of its parent
                borderRadius: '50%', // Make it round
                overflow: 'hidden', // Ensure the image doesn't escape the bounds
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <img src={profilePic} alt="Profile" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover' // Ensure the image covers the area
                }} />
              </div>
              <label className="absolute inset-0 w-full h-full flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 group-hover:bg-opacity-50 transition-opacity duration-300" style={{ 
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%', // Ensure the hover effect is also round
              }}>
                <AiOutlineCamera className="text-white text-2xl"/>
                <input type="file" id='image' className="hidden" onChange={handleProfilePicChange} accept="image/*"/>
              </label>
            </div>


            {/* Profile Information Section */}
            <div className="p-4 rounded-lg shadow-sm space-y-3 col-span-2 bg-third ">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                <button onClick={() => setisEditing(!isEditing)} className="p-1 rounded-full hover:bg-gray-600 transition duration-300" style={{ backgroundColor: '#02c8d7' }}>
                  <AiFillEdit className="text-white text-lg"/>
                </button>
              </div>

           

{isEditing ? (
  <>
   <textarea
        className="form-input w-full p-2 rounded text-black"
        placeholder="Medical Qualifications"
        value={medicalQualifications}
        onChange={(e) => setMedicalQualifications(e.target.value)}
        id="medicalQualifications"
      ></textarea>
      <textarea
        className="form-input w-full p-2 rounded text-black"
        placeholder="Specializations and Subspecialties"
        value={speciality}
        onChange={(e) => setSpeciality(e.target.value)}
        id="speciality"
      ></textarea>
      <textarea
        className="form-input w-full p-2 rounded text-black"
        placeholder="License to Practice"
        value={licenseNumber}
        onChange={(e) => setLicenseNumber(e.target.value)}
        id="licenseNumber"
      ></textarea>
      <textarea
        className="form-input w-full p-2 rounded text-black"
        placeholder="Board Certifications"
        value={boardCertifications}
        onChange={(e) => setBoardCertifications(e.target.value)}
        id="boardCertifications"
      ></textarea>
   
  </>
) : (
  <>
    <p className="text-white"><strong>Medical Qualifications:</strong> {medicalQualifications}</p>
    <p className="text-white"><strong>Specializations:</strong> {speciality}</p>
    <p className="text-white"><strong>License Number:</strong> {licenseNumber}</p>
    <p className="text-white"><strong>Board Certifications:</strong> {boardCertifications}</p>
    
  </>
)}

            </div>

            {/* Biography and Contact Information Section */}
            <div className="lg:col-span-3 p-4 rounded-lg shadow-sm space-y-3 bg-third">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white" id='biography'>Biography & Contact</h3>
           
              </div>
              
              {isEditing ? (
                <>
                <textarea
  className="form-input w-full p-2 rounded text-black"
  style={{ minHeight: '200px' }}
  rows="10"
  value={biography} // Use state variable for value
  onChange={(e) => SetBiography(e.target.value)} // Update state on change
  placeholder="Biography"
></textarea>
               
                  <button onClick={() => handleSubmit()} className="mt-4 w-full py-2 px-4 rounded-lg text-white transition duration-300 flex justify-center items-center" style={{ backgroundColor: '#02c8d7' }}>
                    <MdSave className="mr-2"/> Save Changes
                  </button>
                </>
              ) : (
                <>
                  <p className="text-white">{profileData.bio}</p>
                
                </>
              )}
              <div className="flex items-center mt-4">
     
                   <AiOutlinePhone className="mr-2 text-white"/>
                    <p className="text-white">{profileData.contactInfo.phone}</p>
                    <br />
                <AiOutlineMail className="mr-2 text-white"/>
                <p className="text-white">{profileData.contactInfo.email}</p> {/* Email remains non-editable */}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorProfile;

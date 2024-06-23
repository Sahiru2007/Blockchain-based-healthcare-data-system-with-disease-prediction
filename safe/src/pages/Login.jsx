import React, { useState } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import image from '../assets/login_background.jpeg';

const Login = () => {
  const [type, setType] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [doctors, setDoc] = useState([]);
  const [patients, setPatient] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies([]);

  const [log, setLog] = useState({
    mail: "",
    password: ""
  });

  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(
    contract["abi"],
    contract["address"]
  );

  const handle = (e) => {
    const newData = { ...log };
    newData[e.target.name] = e.target.value;
    setLog(newData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = async (e) => {

    var accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
    var currentAddress = accounts[0];
    Object.keys(cookies).forEach(cookieName => {
      removeCookie(cookieName, { path: '/' });
  });
    let userType = e ? 'doctor' : 'patient'; // Determine user type based on the event e

    // Common function for setting cookies and redirecting after login
    const onSuccessfulLogin = (userHash, userType) => {
        setCookie('hash', userHash, { path: '/' }); // Ensure cookies are set for the root path
        setCookie('type', userType, { path: '/' });
        console.log(userHash)
        alert("Logged in");
        window.location.href = userType === 'patient' ? "patient/patientDashboard" : "doctor/myprofiledoc";
    };

    if (!e) {
        // Patient login logic
        const patientData = await mycontract.methods.getPatient().call();
        
        for (let patientHash of patientData) {
          console.log(patientHash)
            try {
                const data = await (await fetch(`http://localhost:8080/ipfs/${patientHash}`)).json();
                if (data.mail === log.mail && data.password === log.password) {
                    onSuccessfulLogin(patientHash, 'patient');
                    return; // Stop the execution once the user is found and logged in
                }
            } catch (err) {
                console.log(err);
            }
        }
        alert("Invalid login credentials for patient.");
    } else {
        // Doctor login logic
        const doctorData = await mycontract.methods.getDoctor().call();
        for (let doctorHash of doctorData) {
            try {
                const data = await (await fetch(`http://localhost:8080/ipfs/${doctorHash}`)).json();
                if (data.mail === log.mail && data.password === log.password) {
                    onSuccessfulLogin(doctorHash, 'doctor');
                    return; // Stop the execution once the user is found and logged in
                }
            } catch (err) {
                console.log(err);
            }
        }
        alert("Invalid login credentials for doctor.");
    }
};


  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to right, #004e92,#000428)' }}>
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center bg-white/20 z-10 backdrop-filter backdrop-blur-lg shadow-lg ">
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-gray-200">Login</h2>
          <p className="text-xs mt-4 text-gray-300">If you are already a member, log in</p>

          <form action="" className="flex flex-col gap-4">
            <input className="p-2 mt-8 rounded-xl border" type="email" name="mail" id="email" placeholder="Email" onChange={(e) => handle(e)} />
            <div className="relative">
              <input className="p-2 rounded-xl border w-full" type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" onChange={(e) => handle(e)} />
              <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi-eye-slash absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
  <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>

                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                )}
              </button>
            </div>
            {/* User Type Dropdown */}
            <div className="relative">
                        <div className="input-heading" >
                            <h5 className="text-gray-300"> Type</h5>
                            <select className="p-2 rounded-xl border w-full text-gray-400" id="user-type" name="type" onChange={() => { setType(!type) }} style={{padding:'0.5rem', backgroundColor:'white'}}>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>
                    </div>
            <input
              type="button"
              className="bg-[#002D74] rounded-xl text-gray-300 py-2 hover:scale-105 duration-300 cursor-pointer"
              value="Log In"
              onClick={() => { login(type) }}
            />
          </form>

          <div className="mt-6 grid grid-cols-3 items-center text-gray-300">
            <hr className="border-gray-300" />
            <p className="text-center text-sm text-gray-300 ">OR</p>
            <hr className="border-gray-300" />
          </div>

          <a href="/signup" className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
            Sign up
          </a>

          <div className="mt-5 text-xs border-b border-gray-300 py-4 text-gray-300">
            <a href="link" >Forgot your password?</a>
          </div>

          <div className="mt-3 text-xs flex justify-between items-center text-[#002D74] ">
            <p className='text-gray-300'>Don't have an account?</p>
            <a href='/signup' className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">Sign Up</a>
          </div>
        </div>
        <div className="md:block hidden w-1/2">
          <img className="rounded-2xl" src={image} alt="Login" />
        </div>
      </div>
    </section>
  );
};

export default Login;

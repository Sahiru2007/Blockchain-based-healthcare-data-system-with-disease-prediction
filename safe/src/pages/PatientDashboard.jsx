import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, ColumnSeries, DataLabel } from '@syncfusion/ej2-react-charts';
import { MdOutlineCancel } from "react-icons/md";
import contract from '../contracts/contract.json';
import Web3 from "web3";
import { MdCardTravel } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";
import { IoLocationShard } from "react-icons/io5";
import { FaRegStar, FaUser } from "react-icons/fa";
import {  Button, LinkButton} from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsKanban, BsBarChart, BsBoxSeam, BsShield, BsChatLeft } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { GiLouvrePyramid } from 'react-icons/gi';
import { GrLocation } from 'react-icons/gr';
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { CiCirclePlus } from "react-icons/ci";
import { create } from 'ipfs-http-client';

const dropdownData = [
  {
    Id: '1',
    Time: 'March 2021',
  },
  {
    Id: '2',
    Time: 'April 2021',
  }, {
    Id: '3',
    Time: 'May 2021',
  },
];
const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);

const DriverDashboard = () => {
  const { currentColor, currentMode } = useStateContext();
  const [cookies, setCookie] = useCookies();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [doctors, setDoc] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [unapprovedDoctors, setUnapprovedDoctors] = useState([]);
  const [password, setPassword] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const [formattedDate, setFormattedDate] = React.useState("");
  const web3 = new Web3(window.ethereum);
  const [nearestAppointment, setNearestAppointment] = useState(null); // State to hold the nearest appointment data
  const [appointmentDoctor, setAppointmentDoctor] = React.useState("");
  const mycontract = new web3.eth.Contract(
    contract["abi"],
    contract["address"]
  );
  useEffect(() => {
    const fetchUserData = async () => {
      const hash = cookies['hash'];
      const response = await fetch(`http://localhost:8080/ipfs/${hash}`);
      const userData = await response.json();
      setName(userData.name);
      setEmail(userData.mail);
    
      setPassword(userData.password);
      setContactNumber(userData.contactNumber);
    };

    fetchUserData();
  }, [cookies]); // Fetch user data whenever cookies change
 
  useEffect(() => {
    const fetchNearestAppointment = async () => {
      try {
        const response = await fetch(`http://localhost:8050/api/appointments/nearestAppointment/${email}`);
        const data = await response.json();
        console.log(data.nearestAppointment);
        setNearestAppointment(data.nearestAppointment);
        const formattedDate = data.nearestAppointment ? new Date(data.nearestAppointment.date).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '';
        setFormattedDate(formattedDate);
        setAppointmentDoctor(data.nearestAppointment.doctorEmail)
        console.log(formattedDate);
      } catch (error) {
        console.error('Error fetching nearest appointment:', error);
      }
    };
  
    console.log(nearestAppointment);
  
    if (email) {
      fetchNearestAppointment();
    }
  }, [email]); // Fetch nearest appointment whenever email changes
  



  console.log(nearestAppointment);
  const earningData = [
    {
      icon: <FaUser />,
      amount: '05.06.2023,  15.30',
      title: 'Last appointment',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'red-600',
    },
    {
      icon: <SlCalender />,
      amount: formattedDate,
      title: 'Next appointment',
      iconBg: 'rgb(255, 244, 229)',
      iconColor: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
    {
      icon: <MdOutlineCancel />,
      amount: '7',
      percentage: '',
      title: 'Insurance',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
      pcColor: 'green-600',
    },
    {
      icon: <CiCirclePlus />,
      amount: '2',
      percentage: '',
      title: 'Hospitalization',
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      pcColor: 'red-600',
    },
  ];

  const recentTransactions = [
    {
      icon: <BsCurrencyDollar />,
      amount: '+$350',
      title: 'Paypal Transfer',
      desc: 'Money Added',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'green-600',
    },
    // Add other recentTransactions data
  ];
   const SparklineAreaData = [
    { x: 1, yval: 2 },
    { x: 2, yval: 6 },
    { x: 3, yval: 8 },
    { x: 4, yval: 5 },
    { x: 5, yval: 10 },
  
  ];
  const ecomPieChartData = [
    { x: '2018', y: 18, text: '35%' },
    { x: '2019', y: 18, text: '15%' },
    { x: '2020', y: 18, text: '25%' },
    { x: '2021', y: 18, text: '25%' },
  ];
 

  const weeklyStats = [
    {
      icon: <FiStar />,
      amount: '31',
      title: 'Johnathan Doe',
      iconBg: '#00C292',
      pcColor: 'green-600',
    },
    {
      icon: <FiStar />,
      amount: '31',
      title: 'Johnathan Doe',
      iconBg: 'yellow-600',
      pcColor: 'yellow-600',
    },
    {
      icon: <FiStar />,
      amount: '31',
      title: 'Johnathan Doe',
      iconBg: 'red-600',
      pcColor: 'red-600',
    },
    // Add other weeklyStats data
  ];
  function showApprovedDoctors() {
    return approvedDoctors.map(data => {
        return (
            <tr key={data.hash}>
                <td>{data.name}</td>
                <td>{data.mail}</td>
                <td><input type="button" value="Revoke Access" onClick={() => removeAccess(data.hash)} className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:bg-red-700"  /></td>
            </tr>
        )
    })
}
async function removeAccess(dhash) {
  var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  var currentaddress = accounts[0];
  const data = await (await fetch(`http://localhost:8080/ipfs/${cookies["hash"]}`)).json();
  const drs = data.selectedDoctors;
  const newList = drs.filter(doctor => doctor !== dhash);
  data.number += 1;
  data.selectedDoctors = newList;

  let client = create();
  client = create(new URL('http://127.0.0.1:5001'));
  const { cid } = await client.add(JSON.stringify(data));
  const hash = cid['_baseCache'].get('z');
  setCookie('hash', hash);
  await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
      alert("Patient Removed");
      window.location.reload();
  }).catch((err) => {
      console.log(err);
  });
}
  useEffect(() => {
    const fetchDoctors = async () => {
        try {
            const res = await mycontract.methods.getDoctor().call();
            const doc = [];
            for (let i = 0; i < res.length; i++) {
                const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json()
                data['hash'] = res[i];
                doc.push(data);
            }
            setDoc(doc);
            console.log(doctors)


            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const currentAddress = accounts[0];
            console.log(cookies['hash'])
            const patientData = await (await fetch(`http://localhost:8080/ipfs/${cookies['hash']}`)).json()
            console.log(patientData)
            console.log(doc)
            console.log(patientData.selectedDoctors)
            const approvedDoctors = doc.filter(doctor => {
                return patientData.selectedDoctors.includes(doctor.hash);
            });
            console.log(approvedDoctors)
            const unapprovedDoctors = doc.filter(doctor => {
                return !patientData.selectedDoctors.includes(doctor.hash);
            });
            console.log(unapprovedDoctors)
            setApprovedDoctors(approvedDoctors);
            setUnapprovedDoctors(unapprovedDoctors);
        } catch (error) {
            console.error(error);
        }
    };

    fetchDoctors();
}, []);
  return (
    <div className="mt-10">
     
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3">
          <div className="flex justify-between items-center">
          <div>
              <p className="font-bold text-gray-400">Next appointment</p>
             
  <p>{appointmentDoctor}</p>

            </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
             <FaUser />
            </button>
          </div>
          <div className="mt-6">
            <LinkButton
            to={'/patient/Myappointment'}
              color="white"
              bgColor={currentColor}
              text="View appointments"
              borderRadius="10px"
            />
          </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {earningData.map((item) => (
            <div key={item.title} className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                 {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>

              </p>
              <p className="text-sm text-gray-400  mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-10 m-4 flex-wrap justify-center">
  <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-1200 max-h-[384px] overflow-y-auto">
    <div className="flex justify-between items-center gap-2">
      <p className="text-xl font-semibold">Granted Doctors</p>
    </div>

    <div className="table-container">
    <table className="modernTable">
                    <thead>
                        <tr >
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Revoke Access</th>
                        </tr>
                    </thead>
                    <tbody >
                        {showApprovedDoctors()}
                    </tbody>
                </table>
    <div className="flex justify-between items-center mt-5 border-t-1 border-color">
     
    </div>
  </div>
</div>
</div>

     

     

      
    </div>
  );
};

export default DriverDashboard;

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navigate } from 'react-router-dom';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import {  MyProfile, MyProfileDoc, Doctors, Visits, AppointmentDetails, OnlineSessions,DoctorDashboard, Calender, SessionDetails, PatientDashboard, MyAppointments, AppointmentRequest, KidneyDiseasePrediction, LiverDiseasePrediction ,ParkinsonPrediction, HeartDiseasePrediction, Patients, DiabetesPrediction,Appointment, MedicalHistory, HospitalizationHistory, Insurance, Allergies, PredictDisease, Login, Signup, VideoCall } from './pages';
import PatientInfo from './pages/PatientInfo';
import Home from './HomeLayout'
import './App.css';
import DashboardLayout from './DashboardLayout';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {


  return (
   
      <BrowserRouter>
              <Routes>
                
                {/* dashboard  */}
                <Route path="/" element={(<Home />)} />
               
                <Route path="/login" element={(<Login />)} />
                <Route path="/signup" element={(<Signup />)} />
                {/* pages  */}
                <Route path="/videoCall/:roomID/:username/:type/:appointmentID/:meetingID" element={<VideoCall />} />
    

            
                <Route
                path="patient/*"
          element={
            <DashboardLayout>
              <Routes>
              <Route path="/" element={<PatientDashboard />} />
              <Route path="/patientdashboard" element={<PatientDashboard />} />
              <Route path="/myprofile" element={(<MyProfile />)} />
            
              <Route path="/insurance" element={<Insurance />} />
                <Route path="/allergies" element={<Allergies />} />
                <Route path="/medicalhistory" element={<MedicalHistory />} />
                <Route path="/hospitalizationhistory" element={<HospitalizationHistory />} />
                <Route path="/predictdisease" element={<PredictDisease />} />
                <Route path="/checkuphistory" element={<Visits />} />
                <Route path="/doctors" element={<Doctors />} />
              <Route path="/Createappointment" element={<Appointment/>} />
              <Route path="/Telemedicinesessions" element={<OnlineSessions/>} />
              <Route path="/Myappointment" element={<MyAppointments/>} />
              
              </Routes>
            </DashboardLayout>
          }
        />
  xw
<Route
                path="doctor/*"
          element={
            <DashboardLayout>
              <Routes>
              <Route path="/" element={<DoctorDashboard />} />
              <Route path="/doctorDashboard" element={<DoctorDashboard />} />
              <Route path="/myprofiledoc" element={(<MyProfileDoc />)} />
                <Route path="/patients" element={<Patients />} />
                <Route exact path="/patientInfo/:phash" element={<PatientInfo />} />
                <Route path="/diabetesPrediction" element={<DiabetesPrediction />} />
                <Route path="/heartDiseasePrediction" element={<HeartDiseasePrediction />} />
                <Route path="/parkinsonDiseasePrediction" element={<ParkinsonPrediction />} />
                <Route path="/ChronicKidneyDiseasePrediction" element={<KidneyDiseasePrediction />} />
                <Route path="/LiverDiseasePrediction" element={<LiverDiseasePrediction />} />
                <Route path="/AppointmentRequests" element={<AppointmentRequest/>} />
                <Route path="/AppointmentDates" element={<Calender/>} />
                <Route path="/TelemedicineSessionDetails" element={<SessionDetails/>} />
                <Route path="/AppointmentDetails" element={<AppointmentDetails/>} />
               
               
              </Routes>
            </DashboardLayout>
          }
        />



              </Routes>
      </BrowserRouter>
  );
};

export default App;

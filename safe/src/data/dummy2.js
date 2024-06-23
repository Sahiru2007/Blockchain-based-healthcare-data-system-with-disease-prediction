import React from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineMedicalServices } from 'react-icons/md';
import { CiMonitor } from "react-icons/ci";

export const links = [
  {
    title: 'Dashboard',
    links: [
      {
        name: 'doctor Dashboard',
        icon: <CiMonitor />,
      },
      {
        name: 'my profile doc',
        icon: <CgProfile />,
      },
    ],
  },
  {
    title: 'My Patients',
    links: [
      {
        name: 'patients',
        icon: <MdOutlineMedicalServices />,
      },
    ],
  },
  {
    title: 'Appointments',
    links: [
      {
        name: 'Appointment Requests',
        icon: <MdOutlineMedicalServices />,
      },
      {
        name: 'AppointmentDetails',
        icon: <MdOutlineMedicalServices />,
      },
      {
        name: 'Telemedicine Session Details',
        icon: <MdOutlineMedicalServices />,
      },
      {
        name: 'Appointment Dates',
        icon: <MdOutlineMedicalServices />,
      },
    ],
  },
  {
    title: 'Prediction Models',
    links: [
      {
        name: 'Heart Disease Prediction',
        icon: <MdOutlineMedicalServices />,
      },
      {
        name: 'Parkinson Disease Prediction',
        icon: <MdOutlineMedicalServices />,
      },
      {
        name: 'Chronic Kidney Disease Prediction',
        icon: <MdOutlineMedicalServices />,
      },
      {
        name: 'Liver Disease Prediction',
        icon: <MdOutlineMedicalServices />,
      },
      {
        name: 'Diabetes Prediction',
        icon: <MdOutlineMedicalServices />,
      },

    ],
  },
];

export const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'green-theme',
    color: '#00897B',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    name: 'indigo-theme',
    color: '#1E4DB7',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];

export const userProfileData = [
  {
    icon: <BsCurrencyDollar />,
    title: 'My Profile',
    desc: 'Account Settings',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
  },
];

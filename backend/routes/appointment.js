
const router = require("express").Router();
const Doctor = require('../models/doctor');
const Meeting = require('../models/meeting');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure as needed
const Appointment = require('../models/appointment');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

const accountSid = 'ACCOUNT_SID';
const authToken = 'AUTH_TOKEN'
const twilioPhoneNumber = 'PHONE_NUMBER';const client = new twilio(accountSid, authToken);


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'shbodahewa@gmail.com',
    pass: 'ordx zkgr vefe gnzz',
  },
});

router.get('/detailedEarnings', async (req, res) => {
  try {
    const appointments = await Appointment.find({}, 'patientName patientEmail date paymentAmount');
    const totalEarnings = await Appointment.aggregate([
      { $group: { _id: null, total: { $sum: '$paymentAmount' } } }
    ]);

    res.status(200).json({
      appointments,
      totalEarnings: totalEarnings.length ? totalEarnings[0].total : 0
    });
  } catch (error) {
    console.error('Error fetching detailed earnings:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// Route to retrieve all doctors
router.get('/getDoctors', async (req, res) => {
    try {

      // Fetch all doctors from the database
      const doctors = await Doctor.find({}); // An empty filter object returns all documents
  
      if (doctors.length > 0) {
        res.status(200).json(doctors); // Return the list of doctors if found
      } else {
        res.status(404).json({ message: 'No doctors found' }); // Return a 404 if no doctors exist
      }
    } catch (error) {
      console.error('Error fetching doctors:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Route to create a new appointment
router.post('/createAppointment', upload.none(), async (req, res) => {
    try {
      const { patientEmail, patientName, patientContactNo, doctorID, doctorEmail, specialization, date, time, mode, description, status , paymentAmount, paymentMethod, paymentStatus } = req.body;
      const roomID = "";
      // Check if the doctor exists
      const doctor = await Doctor.findById(doctorID);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      // Create the appointment
      const appointment = new Appointment({
        patientEmail,
        patientName,
        patientContactNo,
        doctorID,
        doctorEmail, 
        specialization,
        date,
        time,
        mode,
        description,
        status, 
        roomID,
        paymentAmount,
        paymentMethod,
        paymentStatus
      });
  
      // Save the appointment to the database
      await appointment.save();
  
      res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
      console.error('Error creating appointment:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  });
  // Route to retrieve all appointment requests sent by a patient based on their email
  // Route to retrieve all appointment requests sent by a patient based on their email
router.get('/patient/:patientEmail', async (req, res) => {
    const patientEmail = req.params.patientEmail;
  
    try {
      // Fetch all appointments where the patientEmail matches
      const appointments = await Appointment.find({ patientEmail: patientEmail })
        .populate('doctorID'); // Populate the doctorID field with doctor details
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error retrieving appointments:', error);
      res.status(500).json({ error: 'Failed to retrieve appointments' });
    }
});
// Route to retrieve the nearest appointment for a particular patient
router.get('/nearestAppointment/:patientEmail', async (req, res) => {
  const patientEmail = req.params.patientEmail;

  try {
    // Fetch all appointments for the patient
    const appointments = await Appointment.find({ patientEmail: patientEmail }).sort({ date: 1 });

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for the patient' });
    }
    

    // Find the nearest appointment
    const currentDate = new Date();
    let nearestAppointment = null;

    for (let i = 0; i < appointments.length; i++) {
      if (new Date(appointments[i].date) >= currentDate) {
        nearestAppointment = appointments[i];
        break;
      }
    }

    if (!nearestAppointment) {
      return res.status(404).json({ message: 'No upcoming appointments found for the patient' });
    }

    res.status(200).json({ nearestAppointment });
  } catch (error) {
    console.error('Error retrieving nearest appointment:', error);
    res.status(500).json({ error: 'Failed to retrieve nearest appointment' });
  }
});


// Route to generate a summary report for a doctor
router.get('/doctorReport', async (req, res) => {
    const { doctorEmail, startDate, endDate } = req.query;

    try {
        // Ensure the doctor exists
        const doctor = await Doctor.findOne({ email: doctorEmail });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Aggregate appointments based on the doctorEmail and within the given date range
        const report = await Appointment.aggregate([
            { $match: { 
                doctorEmail: doctorEmail,
                date: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }},
            { $group: {
                _id: "$doctorEmail",
                totalAppointments: { $sum: 1 },
                completedAppointments: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
                cancelledAppointments: { $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] } },
                onlineAppointments: { $sum: { $cond: [{ $eq: ["$mode", "Online"] }, 1, 0] } },
                inPersonAppointments: { $sum: { $cond: [{ $eq: ["$mode", "In-person"] }, 1, 0] } },
                totalEarnings: { $sum: "$paymentAmount" },
                outstandingPayments: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Pending"] }, "$paymentAmount", 0] } }
            }},
            { $project: {
                totalAppointments: 1,
                completedAppointments: 1,
                cancelledAppointments: 1,
                onlineAppointments: 1,
                inPersonAppointments: 1,
                totalEarnings: 1,
                outstandingPayments: 1,
                doctorDetails: { $arrayElemAt: ["$doctorDetails", 0] }
            }}
        ]);

        if (report.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this doctor within the specified date range' });
        }

        res.status(200).json(report[0]);
    } catch (error) {
        console.error('Error generating doctor report:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});
// Route to retrieve all appointments
// Route to retrieve all appointments with filtering options
router.get('/getAllAppointments', async (req, res) => {
  try {
    const { startDate, endDate, status, mode } = req.query;
    let filter = {};

    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (status) {
      filter.status = status;
    }

    if (mode) {
      filter.mode = mode;
    }

    // Fetch all appointments from the database based on the filter
    const appointments = await Appointment.find(filter);

    if (appointments.length > 0) {
      res.status(200).json(appointments); // Return the list of appointments if found
    } else {
      res.status(404).json({ message: 'No appointments found' }); // Return a 404 if no appointments exist
    }
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to retrieve all appointment requests with RequestPending status sent by a doctor based on their email
router.get('/doctor/:doctorEmail', async (req, res) => {
    const doctorEmail = req.params.doctorEmail;

    try {
        // Fetch all appointments where the doctorEmail matches and status is RequestPending
        const appointments = await Appointment.find({ doctorEmail: doctorEmail, status: 'RequestPending' });

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        res.status(500).json({ error: 'Failed to retrieve appointments' });
    }
});
// Route to accept an appointment request and update roomID
// Route to accept an appointment request and update roomID
router.put('/acceptAppointment/:id', async (req, res) => {
  const appointmentId = req.params.id;
  const { roomID } = req.body; // Assuming roomID is sent in the request body
  console.log(roomID)
  try {
    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);
    const doctorId = appointment.doctorID;
    const doctor  = await Doctor.findById(doctorId)
    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the appointment status to RequestAccepted
    appointment.status = 'RequestAccepted';

    // Update the roomID in the appointment record if it's provided
    if (roomID) {
      appointment.roomID = roomID;
    }

    const InPersonMessage = `Your appointment has been accepted by Dr. ${doctor.name}. The appointment will be held on ${appointment.date} at ${appointment.time}. Please be present at the assigned location.`;
    const OnlineMessage = `Your appointment has been accepted by Dr. ${doctor.name}. The appointment will be held on ${appointment.date} at ${appointment.time} Online through the website. Your Room ID is ${roomID}. Enter your room ID to join the telemedicine session or Login using the following link. http://localhost:3000/videoCall/${appointment.roomID}/${appointment.patientName}/patient`;
    const patientNo = appointment.patientContactNo;

    // Sending SMS
    if (appointment.mode == "Online") {
      sendSMS(patientNo, OnlineMessage);
    } else {
      sendSMS(patientNo, InPersonMessage)
    }

    // Sending Email
    const mailOptions = {
      from: 'sahiru.teengrad@@gmail.com',
      to: appointment.patientEmail,
      subject: 'Appointment Confirmation',
      text: appointment.mode === 'Online' ? OnlineMessage : InPersonMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }oi
    });

    // Save the updated appointment
    await appointment.save();

    res.status(200).json({ message: 'Appointment request accepted successfully', appointment });
  } catch (error) {
    console.error('Error accepting appointment:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/telemedicine-sessions', async (req, res) => {
  try {
    const sessions = await Meeting.find().sort({ time: -1 }).limit(10);
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching telemedicine sessions:', error);
    res.status(500).json({ error: 'Failed to retrieve telemedicine sessions' });
  }
});
  // Route to deny an appointment request
  router.put('/denyAppointment/:id', async (req, res) => {
    const appointmentId = req.params.id;
    
    try {
      // Find the appointment by ID
      const appointment = await Appointment.findById(appointmentId);
      
      // Check if the appointment exists
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      // Update the appointment status to RequestDenied
      appointment.status = 'RequestDenied';
      
      // Save the updated appointment
      await appointment.save();
  
      res.status(200).json({ message: 'Appointment request denied successfully', appointment });
    } catch (error) {
      console.error('Error denying appointment:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
    // Route to deny an appointment request
    router.put('/finalizeAppointment/:id', async (req, res) => {
      const appointmentId = req.params.id;
      
      try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);
        
        // Check if the appointment exists
        if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
        }
    
        // Update the appointment status to RequestDenied
        appointment.status = 'AppointmentFinalized';
        
        // Save the updated appointment
        await appointment.save();
    
        res.status(200).json({ message: 'Appointment request denied successfully', appointment });
      } catch (error) {
        console.error('Error denying appointment:', error.message);
        res.status(500).json({ error: 'Server error' });
      }
    });
    

    // Route to cancel an appointment request
    router.put('/cancelAppointment/:id', async (req, res) => {
      const appointmentId = req.params.id;
      
      try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);
        
        // Check if the appointment exists
        if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
        }
    
        // Update the appointment status to RequestDenied
        appointment.status = 'RequestCanceled';
        
        // Save the updated appointment
        await appointment.save();
    
        res.status(200).json({ message: 'Appointment request denied successfully', appointment });
      } catch (error) {
        console.error('Error denying appointment:', error.message);
        res.status(500).json({ error: 'Server error' });
      }
    });


  // Route to retrieve all accepted appointments for a doctor
router.get('/acceptedAppointments/:doctorEmail', async (req, res) => {
  const doctorEmail = req.params.doctorEmail;

  try {
      // Fetch all appointments where the doctorEmail matches and status is RequestAccepted
      const appointments = await Appointment.find({ doctorEmail: doctorEmail, status: 'RequestAccepted' });

      res.status(200).json(appointments);
  } catch (error) {
      console.error('Error retrieving appointments:', error);
      res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
});

async function sendSMS(to, message) {
  try {
    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });
    console.log('SMS sent successfully.');
  } catch (err) {
    console.error('Error sending SMS:', err);
  }
}

  module.exports = router;
const express = require("express");
const router = express.Router();
const Meeting = require("../models/meeting");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");


const multer = require('multer');
const { exec } = require('child_process');
const twilio = require('twilio');

const nodemailer = require('nodemailer');

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
  
// Route to create a new meeting
router.post("/createMeeting/:appointmentID/", async (req, res) => {
  try {
    // Extract meeting data from request parameters
    const { appointmentID } = req.params;

    const appointment = await Appointment.findById(appointmentID)
    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    const doctorEmail = appointment.doctorEmail;
    const patientEmail = appointment.patientEmail;
    const time = new Date();

    // Create the meeting
    const meeting = new Meeting({
      appointmentID,
      doctorEmail,
      patientEmail,
      time,
      duration: "", 
      summary: "", 
      transcription: "",
      prescription: "",

    });

    // Save the meeting to the database
    await meeting.save();

    res.status(201).json({ message: "Meeting created successfully", meeting });
  } catch (error) {
    console.error("Error creating meeting:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
const upload = multer({ storage: storage });
router.post('/transcribe/:meetingID', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { meetingID } = req.params;
    const filePath = req.file.path;
    // This command now assumes the Python script handles both transcription and summarization
    const command = `python transcribe.py "${filePath}"`; // Ensure this matches your actual Python script filename

    exec(command, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).send(`Error during processing: ${stderr}`);
        }

        // stdout should now contain both the transcription and the summary separated by a delimiter
        const [transcription, summary] = stdout.trim().split('###');
        console.log("Transcription:", transcription);
        console.log("Summary1:", summary);

        try {
            const meeting = await Meeting.findById(meetingID);
            console.log(meeting)
            if (!meeting) {
                return res.status(404).json({ message: 'Meeting not found' });
            }

            // Update the meeting's transcription and summary
            meeting.transcription = transcription;
            
            meeting.summary = summary;
            await meeting.save();

            res.send({ transcription, summary, message: 'Meeting transcription and summary updated successfully' });
        } catch (error) {
            console.error("Error updating meeting transcription and summary:", error.message);
            res.status(500).json({ error: "Server error" });
        }
    });
});


// Route to update meeting duration
router.put("/updateMeetingDuration/:meetingID", async (req, res) => {
    try {
      const { meetingID } = req.params;
      const { duration } = req.body;
  
      // Find the meeting by ID
      const meeting = await Meeting.findById(meetingID);
  
      // Check if the meeting exists
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
  
      // Update the duration of the meeting
      meeting.duration = duration;
  
      // Save the updated meeting to the database
      await meeting.save();
  
      res.status(200).json({ message: "Meeting duration updated successfully" });
    } catch (error) {
      console.error("Error updating meeting duration:", error.message);
      res.status(500).json({ error: "Server error" });
    }
});

// Route to send notifications (email and SMS) to the patient for a specific appointment
router.post('/notifyPatient/:appointmentID/:meetingID/', async (req, res) => {
    const { appointmentID } = req.params;
    const { meetingID } = req.params;
  
    try {
      // Find the appointment by ID
      const appointment = await Appointment.findById(appointmentID).populate('doctorID');
      
      // Check if the appointment exists
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      const patientNameNoSpaces = appointment.patientName.replace(/ /g, '');
      const doctorNameNoSpaces = appointment.doctorID.name.replace(/ /g, '');
      // Construct the messages
      const smsMessage = `Dear ${patientNameNoSpaces}, Your Online telemedicine session with Dr.${doctorNameNoSpaces} has been initiated by the doctor. Please log in and join the telemedicine session immediately. Use the room ID ${appointment.roomID} or Join using the following link. http://localhost:3000/videoCall/${appointment.roomID}/${patientNameNoSpaces}/patient/${appointment._id}/${meetingID} ${appointment.time}.`;

const emailMessage = `Dear ${patientNameNoSpaces}, Your Online telemedicine session with Dr.${doctorNameNoSpaces} has been initiated by the doctor. Please log in and join the telemedicine session immediately. Use the room ID ${appointment.roomID} or Join using the following link. http://localhost:3000/videoCall/${appointment.roomID}/${patientNameNoSpaces}/patient/${appointment._id}/${meetingID} ${appointment.time}.`;

      // Sending SMS
      await sendSMS(appointment.patientContactNo, smsMessage);
  
      // Sending Email
      const mailOptions = {
        from: 'yourclinic@example.com',
        to: appointment.patientEmail,
        subject: 'Appointment Confirmation',
        text: emailMessage,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'Failed to send email' });
        } else {
          console.log('Email sent: ' + info.response);
          // Since email is asynchronous, we'll consider SMS sent successfully as a trigger to respond
          res.status(200).json({ message: 'Notifications sent successfully' });
        }
      });
    } catch (error) {
      console.error('Error sending notifications:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  });
  router.get('/patient/:patientEmail', async (req, res) => {
    const patientEmail = req.params.patientEmail;
  
    try {
      let meetings = await Meeting.find({ patientEmail: patientEmail });
  
      // Fetch doctor details for each meeting asynchronously
      meetings = await Promise.all(meetings.map(async (meeting) => {
        const doctor = await Doctor.findOne({ email: meeting.doctorEmail });
        // Clone the meeting object and add doctor details
        const meetingWithDoctor = meeting.toObject();
        meetingWithDoctor.doctorDetails = doctor; // Add doctor details to the meeting object
        return meetingWithDoctor;
      }));
  
      if (meetings.length > 0) {
        res.status(200).json(meetings);
      } else {
        res.status(404).json({ message: 'No meetings found for this patient' });
      }
    } catch (error) {
      console.error('Error retrieving meetings:', error);
      res.status(500).json({ error: 'Failed to retrieve meetings' });
    }
  });



  router.get('/doctor/:doctorEmail', async (req, res) => {
    const doctorEmail = req.params.doctorEmail;
  
    try {
      // Fetch all appointments where the patientEmail matches
      const appointments =  await Meeting.find({ doctorEmail: doctorEmail })
        .populate('appointmentID'); // Populate the doctorID field with doctor details
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error retrieving appointments:', error);
      res.status(500).json({ error: 'Failed to retrieve appointments' });
    }
});
  
  

module.exports = router;

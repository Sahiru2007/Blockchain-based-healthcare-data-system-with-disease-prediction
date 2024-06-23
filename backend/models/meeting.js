// Require necessary modules
const mongoose = require('mongoose');

// Define meeting schema
const meetingSchema = new mongoose.Schema({
  appointmentID: {
    type: String,
    required: true
  },
  doctorEmail: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,

  },
  summary: {
    type: String,
  
  },
  transcription: {
    type: String
  },
  prescription: {
    type: String
  }
  
});

// Create meeting model
const Meeting = mongoose.model('Meeting', meetingSchema);

// Export meeting model
module.exports = Meeting;

// Require necessary modules
const mongoose = require('mongoose');

// Define appointment schema
const appointmentSchema = new mongoose.Schema({
  patientEmail: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientContactNo: {
    type: String,
    required: true
  },
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  doctorEmail: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['In-person', 'Online'],
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  roomID: {
    type: String,
  },
  paymentAmount: {
    type: Number, 
    default: 0
  },
  paymentMethod: {
    type: String, 
  },
  paymentStatus: {
    type: String, 
  }
});

// Create appointment model
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Export appointment model
module.exports = Appointment;

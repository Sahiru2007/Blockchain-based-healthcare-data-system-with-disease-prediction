// Require necessary modules
const mongoose = require('mongoose');

// Define doctor schema
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  medicalQualifications: {
    type: [String],
   
  },
  licenseNumber: {
    type: String,

   
  },
  boardCertifications: { 
    type: [String]
  },
  biography: {
    type: String
  },
  contactNumber: {
    type: String,
   
  },
  profilePicture: {
    type: String,
    
  }
});

// Create doctor model
const Doctor = mongoose.model('Doctor', doctorSchema);

// Export doctor model
module.exports = Doctor;

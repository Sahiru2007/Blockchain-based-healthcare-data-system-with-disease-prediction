const router = require("express").Router();
const Doctor = require('../models/doctor');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure as needed


// Route to insert a new doctor or update existing doctor
router.post('/', upload.single('profilePicture'), async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      medicalQualifications,
      licenseNumber,
      boardCertifications,
      biography,
      contactNumber,
      profilePicture 
    } = req.body;

    // Check if the email already exists in the database
    let existingDoctor = await Doctor.findOne({ email });


// Assuming 'profilePicture' should store the path of the uploaded file
if (existingDoctor) {
  // Update existing doctor's data, including profilePicture
  const updateData = {
    name,
    specialization,
    medicalQualifications,
    licenseNumber,
    boardCertifications,
    biography,
    contactNumber,
  };
  if (req.file) {
    updateData.profilePicture = req.file.path; // Use the file's path
  }
  const updatedDoctor = await Doctor.findOneAndUpdate({ email }, updateData, { new: true });
  res.status(200).json(updatedDoctor); // Return the updated doctor object
} else {
  const doctorData = {
    name,
    email,
    specialization,
    medicalQualifications,
    licenseNumber,
    boardCertifications,
    biography,
    contactNumber,
  };
  if (req.file) {
    doctorData.profilePicture = req.file.path; // Use the file's path for new documents
  }
  const newDoctor = new Doctor(doctorData);
  const savedDoctor = await newDoctor.save();
  res.status(201).json(savedDoctor); // Return the saved doctor object


    }
  } catch (error) {
    console.error('Error inserting/updating doctor:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/details/:email', async (req, res) => {
  try {
    const { email } = req.params;
    // Find the doctor in the database by email
    const doctor = await Doctor.findOne({ email });

    if (doctor) {
      res.status(200).json(doctor); // Return the doctor object if found
    } else {
      res.status(404).json({ message: 'Doctor not found' }); // Return a 404 if doctor not found
    }
  } catch (error) {
    console.error('Error fetching doctor:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

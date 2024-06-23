const express = require('express');
const app = express();
const cors = require('cors');
const { exec } = require('child_process');
const multer = require('multer');
const connection = require('./db');
const doctorRoutes = require('./routes/createDoctor.js'); // Adjust the path to your new route file
const appointmentRoutes = require('./routes/appointment.js')
const payments = require('./routes/payment.js')
const meeting = require('./routes/meeting.js')

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Configure Multer (adjust storage as needed)
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
const upload = multer({ storage: storage });

// Serve static files from 'uploads' directory
app.use('/uploads/', express.static('uploads'));
app.use('/api/meetings', meeting);
// Use the doctor routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', payments);


const port = 8050;
app.listen(port, () => console.log(`Listening on port ${port}...`));

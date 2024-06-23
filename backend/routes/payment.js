
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('SK_TEST_API_KEY');
const {  Appointment } = require('../models/appointment');
const bodyParser = require('body-parser');
const twilio = require('twilio');
router.use('/webhook', bodyParser.raw({ type: 'application/json' }));

let reservationid;
const accountSid = 'ACCOUNT_SID';
const authToken = 'AUTH_TOKEN'
const twilioPhoneNumber = 'PHONE_NUMBER';const client = new twilio(accountSid, authToken);
// Middleware to initialize session
router.use((req, res, next) => {
  if (!req.session) {
    req.session = {}; // Initialize session if not already done
  }
  next();
});

router.post('/', async (req, res) => {
    const {payment} = req.body;
  try {
    if (!payment) {
      throw new Error('Invalid reservation data');
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'lkr',
            product_data: {
              name: 'Appointment Payment',
            },
            unit_amount: payment * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/patient/createAppointment',
      cancel_url: 'http://localhost:3000/',
      
    });
    res.json({ id: session.id });
    // Store the reservation ID and payment status in the session metadata
   
  } catch (error) {
    console.error('Error:', error.message || error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

  module.exports = router;

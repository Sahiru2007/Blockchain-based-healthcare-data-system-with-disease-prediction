Blockchain-based Healthcare Data System with Disease Prediction

Overview

This project implements a secure, decentralized healthcare data management system utilizing blockchain technology and machine learning for disease prediction. It aims to address critical challenges in traditional healthcare systems, such as data breaches, limited patient control, and reactive healthcare services.

Features

Secure Data Storage on Blockchain:

Ensures all healthcare data is stored immutably and securely.
Provides a verifiable and permanent record that prevents unauthorized alterations and deletions.
Decentralized Access Control:

Utilizes blockchain-based smart contracts to manage and enforce access rights.
Allows patients to control access to their data.
Disease Prediction via Machine Learning:

Integrates machine learning algorithms to analyze health data.
Predicts both common and specific diseases, enabling early detection and timely medical intervention.
Real-Time Health Monitoring:

Employs machine learning algorithms with real-time data from wearable devices.
Provides alerts for any detected abnormalities that require immediate medical attention.
Online Appointment Scheduling:

Develops a secure, blockchain-enabled online system for scheduling appointments.
Allows patients to book, reschedule, or cancel appointments with healthcare providers conveniently.
Telemedicine Sessions:

Provides a platform for secure and private telemedicine sessions.
Enables patients to consult with healthcare providers remotely.
Session Transcription and Summarization:

Implements AI-driven tools to automatically transcribe and summarize telemedicine sessions into accurate, searchable text formats.
Secure Payment Processing:

Integrates a secure payment system within the platform.
Facilitates easy and secure financial transactions for telemedicine services.
Regulatory Compliance:

Ensures the platform fully complies with relevant healthcare regulations, such as HIPAA and GDPR.
Focuses on safeguarding patient data privacy and ensuring the security of health information.
User-Friendly Interface Design:

Designs and develops intuitive and accessible user interfaces for both patients and healthcare providers.
Ensures that the platform is easy to navigate and use.
System Scalability and Maintenance:

Designs the system to be scalable to handle increasing amounts of data and a growing number of users.
Establishes a routine for regular updates and maintenance to ensure the platform remains up-to-date and secure.
System Architecture

The system is built using the following technologies:

Frontend: React.js for a dynamic user interface.
Backend: Node.js and Express.js for robust backend services.
Blockchain: Ethereum blockchain with Solidity smart contracts for secure and immutable transaction records.
Data Storage: IPFS for decentralized file storage.
Machine Learning: Python with libraries such as SciKit-Learn, NumPy, and pandas for advanced data analysis and disease prediction models.
SMS: Twilio for sending appointment reminders and notifications.
Payments: Stripe for secure payment processing.
Video Calls: ZEGOCLOUD for secure video call functionality.
Design Diagrams

Architectural Diagram
ER Diagram
Class Diagram
Use Case Diagrams
Activity Diagrams
Installation

Clone the repository:

bash
Copy code
git clone https://github.com/Sahiru2007/Blockchain-based-healthcare-data-system-with-disease-prediction.git
cd Blockchain-based-healthcare-data-system-with-disease-prediction
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory and add your environment variables.
Example:
env
Copy code
REACT_APP_API_URL=http://localhost:5000
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
STRIPE_SECRET_KEY=your_stripe_secret_key
ZEGO_APP_ID=your_zegocloud_app_id
ZEGO_SERVER_SECRET=your_zegocloud_server_secret
Run the development server:

bash
Copy code
npm start
Setting Up Third-Party Services

Twilio (for SMS)
Sign up for a Twilio account.
Get your Account SID and Auth Token from the Twilio Console.
Add these credentials to your .env file.
Stripe (for Payments)
Sign up for a Stripe account.
Get your Secret Key from the Stripe Dashboard.
Add this key to your .env file.
ZEGOCLOUD (for Video Calls)
Sign up for a ZEGOCLOUD account.
Get your App ID and Server Secret from the ZEGOCLOUD Console.
Add these credentials to your .env file.
Usage

Register and Login:

Users can register and log in to the platform to access their health data and manage permissions.
Manage Health Records:

Users can add, view, and update their health records stored securely on the blockchain.
Predict Diseases:

The system provides predictions for common diseases based on the symptoms entered by the user.
Schedule Appointments:

Users can book, reschedule, or cancel appointments with healthcare providers.
Telemedicine Sessions:

Users can conduct secure telemedicine sessions and access transcriptions and summaries of the sessions.
SMS Notifications:

Users receive SMS notifications for appointment reminders and other important updates.
Secure Payments:

Users can securely pay for telemedicine services through the integrated Stripe payment system.
Contributing

Fork the repository.
Create a new branch: git checkout -b my-feature-branch
Make your changes and commit them: git commit -m 'Add some feature'
Push to the branch: git push origin my-feature-branch
Submit a pull request.
License

This project is licensed under the MIT License. See the LICENSE file for more information.

Contact

For any questions or support, please open an issue or contact the project maintainer.

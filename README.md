

# Blockchain-based Healthcare Data System with Disease Prediction

## Overview

This project implements a secure, decentralized healthcare data management system utilizing blockchain technology and machine learning for disease prediction. It aims to address critical challenges in traditional healthcare systems, such as data breaches, limited patient control, and reactive healthcare services.

## Features

1. **Secure Data Storage on Blockchain**: 
   - Ensures all healthcare data is stored immutably and securely.
   - Provides a verifiable and permanent record that prevents unauthorized alterations and deletions.

2. **Decentralized Access Control**: 
   - Utilizes blockchain-based smart contracts to manage and enforce access rights.
   - Allows patients to control access to their data.

3. **Disease Prediction via Machine Learning**: 
   - Integrates machine learning algorithms to analyze health data.
   - Predicts both common and specific diseases, enabling early detection and timely medical intervention.

4. **Real-Time Health Monitoring**: 
   - Employs machine learning algorithms with real-time data from wearable devices.
   - Provides alerts for any detected abnormalities that require immediate medical attention.

5. **Online Appointment Scheduling**: 
   - Develops a secure, blockchain-enabled online system for scheduling appointments.
   - Allows patients to book, reschedule, or cancel appointments with healthcare providers conveniently.

6. **Telemedicine Sessions**: 
   - Provides a platform for secure and private telemedicine sessions.
   - Enables patients to consult with healthcare providers remotely.

7. **Session Transcription and Summarization**: 
   - Implements AI-driven tools to automatically transcribe and summarize telemedicine sessions into accurate, searchable text formats.

8. **Secure Payment Processing**: 
   - Integrates a secure payment system within the platform.
   - Facilitates easy and secure financial transactions for telemedicine services.

9. **Regulatory Compliance**: 
   - Ensures the platform fully complies with relevant healthcare regulations, such as HIPAA and GDPR.
   - Focuses on safeguarding patient data privacy and ensuring the security of health information.

10. **User-Friendly Interface Design**: 
    - Designs and develops intuitive and accessible user interfaces for both patients and healthcare providers.
    - Ensures that the platform is easy to navigate and use.

11. **System Scalability and Maintenance**: 
    - Designs the system to be scalable to handle increasing amounts of data and a growing number of users.
    - Establishes a routine for regular updates and maintenance to ensure the platform remains up-to-date and secure.

## System Architecture

The system is built using the following technologies:
- **Frontend**: React.js for a dynamic user interface.
- **Backend**: Node.js and Express.js for robust backend services.
- **Blockchain**: Ethereum blockchain with Solidity smart contracts for secure and immutable transaction records.
- **Data Storage**: IPFS for decentralized file storage.
- **Machine Learning**: Python with libraries such as SciKit-Learn, NumPy, and pandas for advanced data analysis and disease prediction models.
- **SMS**: Twilio for sending appointment reminders and notifications.
- **Payments**: Stripe for secure payment processing.
- **Video Calls**: ZEGOCLOUD for secure video call functionality.

## Design Diagrams

### Architectural Diagram
![diagram-export-26-01-2024-20_42_51](https://github.com/Sahiru2007/Blockchain-based-healthcare-data-system-with-disease-prediction/assets/75121314/a5cd0caa-ac3d-4d51-943c-dce4c3d6c226)

### ER Diagram
![ezgif-2-0a796c4bbf](https://github.com/Sahiru2007/Blockchain-based-healthcare-data-system-with-disease-prediction/assets/75121314/a1423356-327a-4949-8624-9ecdd1340345)

### Class Diagram
![ezgif-2-c8aff0fe5e](https://github.com/Sahiru2007/Blockchain-based-healthcare-data-system-with-disease-prediction/assets/75121314/1880afc7-3b67-4a86-a489-937ca3c00bc4)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sahiru2007/Blockchain-based-healthcare-data-system-with-disease-prediction.git
   cd Blockchain-based-healthcare-data-system-with-disease-prediction
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory and add your environment variables.
   - Example:
     ```env
     REACT_APP_API_URL=http://localhost:5000
     TWILIO_ACCOUNT_SID=your_twilio_account_sid
     TWILIO_AUTH_TOKEN=your_twilio_auth_token
     STRIPE_SECRET_KEY=your_stripe_secret_key
     ZEGO_APP_ID=your_zegocloud_app_id
     ZEGO_SERVER_SECRET=your_zegocloud_server_secret
     ```

4. **Install and configure IPFS**:
   - Follow the [IPFS installation guide](https://docs.ipfs.io/install/) to install IPFS.
   - Initialize IPFS:
     ```bash
     ipfs init
     ```
   - Start the IPFS daemon:
     ```bash
     ipfs daemon
     ```

5. **Install and configure Ganache**:
   - Download and install [Ganache](https://www.trufflesuite.com/ganache).
   - Start Ganache and create a new workspace.

6. **Set up MetaMask**:
   - Install the [MetaMask browser extension](https://metamask.io/).
   - Create a new MetaMask account or import an existing one.
   - Connect MetaMask to your local Ganache network:
     - Open MetaMask, go to settings, and select `Networks`.
     - Add a new network with the following details:
       - Network Name: Ganache
       - New RPC URL: `http://127.0.0.1:7545`
       - Chain ID: `1337`
       - Currency Symbol: ETH
     - Save and switch to the new network.
     - Import an account from Ganache to MetaMask using the private key provided by Ganache.

7. **Run the development server**:
   ```bash
   npm start
   ```

## Setting Up Third-Party Services

### Twilio (for SMS)
1. Sign up for a [Twilio account](https://www.twilio.com/).
2. Get your Account SID and Auth Token from the Twilio Console.
3. Add these credentials to your `.env` file.

### Stripe (for Payments)
1. Sign up for a [Stripe account](https://stripe.com/).
2. Get your Secret Key from the Stripe Dashboard.
3. Add this key to your `.env` file.

### ZEGOCLOUD (for Video Calls)
1. Sign up for a [ZEGOCLOUD account](https://www.zegocloud.com/).
2. Get your App ID and Server Secret from the ZEGOCLOUD Console.
3. Add these credentials to your `.env` file.

## Usage

1. **Register and Login**:
   - Users can register and log in to the platform to access their health data and manage permissions.

2. **Manage Health Records**:
   - Users can add, view, and update their health records stored securely on the blockchain.

3. **Predict Diseases**:
   - The system provides predictions for common diseases based on the symptoms entered by the user.

4. **Schedule Appointments**:
   - Users can book, reschedule, or cancel appointments with healthcare providers.

5. **Telemedicine Sessions**:
   - Users can conduct secure telemedicine sessions and access transcriptions and summaries of the sessions.

6. **SMS Notifications**:
   - Users receive SMS notifications for appointment reminders and other important updates.

7. **Secure Payments**:
   - Users can securely pay for telemedicine services through the integrated Stripe payment system.

## Contributing

1. **Fork the repository**.
2. **Create a new branch**: `git checkout -b my-feature-branch`
3. **Make your changes and commit them**: `git commit -m 'Add some feature'`
4. **Push to the branch**: `git push origin my-feature-branch`
5. **Submit a pull request**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any questions or support, please open an issue or contact the project maintainer.
```

Save this code in a file named `README.md` in the root directory of your project. This README file should now comprehensively explain your project, including installation and configuration steps for IPFS, Ganache, and MetaMask.

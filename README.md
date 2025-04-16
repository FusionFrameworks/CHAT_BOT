# Hospital Kiosk Chatbot

### Overview
The Hospital Kiosk Chatbot is a core component of the Hospital Kiosk System, designed to assist patients in booking appointments with appropriate specialists based on their symptoms. Integrated into the hospital kiosk, the chatbot interacts with patients, collects symptom information, recommends specialists, and facilitates consultation fee payments. It works in tandem with the CareLink doctor app and notification systems to ensure seamless communication between patients and doctors.
Features

### Symptom Collection
Engages patients in an interactive dialogue to collect symptom details.
Uses a predefined dataset mapping symptoms to medical specialists.


### Specialist Recommendation
Recommends a specialist if three or more symptoms match the dataset criteria.
Ensures accurate mapping of symptoms to relevant medical expertise.


### Payment Integration
Redirects patients to a payment gateway (Razorpay) to pay the consultation fee before displaying the recommended doctor's name.


Notification System
Post-payment, displays the doctor's name and room number on the kiosk screen.
Sends an SMS to the patient with the doctor's name and room number.
Triggers an SMS notification to the doctor via the CareLink app, informing them of the new appointment.



### Integration

Kiosk Interface: Accessible via the "Chatbot" button on the kiosk’s welcome screen after patient login.
CareLink Doctor App: Syncs with the app to notify doctors of new appointments and update their patient list.
Payment Gateway: Uses Razorpay for secure credit card transactions.
SMS Service: Integrates with an SMS API to send appointment details to patients and doctors.

### Technology Stack

Chatbot Framework: [Specify if known, e.g., custom-built with Python, Node.js, or a framework like Rasa, Dialogflow]
Backend: [Specify if known, e.g., Node.js, Python Flask/Django]
Database: [Specify if known, e.g., MySQL, MongoDB for storing symptom-specialist dataset]
Payment Gateway: Razorpay
SMS Service: [Specify if known, e.g., Twilio, MSG91]
Frontend: [Specify if known, e.g., React, HTML/CSS/JavaScript for chatbot UI]

### Installation
Prerequisites

[List prerequisites, e.g., Python, Node.js, etc.]
Razorpay account for payment integration
SMS service API key
[Any chatbot-specific dependencies, e.g., NLP libraries]

### Setup

Clone the Repository
git clone https://github.com/orgs/FusionFrameworks/repositories
cd hospital-kiosk-chatbot


### Install Dependencies
# Example for backend
pip install -r requirements.txt
# Example for frontend
npm install


Configure Environment Variables

Create a .env file in the root directory.

Add the following:
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
SMS_API_KEY=your_sms_api_key
DATABASE_URL=your_database_url




Run the Chatbot
# Start backend
python chatbot.py
# Start frontend (if separate)
npm start



### Usage

Accessing the Chatbot
Log in to the hospital kiosk using patient details and OTP.
Click the "Chatbot" button on the welcome screen.


Interacting with the Chatbot
Respond to the chatbot’s prompts to input symptoms.
Receive a specialist recommendation if three or more symptoms match.


Booking an Appointment
Pay the consultation fee via Razorpay.
View the doctor’s name and room number on the screen.
Receive an SMS with appointment details.


Doctor Notification
The doctor receives an SMS via the CareLink app, updating their patient list.


## Team Members
The Hospital Kiosk System was developed by the following team members:

| Name              | Role                | GitHub Profile                              | LinkedIn Profile                                      |
|-------------------|---------------------|---------------------------------------------|-----------------------------------------------------|
| Varun A L   | Frontend Developer | [GitHub](https://github.com/varun-al)    | [LinkedIn](https://www.linkedin.com/in/varun-a-l-1099ba228/)      |
| K Rakshitha   | Backend Developer  | [GitHub](https://github.com/Rakshitha037)    | [LinkedIn](https://www.linkedin.com/in/k-rakshitha-131157229/)      |
| Ashish Goswami   | Backend Developer | [GitHub](https://github.com/ashish6298)  | [LinkedIn](https://www.linkedin.com/in/ashish-goswami-58797a24a/)      |
| Anjali P Nambiar   | UI/UX Designer     | [GitHub](https://github.com/2003anjali)    | [LinkedIn](https://www.linkedin.com/in/anjali-p-nambiar-9ab453241/)      |


### Future Enhancements

Implement AI-driven natural language processing for more natural patient interactions.
Expand the symptom-specialist dataset for broader coverage.
Add multilingual support for diverse patient populations.
Integrate with teleconsultation platforms for remote specialist recommendations.

### Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a pull request.

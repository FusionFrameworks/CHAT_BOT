// LabTest.js
import React, { useState } from 'react';

const labTests = [
    { name: "General Physician (Dr. Arjun Sharma)", price: "₹740", guidelines: "Avoid eating heavy meals at least 2 hours before the appointment." },
    { name: "General Physician (Dr. Priya Verma)", price: "₹740", guidelines: "Stay hydrated but avoid caffeine for 4 hours before the test." },
    { name: "General Physician (Dr. Amit Gupta)", price: "₹740", guidelines: "If you have a cold, try to rest well and avoid self-medication prior to visit." },
    { name: "Neurologist (Dr. Suresh Rao)", price: "₹10,660", guidelines: "Ensure a full night's sleep, avoid stimulants, and list down any observed symptoms." },
    { name: "Gastroenterologist (Dr. Nisha Patel)", price: "₹9,840", guidelines: "Fast for at least 6 hours before the visit and avoid carbonated beverages." },
    { name: "Allergist (Dr. Rohan Mehta)", price: "₹9,840", guidelines: "Do not take antihistamines for 3 days prior if an allergy test is required." },
    { name: "Endocrinologist (Dr. Kavita Joshi)", price: "₹11,480", guidelines: "Avoid sugary foods or drinks for 12 hours before testing." },
    { name: "Cardiologist (Dr. Vikram Singh)", price: "₹12,300", guidelines: "Avoid caffeine, alcohol, and tobacco for at least 12 hours prior." },
    { name: "Pulmonologist (Dr. Sneha Iyer)", price: "₹10,660", guidelines: "Wear comfortable, loose clothing and bring any recent respiratory tests if available." },
    { name: "Rheumatologist (Dr. Rahul Nair)", price: "₹9,020", guidelines: "Stay hydrated, avoid strenuous activity, and bring a list of medications." },
    { name: "Orthopedic (Dr. Anil Desai)", price: "₹10,200", guidelines: "Wear loose clothing for joint exams and avoid anti-inflammatory medications before the test." },
    { name: "Dermatologist (Dr. Pooja Kapoor)", price: "₹8,600", guidelines: "Avoid applying any lotions or makeup on the skin on the day of the visit." },
    { name: "Ophthalmologist (Dr. Sunita Mehra)", price: "₹7,500", guidelines: "Do not wear contact lenses for 24 hours before the eye exam." },
    { name: "ENT Specialist (Dr. Prakash Sinha)", price: "₹6,200", guidelines: "Avoid loud noises for 24 hours before any hearing tests." },
    { name: "Pediatrician (Dr. Aarti Singh)", price: "₹8,100", guidelines: "Ensure the child is well-rested and bring any vaccination records if available." },
    { name: "Oncologist (Dr. Rakesh Verma)", price: "₹15,000", guidelines: "Bring all previous medical reports and avoid over-the-counter medications." },
    { name: "Urologist (Dr. Rajesh Malhotra)", price: "₹10,200", guidelines: "Stay hydrated, but avoid coffee or tea on the day of the visit." },
    { name: "Nephrologist (Dr. Manisha Saxena)", price: "₹11,500", guidelines: "Do not drink any alcohol 24 hours prior, and bring a list of current medications." },
    { name: "Hematologist (Dr. Akash Tiwari)", price: "₹10,800", guidelines: "Avoid iron supplements and alcohol 24 hours before the test." },
    { name: "Endodontist (Dr. Sanjay Kumar)", price: "₹7,400", guidelines: "Brush your teeth, but avoid mouthwash and flossing on the day of the appointment." },
    { name: "Rheumatologist (Dr. Vinay Patil)", price: "₹9,020", guidelines: "Please ensure to avoid anti-inflammatory medications for 48 hours before testing and stay hydrated." },
{ name: "Dermatologist (Dr. Pooja Jain)", price: "₹8,200", guidelines: "Avoid topical medications or treatments for at least 24 hours before your skin tests." },
{ name: "Otolaryngologist (Dr. Arvind Kumar)", price: "₹9,020", guidelines: "Refrain from using nasal sprays or decongestants 24 hours prior to your visit." },
{ name: "Psychiatrist (Dr. Nitin Desai)", price: "₹12,300", guidelines: "Keep a record of your symptoms and any medications you are currently taking to discuss during your appointment." },
{ name: "Psychiatrist (Dr. Rhea Malhotra)", price: "₹12,300", guidelines: "Note any changes in your mood, sleep patterns, or appetite to share with your doctor." },
{ name: "Psychologist (Dr. Tanuja Shetty)", price: "₹12,300", guidelines: "Prepare to discuss your recent experiences and feelings in a safe environment." },
{ name: "Cardiologist (Dr. Raghav Gupta)", price: "₹12,300", guidelines: "Avoid caffeine and heavy meals at least 12 hours before testing to ensure accurate results." },
{ name: "Endocrinologist (Dr. Suman Kaur)", price: "₹11,480", guidelines: "Fasting for at least 8 hours prior to blood tests is recommended." },
{ name: "Gastroenterologist (Dr. Akash Menon)", price: "₹9,840", guidelines: "Follow a clear liquid diet for 24 hours before any gastrointestinal tests." },
{ name: "Surgeon (Dr. Deepak Sinha)", price: "₹16,400", guidelines: "Stop any blood thinners and consult your doctor on fasting requirements before surgery." },
{ name: "Surgeon (Dr. Sonali Chawla)", price: "₹16,400", guidelines: "Ensure to follow all pre-operative instructions regarding fasting and medications." },
{ name: "Hepatologist (Dr. Kunal Shah)", price: "₹11,480", guidelines: "Avoid alcohol and fatty foods for at least 48 hours prior to testing." },
{ name: "Gastroenterologist (Dr. Arti Verma)", price: "₹9,840", guidelines: "Consult your doctor regarding fasting and dietary restrictions before tests." },
{ name: "Dietitian (Dr. Preeti Joshi)", price: "₹6,560", guidelines: "Keep a food diary for at least 3 days before your visit to discuss your eating habits." },
{ name: "Dermatologist (Dr. Rajesh Kumar)", price: "₹8,200", guidelines: "Avoid sun exposure and tanning for at least 48 hours prior to your appointment." },
{ name: "Dermatologist (Dr. Priyanka Agarwal)", price: "₹8,200", guidelines: "Do not use any new skin products for a week before your appointment." },
{ name: "Dermatologist (Dr. Sanjay Bhatia)", price: "₹8,200", guidelines: "Stop any topical treatments 48 hours prior to testing." },
{ name: "Infectious Disease Specialist (Dr. Aarti Gupta)", price: "₹13,120", guidelines: "If you're experiencing flu-like symptoms, document your symptoms and any recent travel." },
{ name: "Psychiatrist (Dr. Karan Mehta)", price: "₹12,300", guidelines: "Keep a record of symptoms such as sleep patterns and mood changes to discuss." },
{ name: "Psychologist (Dr. Anjali Dutta)", price: "₹12,300", guidelines: "Prepare to discuss any recurring thoughts or feelings that are concerning." },
{ name: "Psychiatrist (Dr. Shalini Kapoor)", price: "₹12,300", guidelines: "Document instances of trauma and their impacts on your daily life for discussion." },
{ name: "Gynecologist (Dr. Meera Malhotra)", price: "₹7,380", guidelines: "Bring a record of your menstrual cycle and any symptoms you’ve been experiencing." },
{ name: "Gynecologist (Dr. Kavita Bhardwaj)", price: "₹7,380", guidelines: "Prepare to discuss any changes in your menstrual cycle and overall health." },
{ name: "Gynecologist (Dr. Neha Verma)", price: "₹7,380", guidelines: "Document any unusual symptoms, such as pain or discharge, for your visit." },
{ name: "Urologist (Dr. Rakesh Joshi)", price: "₹9,020", guidelines: "Keep track of your urinary symptoms and any medications you are taking." },
{ name: "Gynecologist (Dr. Ritu Singh)", price: "₹7,380", guidelines: "Be prepared to discuss any menopausal symptoms or changes in your cycle." },
{ name: "Psychiatrist (Dr. Arvind Kumar)", price: "₹12,300", guidelines: "Prepare to share any concerns related to libido or erectile dysfunction." },
{ name: "Pediatrician (Dr. Nikhil Bansal)", price: "₹6,560", guidelines: "Bring along any growth or developmental concerns regarding your child." },
{ name: "Pediatrician (Dr. Sakshi Sharma)", price: "₹6,560", guidelines: "Document any behavioral issues or milestones for discussion." },
{ name: "Geriatrician (Dr. Ravi Desai)", price: "₹12,300", guidelines: "Prepare to discuss cognitive changes and any medications being taken." },
{ name: "Infectious Disease Specialist (Dr. Anand Iyer)", price: "₹13,120", guidelines: "Prepare to discuss any recent infections or exposure to infectious diseases." },
{ name: "Pediatrician (Dr. Vinod Agarwal)", price: "₹6,560", guidelines: "Bring a list of symptoms, especially if they relate to respiratory issues." },
{ name: "Pediatrician (Dr. Mohit Singh)", price: "₹6,560", guidelines: "Document any symptoms your child is experiencing, especially fever." },
{ name: "Pediatrician (Dr. Priti Joshi)", price: "₹6,560", guidelines: "Be prepared to discuss symptoms such as fever and rash in detail." },
{ name: "Infectious Disease Specialist (Dr. Sanjeev Bansal)", price: "₹7,200", guidelines: "Prepare to provide a detailed history of your symptoms for accurate diagnosis." },
{ name: "Infectious Disease Specialist (Dr. Rohan Gupta)", price: "₹7,200", guidelines: "Document any recent symptoms and health changes for your appointment." },
{ name: "Infectious Disease Specialist (Dr. Tarun Nair)", price: "₹7,200", guidelines: "Keep track of any symptoms such as jaundice or abdominal pain." },
{ name: "Pediatrician (Dr. Aastha Bansal)", price: "₹6,560", guidelines: "Prepare to discuss symptoms related to respiratory issues and swallowing." },
{ name: "Pediatrician (Dr. Ritika Kapoor)", price: "₹6,560", guidelines: "Document any breathing difficulties and share this information." },
{ name: "Dermatologist (Dr. Vineet Sharma)", price: "₹8,000", guidelines: "Avoid using new skincare products for a week before your appointment." },
{ name: "Dermatologist (Dr. Arjun Soni)", price: "₹8,000", guidelines: "Document any changes in hair or scalp health to discuss." },
{ name: "Infectious Disease Specialist (Dr. Rina Iyer)", price: "₹7,200", guidelines: "Keep a record of symptoms such as itching or rashes for your visit." },
{ name: "Infectious Disease Specialist (Dr. Saurabh Kumar)", price: "₹7,200", guidelines: "Prepare to discuss symptoms like fever and chills in detail." },
{ name: "Infectious Disease Specialist (Dr. Kavita Mehta)", price: "₹7,200", guidelines: "Document your symptoms, including fatigue and body aches." },
{ name: "Pediatrician (Dr. Parul Gupta)", price: "₹6,560", guidelines: "Keep track of your child's dietary habits and any gastrointestinal symptoms." },
{ name: "Nutritionist (Dr. Shreya Nair)", price: "₹5,000", guidelines: "Prepare to discuss your dietary habits and any health concerns." },
{ name: "Nutritionist (Dr. Nidhi Agarwal)", price: "₹5,000", guidelines: "Bring a record of your food intake and any weight-related concerns." },
];

function displayLabTests() {
    labTests.forEach(test => {
        console.log(`Test: ${test.name}`);
        console.log(`Price: ${test.price}`);
        console.log(`Guidelines: ${test.guidelines}`);
        console.log("-------------------------------");
    });
}

// Call the function to display the lab test details
displayLabTests();

const LabTest = () => {
    const [selectedTest, setSelectedTest] = useState(null); // useState is now defined

    return (
        <div className="container mx-auto mt-10 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg">
            <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">Lab Test Guidlines</h1>
            <p className="text-center text-gray-700 mb-6">Select a test to view guidelines and pricing information.</p>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {labTests.map((test, index) => (
                    <div
                        key={index}
                        className={`p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl duration-300 
                            ${selectedTest === index ? 'ring-2 ring-blue-500' : ''} 
                            perspective`}
                        onClick={() => setSelectedTest(selectedTest === index ? null : index)}
                    >
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 transform hover:translate-y-1 hover:rotate-1">
                            <div className="text-lg font-semibold text-blue-600">{test.name}</div>
                            <div className="text-gray-500 mt-1">{test.price}</div>
                            {selectedTest === index && (
                                <div className="mt-4 text-gray-600">
                                    <p>{test.guidelines}</p> {/* Changed to display guidelines */}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LabTest;
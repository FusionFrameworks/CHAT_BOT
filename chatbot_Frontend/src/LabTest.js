// LabTest.js
import React, { useState } from 'react';

const labTests = [
    { name: "Cardiology (Cardiologist)", price: "₹12,300", description: "Heart health evaluation and management." },
    { name: "Orthopedics (Orthopedic Surgeon)", price: "₹9,840", description: "Bone and joint assessment and treatment." },
    { name: "Neurology (Neurologist)", price: "₹10,660", description: "Brain and nervous system examination." },
    { name: "Dermatology (Dermatologist)", price: "₹8,200", description: "Skin health check and cosmetic procedures." },
    { name: "Gynecology (Gynecologist)", price: "₹7,380", description: "Women's health and reproductive system." },
    { name: "Pediatrics (Pediatrician)", price: "₹6,560", description: "Children's health and development monitoring." },
    { name: "General Medicine (General Physician)", price: "₹5,740", description: "Overall health assessment and management." },
    { name: "Urology (Urologist)", price: "₹9,020", description: "Urinary tract and male reproductive system." },
    { name: "Endocrinology (Endocrinologist)", price: "₹11,480", description: "Hormonal and metabolic disorders." },
    { name: "Ophthalmology (Ophthalmologist)", price: "₹10,660", description: "Eye health and vision correction." },
    { name: "Gastroenterology (Gastroenterologist)", price: "₹9,840", description: "Digestive system evaluation." },
    { name: "Pulmonology (Pulmonologist)", price: "₹10,660", description: "Lung health and respiratory conditions." },
    { name: "Psychiatry (Psychiatrist)", price: "₹12,300", description: "Mental health evaluation and therapy." },
    { name: "ENT (ENT Specialist)", price: "₹8,200", description: "Ear, nose, and throat health check." },
    { name: "Nephrology (Nephrologist)", price: "₹11,480", description: "Kidney health assessment." },
    { name: "Surgery (Plastic Surgeon)", price: "₹16,400", description: "Surgical procedures for aesthetic purposes." },
    { name: "Infectious Diseases (Immunologist)", price: "₹13,120", description: "Assessment and treatment of infectious diseases." },
    { name: "Dentistry (Dentist)", price: "₹7,380", description: "Oral health and dental procedures." },
    { name: "Allergy & Immunology", price: "₹9,840", description: "Allergy assessment and immunotherapy." },
    { name: "Emergency Medicine", price: "₹14,760", description: "Urgent care and emergency health services." },
];

const LabTest = () => {
    const [selectedTest, setSelectedTest] = useState(null);

    return (
        <div className="container mx-auto mt-10 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg">
            <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">Lab Test Information</h1>
            <p className="text-center text-gray-700 mb-6">Select a specialization to view details and pricing information.</p>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {labTests.map((test, index) => (
                    <div
                        key={index}
                        className={`p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${
                            selectedTest === index ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedTest(selectedTest === index ? null : index)}
                    >
                        <div className="text-lg font-semibold text-blue-600">{test.name}</div>
                        <div className="text-gray-500 mt-1">{test.price}</div>
                        {selectedTest === index && (
                            <div className="mt-4 text-gray-600">
                                <p>{test.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LabTest;

// LabTest.js
import React, { useState } from 'react';

const labTests = [
    { name: "General Physician (Dr. Arjun Sharma)", price: "₹5,740", description: "High temperature, chills, sweating, headache." },
    { name: "General Physician (Dr. Priya Verma)", price: "₹5,740", description: "Fever, cough, sore throat, runny nose." },
    { name: "General Physician (Dr. Amit Gupta)", price: "₹5,740", description: "Sore throat, runny nose, coughing, sneezing." },
    { name: "Neurologist (Dr. Suresh Rao)", price: "₹10,660", description: "Dull pain, pressure in the head, sensitivity to light." },
    { name: "Gastroenterologist (Dr. Nisha Patel)", price: "₹9,840", description: "Abdominal pain, bloating, nausea, vomiting." },
    { name: "Allergist (Dr. Rohan Mehta)", price: "₹9,840", description: "Sneezing, itchy eyes, runny nose, rash." },
    { name: "Endocrinologist (Dr. Kavita Joshi)", price: "₹11,480", description: "Increased thirst, frequent urination, fatigue." },
    { name: "Cardiologist (Dr. Vikram Singh)", price: "₹12,300", description: "Headaches, shortness of breath, nosebleeds." },
    { name: "Pulmonologist (Dr. Sneha Iyer)", price: "₹10,660", description: "Wheezing, coughing, chest tightness, shortness of breath." },
    { name: "Rheumatologist (Dr. Rahul Nair)", price: "₹9,020", description: "Joint pain, swelling, stiffness." },
    { name: "Neurologist (Dr. Anjali Choudhary)", price: "₹10,660", description: "Severe headache, nausea, sensitivity to light." },
    { name: "Pulmonologist (Dr. Sanjay Reddy)", price: "₹10,660", description: "Cough, fever, difficulty breathing." },
    { name: "Pulmonologist (Dr. Meera Bhattacharya)", price: "₹10,660", description: "Cough, production of mucus, fatigue." },
    { name: "Cardiologist (Dr. Gaurav Kapoor)", price: "₹12,300", description: "Chest pain, shortness of breath, fatigue." },
    { name: "Urologist (Dr. Ramesh Iyer)", price: "₹9,020", description: "Severe pain in the side, blood in urine, nausea." },
    { name: "Hematologist (Dr. Neelam Sethi)", price: "₹12,300", description: "Fatigue, weakness, pale skin." },
    { name: "Gastroenterologist (Dr. Amar Thakur)", price: "₹9,840", description: "Heartburn, regurgitation, difficulty swallowing." },
    { name: "Endocrinologist (Dr. Sheetal Deshmukh)", price: "₹11,480", description: "Fatigue, weight changes, sensitivity to temperature." },
    { name: "Rheumatologist (Dr. Vinay Patil)", price: "₹9,020", description: "Intense joint pain, swelling, redness." },
    { name: "Dermatologist (Dr. Pooja Jain)", price: "₹8,200", description: "Redness, swelling, warmth, pus." },
    { name: "Otolaryngologist (Dr. Arvind Kumar)", price: "₹9,020", description: "Nasal congestion, facial pain, headache." },
    { name: "Psychiatrist (Dr. Nitin Desai)", price: "₹12,300", description: "Persistent fatigue, sleep disturbances." },
    { name: "Psychiatrist (Dr. Rhea Malhotra)", price: "₹12,300", description: "Sadness, loss of interest, fatigue." },
    { name: "Psychologist (Dr. Tanuja Shetty)", price: "₹12,300", description: "Restlessness, rapid heartbeat, excessive worry." },
    { name: "Cardiologist (Dr. Raghav Gupta)", price: "₹12,300", description: "Chest pain, shortness of breath, fatigue." },
    { name: "Endocrinologist (Dr. Suman Kaur)", price: "₹11,480", description: "Bone fractures, back pain, loss of height." },
    { name: "Gastroenterologist (Dr. Akash Menon)", price: "₹9,840", description: "Abdominal pain, bloating, diarrhea, constipation." },
    { name: "Surgeon (Dr. Deepak Sinha)", price: "₹16,400", description: "Abdominal pain, nausea, vomiting." },
    { name: "Surgeon (Dr. Sonali Chawla)", price: "₹16,400", description: "Bulge in the abdomen, pain, discomfort." },
    { name: "Hepatologist (Dr. Kunal Shah)", price: "₹11,480", description: "Jaundice, abdominal pain, swelling." },
    { name: "Gastroenterologist (Dr. Arti Verma)", price: "₹9,840", description: "Sudden pain in the abdomen, nausea, vomiting." },
    { name: "Dietitian (Dr. Preeti Joshi)", price: "₹6,560", description: "Diarrhea, bloating, fatigue." },
    { name: "Dermatologist (Dr. Rajesh Kumar)", price: "₹8,200", description: "Itchy skin, redness, dryness." },
    { name: "Dermatologist (Dr. Priyanka Agarwal)", price: "₹8,200", description: "Red patches, dry skin, itching." },
    { name: "Dermatologist (Dr. Sanjay Bhatia)", price: "₹8,200", description: "Redness, swelling, itching." },
    { name: "Infectious Disease Specialist (Dr. Aarti Gupta)", price: "₹13,120", description: "Nausea, vomiting, diarrhea." },
    { name: "Psychiatrist (Dr. Karan Mehta)", price: "₹12,300", description: "Rapid heartbeat, sweating, trembling." },
    { name: "Psychologist (Dr. Anjali Dutta)", price: "₹12,300", description: "Recurrent intrusive thoughts, anxiety." },
    { name: "Psychiatrist (Dr. Shalini Kapoor)", price: "₹12,300", description: "Re-experiencing trauma, hyperarousal." },
    { name: "Gynecologist (Dr. Meera Malhotra)", price: "₹7,380", description: "Loud snoring, gasping for air, daytime fatigue." },
    { name: "Gynecologist (Dr. Kavita Bhardwaj)", price: "₹7,380", description: "Irregular periods, hormonal imbalances." },
    { name: "Gynecologist (Dr. Neha Verma)", price: "₹7,380", description: "Pelvic pain, fever, unusual discharge." },
    { name: "Urologist (Dr. Rakesh Joshi)", price: "₹9,020", description: "Painful urination, frequent urge to urinate." },
    { name: "Gynecologist (Dr. Ritu Singh)", price: "₹7,380", description: "Hot flashes, mood swings, irregular periods." },
    { name: "Psychiatrist (Dr. Arvind Kumar)", price: "₹12,300", description: "Loss of libido, erectile dysfunction." },
    { name: "Pediatrician (Dr. Nikhil Bansal)", price: "₹6,560", description: "Irregular periods, hormonal imbalances." },
    { name: "Pediatrician (Dr. Sakshi Sharma)", price: "₹6,560", description: "Developmental delays, behavioral issues." },
    { name: "Geriatrician (Dr. Ravi Desai)", price: "₹12,300", description: "Memory loss, confusion, mood changes." },
    { name: "Infectious Disease Specialist (Dr. Anand Iyer)", price: "₹13,120", description: "Cough, sore throat, difficulty breathing." },
    { name: "Pediatrician (Dr. Vinod Agarwal)", price: "₹6,560", description: "Fever, cough, difficulty breathing, loss of taste and smell." },
    { name: "Pediatrician (Dr. Mohit Singh)", price: "₹6,560", description: "Swollen salivary glands, fever, headache." },
    { name: "Pediatrician (Dr. Priti Joshi)", price: "₹6,560", description: "Fever, sore throat, red rash." },
    { name: "Infectious Disease Specialist (Dr. Sanjeev Bansal)", price: "₹7,200", description: "Cough, weight loss, night sweats." },
    { name: "Infectious Disease Specialist (Dr. Rohan Gupta)", price: "₹7,200", description: "Flu-like symptoms, fever, fatigue." },
    { name: "Infectious Disease Specialist (Dr. Tarun Nair)", price: "₹7,200", description: "Fatigue, jaundice, abdominal pain." },
    { name: "Pediatrician (Dr. Aastha Bansal)", price: "₹6,560", description: "Sore throat, difficulty swallowing, fever." },
    { name: "Pediatrician (Dr. Ritika Kapoor)", price: "₹6,560", description: "Coughing, wheezing, difficulty breathing." },
    { name: "Dermatologist (Dr. Vineet Sharma)", price: "₹8,000", description: "Pimples, blackheads, oily skin." },
    { name: "Dermatologist (Dr. Arjun Soni)", price: "₹8,000", description: "Thinning hair, bald patches." },
    { name: "Infectious Disease Specialist (Dr. Rina Iyer)", price: "₹7,200", description: "Itchy skin, redness, swelling." },
    { name: "Infectious Disease Specialist (Dr. Saurabh Kumar)", price: "₹7,200", description: "Fever, chills, fatigue." },
    { name: "Infectious Disease Specialist (Dr. Kavita Mehta)", price: "₹7,200", description: "Fever, fatigue, body aches." },
    { name: "Pediatrician (Dr. Parul Gupta)", price: "₹6,560", description: "Abdominal pain, diarrhea." },
    { name: "Nutritionist (Dr. Shreya Nair)", price: "₹5,000", description: "Fatigue, weakness, brittle nails." },
    { name: "Nutritionist (Dr. Nidhi Agarwal)", price: "₹5,000", description: "Weight gain, difficulty losing weight." },
];
const LabTest = () => {
    const [selectedTest, setSelectedTest] = useState(null);

    return (
        <div className="container mx-auto mt-10 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg">
            <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">Lab Test Information</h1>
            <p className="text-center text-gray-700 mb-6">Select a test to view details and pricing information.</p>

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
                                    <p>{test.description}</p>
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
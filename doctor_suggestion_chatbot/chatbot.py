from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load the dataset
def load_dataset():
    try:
        df = pd.read_csv('D:/CHAT_BOT/doctor_suggestion_chatbot/dataset.csv')
        print("Dataset loaded successfully.")
        return df
    except FileNotFoundError:
        print("Dataset file not found. Check the path.")
        return None

# Preprocess symptoms by removing extra spaces, converting to lowercase, and splitting by commas
def preprocess_symptoms(symptom_string):
    return [symptom.strip().lower() for symptom in re.split(r',\s*', symptom_string)]

# Clean and process the user's input for symptom matching
def clean_user_input(user_input):
    cleaned_input = re.sub(r"\bi have\b|\band\b", "", user_input.lower())
    user_symptoms_list = [symptom.strip() for symptom in re.split(r',\s*', cleaned_input) if symptom]
    return user_symptoms_list

# Suggest doctors based on matching symptoms (3 or more)
def suggest_doctor(df, user_symptoms):
    user_symptoms_list = clean_user_input(user_symptoms)

    # Dictionary to hold doctors by specialization
    doctor_suggestions = {}

    # Loop through each row of the dataframe to find matching symptoms
    for _, row in df.iterrows():
        doctor_symptoms = preprocess_symptoms(row['Symptoms'])

        # Count the number of symptoms that match
        match_count = sum(1 for symptom in user_symptoms_list if symptom in doctor_symptoms)

        # If at least 3 symptoms match, add the doctor's name to the suggestions
        if match_count >= 3:
            specialization = row['Specialization']
            doctor_name = row['Doctor']

            if specialization not in doctor_suggestions:
                doctor_suggestions[specialization] = []

            doctor_suggestions[specialization].append(doctor_name)

    # Prepare the output message
    if doctor_suggestions:
        response = ["👨‍⚕️ Based on your symptoms, we have some doctor recommendations for you:"]
        for specialization, doctors in doctor_suggestions.items():
            unique_doctors = list(set(doctors))  # Remove duplicates
            response.append(f"🔍 **For {specialization}**: {', '.join(unique_doctors)}")
        
        response.append("\nPlease feel free to consult them for the best care! 💖")
        return "\n".join(response)

    # If no match is found
    return "🤔 No suitable doctors found. Please provide more symptoms or check with a general physician."

# Root route to indicate the API is running
@app.route('/')
def home():
    return "Doctor Suggestion Chatbot API is running!"

# API endpoint to handle doctor suggestions
@app.route('/suggest_doctor', methods=['POST'])
def handle_suggest_doctor():
    df = load_dataset()  # Load the dataset
    if df is None:
        return jsonify({"error": "Dataset could not be loaded."}), 500
    
    data = request.get_json()
    symptoms = data.get("symptoms", "")

    # Call the function to suggest doctors
    result = suggest_doctor(df, symptoms)
    
    return jsonify({"message": result})

if __name__ == "__main__":
    app.run(debug=True)

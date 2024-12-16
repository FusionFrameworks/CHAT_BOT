from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
import os
from twilio.rest import Client

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', 'ACb6a7a1c2a5d69b47101de4bc1c97be4f')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '53529920b47cdf445661f77bb64f7932')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '+12185051284')
USER_PHONE_NUMBERS = ['+918804339456']  # List of phone numbers

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Load the dataset once when the application starts
dataset_path = 'D:/CHAT_BOT/doctor_suggestion_chatbot/dataset.csv'
df = None

def load_dataset():
    global df
    if df is None:
        try:
            df = pd.read_csv(dataset_path)
            print("Dataset loaded successfully.")
            print(df.head())  # Print the first few rows of the DataFrame
        except FileNotFoundError:
            print("Dataset file not found. Check the path.")
            return None
    return df

# Preprocess symptoms by removing extra spaces, converting to lowercase, and splitting by commas
def preprocess_symptoms(symptom_string):
    return [symptom.strip().lower() for symptom in re.split(r',\s*', symptom_string)]

# Clean and process the user's input for symptom matching
def clean_user_input(user_input):
    cleaned_input = re.sub(r"\bi have\b|\band\b", "", user_input.lower())  # Remove "I have" and "and"
    cleaned_input = re.sub(r"[^\w\s,]", "", cleaned_input)  # Remove punctuation
    return [symptom.strip() for symptom in re.split(r',\s*', cleaned_input) if symptom]

# Function to send SMS to multiple phone numbers
def send_sms(message):
    for phone_number in USER_PHONE_NUMBERS:
        try:
            client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=phone_number
            )
            print(f"SMS sent successfully to {phone_number}!")
        except Exception as e:
            print(f"Failed to send SMS to {phone_number}: {str(e)}")
            if "Authenticate" in str(e):
                print("Check Twilio SID, Auth Token, and phone numbers.")

# Suggest doctor based on the maximum matching symptoms and calculate accuracy
# def suggest_doctor(df, user_symptoms, payment_status):
#     user_symptoms_list = clean_user_input(user_symptoms)
#     if not user_symptoms_list:
#         return {"message": "🤔 No symptoms provided. Please specify your symptoms clearly.", "room_number": None}

#     best_doctor = None
#     max_match_count = 0
#     best_accuracy = 0  # To track the highest accuracy
#     correct_matches = 0  # To track the number of correct matches
#     total_suggestions = 0  # To count total suggestions made

#     for _, row in df.iterrows():
#         doctor_symptoms = preprocess_symptoms(row['Symptoms'])
#         doctor_name = row['Doctor']
#         specialization = row['Specialization']
#         price = row['Price']
#         room_number = row['Room Number']

#         # Calculate match count
#         match_count = sum(1 for symptom in user_symptoms_list if symptom in doctor_symptoms)
#         accuracy = (match_count / len(user_symptoms_list)) * 100 if user_symptoms_list else 0  # Calculate accuracy as a percentage

#         # Track the doctor with the highest match count and accuracy
#         if accuracy > best_accuracy:
#             best_accuracy = accuracy
#             best_doctor = (doctor_name, specialization, price, room_number, accuracy)
             
             
#         # Count a correct match if accuracy is above 50% (Assuming this is a 'good' match)
   
#         if accuracy >= 50:
#             correct_matches += 1  # Increment correct matches
#         total_suggestions += 1

#         # Example condition for correct matches (if applicable)
#         # Replace "ExpectedDoctorName" with actual logic
#         if doctor_name == 'ExpectedDoctorName':  # Add correct doctor logic here if needed
#             correct_matches += 1
#         total_suggestions += 1

#     # Calculate overall accuracy
#     overall_accuracy = (correct_matches / total_suggestions) * 100 if total_suggestions > 0 else 0

#     # Print accuracy details in the terminal
#     print("\n===== Doctor Suggestion Log =====")
#     if best_doctor:
#         doctor_name, specialization, price, room_number, accuracy = best_doctor
#         print(f"Suggested Doctor: {doctor_name}")
#         print(f"Specialization: {specialization}")
#         print(f"Room Number: {room_number}")
#         print(f"Accuracy for current suggestion: {accuracy:.2f}%")
#     print(f"Overall System Accuracy: {overall_accuracy:.2f}%")
#     print("=================================\n")

#     # Return doctor suggestion message
#     if best_doctor and best_accuracy >= 50:  # Require at least 50% accuracy
#         doctor_message = [
#             "👨‍⚕ Based on your symptoms, we recommend you consult:",
#             f"🔍 *For {specialization}*: {doctor_name}",
#             f"🏢 Room Number: {room_number}",
#             "\nPlease feel free to consult them for the best care! 💖"
#         ]

#         if not payment_status:
#             return {"message": f"💳 Please make the payment of {price} to receive doctor suggestions.", "room_number": None}

#         message_text = "\n".join(doctor_message)
#         send_sms(message_text)
#         return {"message": message_text, "room_number": room_number}

#     return {"message": f"🤔 No suitable doctors found for the symptoms: {', '.join(user_symptoms_list)}. Please provide more symptoms or check with a general physician.", "room_number": None}

#     user_symptoms_list = clean_user_input(user_symptoms)
#     if not user_symptoms_list:
#         return {"message": "🤔 No symptoms provided. Please specify your symptoms clearly.", "room_number": None}

#     best_doctor = None
#     max_match_count = 0
#     best_accuracy = 0  # To track the highest accuracy
#     correct_matches = 0  # To track the number of correct matches
#     total_suggestions = 0  # To count total suggestions made

#     for _, row in df.iterrows():
#         doctor_symptoms = preprocess_symptoms(row['Symptoms'])
#         doctor_name = row['Doctor']
#         specialization = row['Specialization']
#         price = row['Price']
#         room_number = row['Room Number']

#         # Calculate match count
#         match_count = sum(1 for symptom in user_symptoms_list if symptom in doctor_symptoms)
#         accuracy = (match_count / len(user_symptoms_list)) * 100  # Calculate accuracy as a percentage

#         # Track the doctor with the highest match count and accuracy
#         if accuracy > best_accuracy:
#             best_accuracy = accuracy
#             best_doctor = (doctor_name, specialization, price, room_number, accuracy)

#     # Calculate overall accuracy for all suggestions
#     overall_accuracy = (correct_matches / total_suggestions) * 100 if total_suggestions > 0 else 0

#     # Print accuracy in the terminal
#     print("\n===== Doctor Suggestion Log =====")
#     if best_doctor:
#         doctor_name, specialization, price, room_number, accuracy = best_doctor
#         print(f"Suggested Doctor: {doctor_name}")
#         print(f"Specialization: {specialization}")
#         print(f"Room Number: {room_number}")
#         print(f"Accuracy for current suggestion: {accuracy:.2f}%")
#     print(f"Overall System Accuracy: {overall_accuracy:.2f}%")
#     print("=================================\n")

#     if best_doctor and best_accuracy >= 50:  # Require at least 50% accuracy
#         doctor_message = [
#             "👨‍⚕ Based on your symptoms, we recommend you consult:",
#             f"🔍 *For {specialization}*: {doctor_name}",
#             f"🏢 Room Number: {room_number}",
#             f"📊 Accuracy: {accuracy:.2f}% match with your symptoms.",
#             f"📊 Overall System Accuracy: {overall_accuracy:.2f}%",
#             "\nPlease feel free to consult them for the best care! 💖"
#         ]

#         if not payment_status:
#             return {"message": f"💳 Please make the payment of {price} to receive doctor suggestions.", "room_number": None}

#         message_text = "\n".join(doctor_message)
#         send_sms(message_text)
#         return {"message": message_text, "room_number": room_number}

#     return {"message": f"🤔 No suitable doctors found for the symptoms: {', '.join(user_symptoms_list)}. Please provide more symptoms or check with a general physician.", "room_number": None}

#     user_symptoms_list = clean_user_input(user_symptoms)
#     if not user_symptoms_list:
#         return {"message": "🤔 No symptoms provided. Please specify your symptoms clearly.", "room_number": None}

#     best_doctor = None
#     max_match_count = 0
#     best_accuracy = 0  # To track the highest accuracy
#     correct_matches = 0  # To track the number of correct matches
#     total_suggestions = 0  # To count total suggestions made

#     for _, row in df.iterrows():
#         doctor_symptoms = preprocess_symptoms(row['Symptoms'])
#         doctor_name = row['Doctor']
#         specialization = row['Specialization']
#         price = row['Price']
#         room_number = row['Room Number']  # Assume Room Number is a column in your dataset

#         # Calculate match count
#         match_count = sum(1 for symptom in user_symptoms_list if symptom in doctor_symptoms)
#         accuracy = (match_count / len(user_symptoms_list)) * 100  # Calculate accuracy as a percentage

#         # Track the doctor with the highest match count and accuracy
#         if accuracy > best_accuracy:
#             best_accuracy = accuracy
#             best_doctor = (doctor_name, specialization, price, room_number, accuracy)

#         # Checking if the selected doctor is correct (this requires predefined correct answers)
#         if doctor_name == 'ExpectedDoctorName':  # Replace with actual doctor name for correct match
#             correct_matches += 1
#         total_suggestions += 1

#     # Calculate overall accuracy for all suggestions
#     overall_accuracy = (correct_matches / total_suggestions) * 100 if total_suggestions > 0 else 0

#     if best_doctor and best_accuracy >= 50:  # Require at least 50% accuracy
#         doctor_name, specialization, price, room_number, accuracy = best_doctor
#         doctor_message = [
#             "👨‍⚕ Based on your symptoms, we recommend you consult:",
#             f"🔍 *For {specialization}*: {doctor_name}",
#             f"🏢 Room Number: {room_number}",
#             f"📊 Accuracy: {accuracy:.2f}% match with your symptoms.",
#             f"📊 Overall System Accuracy: {overall_accuracy:.2f}%",
#             "\nPlease feel free to consult them for the best care! 💖"
#         ]

#         if not payment_status:
#             return {"message": f"💳 Please make the payment of {price} to receive doctor suggestions.", "room_number": None}

#         message_text = "\n".join(doctor_message)
#         send_sms(message_text)
#         return {"message": message_text, "room_number": room_number}

#     return {"message": f"🤔 No suitable doctors found for the symptoms: {', '.join(user_symptoms_list)}. Please provide more symptoms or check with a general physician.", "room_number": None}

def suggest_doctor(df, user_symptoms, payment_status):
    user_symptoms_list = clean_user_input(user_symptoms)
    if not user_symptoms_list:
        return {"message": "🤔 No symptoms provided. Please specify your symptoms clearly.", "room_number": None}

    best_doctor = None
    best_accuracy = 0  # To track the highest accuracy

    for _, row in df.iterrows():
        doctor_symptoms = preprocess_symptoms(row['Symptoms'])
        doctor_name = row['Doctor']
        specialization = row['Specialization']
        price = row['Price']
        room_number = row['Room Number']

        # Calculate match count
        match_count = sum(1 for symptom in user_symptoms_list if symptom in doctor_symptoms)
        accuracy = (match_count / len(user_symptoms_list)) * 100 if user_symptoms_list else 0  # Calculate accuracy as a percentage

        # Track the doctor with the highest accuracy
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_doctor = (doctor_name, specialization, price, room_number, accuracy)

    # Print suggestion log in the terminal
    print("\n===== Doctor Suggestion Log =====")
    if best_doctor:
        doctor_name, specialization, price, room_number, accuracy = best_doctor 
        print(f"Suggested Doctor: {doctor_name}")
        print(f"Specialization: {specialization}")
        print(f"Room Number: {room_number}")
        print(f"Accuracy for current suggestion: {accuracy:.2f}%")
    print("=================================\n")

    # Return doctor suggestion message
    if best_doctor and best_accuracy >= 50:  # Require at least 50% accuracy
        doctor_name, specialization, price, room_number, accuracy = best_doctor
        doctor_message = [
            "👨‍⚕ Based on your symptoms, we recommend you consult:",
            f"🔍 *For {specialization}*: {doctor_name}",
            f"🏢 Room Number: {room_number}",
            f"📊 Accuracy: {accuracy:.2f}% match with your symptoms.",
            "\nPlease feel free to consult them for the best care! 💖"
        ]

        if not payment_status:
            return {"message": f"💳 Please make the payment of {price} to receive doctor suggestions.", "room_number": None}

        message_text = "\n".join(doctor_message)
        send_sms(message_text)
        return {"message": message_text, "room_number": room_number}

    return {"message": f"🤔 No suitable doctors found for the symptoms: {', '.join(user_symptoms_list)}. Please provide more symptoms or check with a general physician.", "room_number": None}






# Root route to indicate the API is running
@app.route('/')
def home():
    return "Doctor Suggestion Chatbot API is running!"

# API endpoint to handle doctor suggestions
@app.route('/suggest_doctor', methods=['POST'])
def handle_suggest_doctor():
    df = load_dataset()
    if df is None:
        return jsonify({"error": "Dataset could not be loaded."}), 500
    
    data = request.get_json()
    symptoms = data.get("symptoms", "")
    payment_status = data.get("payment_status", False)

    result = suggest_doctor(df, symptoms, payment_status)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)

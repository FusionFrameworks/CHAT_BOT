# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# import re
# import os
# from twilio.rest import Client

# app = Flask(__name__)
# CORS(app)  # Enable CORS for cross-origin requests

# # Twilio configuration
# TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', 'AC9d1139ae2a944f7479c5c223090bea41')
# TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '24fa24a750f2ce88ef031bae5099d6a5')
# TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '+13204007751')
# USER_PHONE_NUMBER = '+918804339456'

# client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# # Load the dataset once when the application starts
# dataset_path = 'D:/CHAT_BOT/doctor_suggestion_chatbot/dataset.csv'
# df = None

# def load_dataset():
#     global df
#     if df is None:
#         try:
#             df = pd.read_csv(dataset_path)
#             print("Dataset loaded successfully.")
#             print(df.head())  # Print the first few rows of the DataFrame
#         except FileNotFoundError:
#             print("Dataset file not found. Check the path.")
#             return None
#     return df

# # Preprocess symptoms by removing extra spaces, converting to lowercase, and splitting by commas
# def preprocess_symptoms(symptom_string):
#     return [symptom.strip().lower() for symptom in re.split(r',\s*', symptom_string)]

# # Clean and process the user's input for symptom matching
# def clean_user_input(user_input):
#     cleaned_input = re.sub(r"\bi have\b|\band\b", "", user_input.lower())
#     cleaned_input = re.sub(r"[^\w\s,]", "", cleaned_input)  # Remove punctuation
#     return [symptom.strip() for symptom in re.split(r',\s*', cleaned_input) if symptom]

# # Function to send SMS with improved error handling
# def send_sms(message):
#     try:
#         client.messages.create(
#             body=message,
#             from_=TWILIO_PHONE_NUMBER,
#             to=USER_PHONE_NUMBER
#         )
#         print("SMS sent successfully!")
#     except Exception as e:
#         print(f"Failed to send SMS: {str(e)}")
#         if "Authenticate" in str(e):
#             print("Check Twilio SID, Auth Token, and phone numbers.")

# # Suggest doctor based on the maximum matching symptoms
# def suggest_doctor(df, user_symptoms, payment_status):
#     user_symptoms_list = clean_user_input(user_symptoms)
#     if not user_symptoms_list:
#         return {"message": "🤔 No symptoms provided. Please specify your symptoms clearly.", "room_number": None}

#     best_doctor = None
#     max_match_count = 0
#     for _, row in df.iterrows():
#         doctor_symptoms = preprocess_symptoms(row['Symptoms'])
#         doctor_name = row['Doctor']
#         specialization = row['Specialization']
#         price = row['Price']
#         room_number = row['Room Number']  # Assume Room Number is a column in your dataset

#         match_count = sum(1 for symptom in user_symptoms_list if symptom in doctor_symptoms)
#         if match_count > max_match_count:
#             max_match_count = match_count
#             best_doctor = (doctor_name, specialization, price, room_number)

#     if best_doctor and max_match_count >= 2:
#         doctor_name, specialization, price, room_number = best_doctor
#         doctor_message = [
#             "👨‍⚕ Based on your symptoms, we recommend you consult:",
#             f"🔍 *  For {specialization}*: {doctor_name}",
#             f"🏢 Room Number: {room_number}",
#             "\nPlease feel free to consult them for the best care! 💖"
#         ]

#         if not payment_status:
#             return {"message": f"💳 Please make the payment of {price} to receive doctor suggestions.", "room_number": None}

#         message_text = "\n".join(doctor_message)
#         send_sms(message_text)
#         return {"message": message_text, "room_number": room_number}

#     return {"message": f"🤔 No suitable doctors found for the symptoms: {', '.join(user_symptoms_list)}. Please provide more symptoms or check with a general physician.", "room_number": None}

# # Root route to indicate the API is running
# @app.route('/')
# def home():
#     return "Doctor Suggestion Chatbot API is running!"

# # API endpoint to handle doctor suggestions
# @app.route('/suggest_doctor', methods=['POST'])
# def handle_suggest_doctor():
#     df = load_dataset()
#     if df is None:
#         return jsonify({"error": "Dataset could not be loaded."}), 500
    
#     data = request.get_json()
#     symptoms = data.get("symptoms", "")
#     payment_status = data.get("payment_status", False)

#     result = suggest_doctor(df, symptoms, payment_status)
#     return jsonify(result)

# if __name__ == "__main__":
#     app.run(debug=True)





from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
import os
from twilio.rest import Client

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', 'AC9d1139ae2a944f7479c5c223090bea41')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '24fa24a750f2ce88ef031bae5099d6a5')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '+13204007751')
USER_PHONE_NUMBERS = ['+918804339456','+919632983944','+919481680079','+919743352610']  # List of phone numbers

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
    cleaned_input = re.sub(r"\bi have\b|\band\b", "", user_input.lower())
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

# Suggest doctor based on the maximum matching symptoms
def suggest_doctor(df, user_symptoms, payment_status):
    user_symptoms_list = clean_user_input(user_symptoms)
    if not user_symptoms_list:
        return {"message": "🤔 No symptoms provided. Please specify your symptoms clearly.", "room_number": None}

    best_doctor = None
    max_match_count = 0
    for _, row in df.iterrows():
        doctor_symptoms = preprocess_symptoms(row['Symptoms'])
        doctor_name = row['Doctor']
        specialization = row['Specialization']
        price = row['Price']
        room_number = row['Room Number']  # Assume Room Number is a column in your dataset

        match_count = sum(1 for symptom in user_symptoms_list if symptom in doctor_symptoms)
        if match_count > max_match_count:
            max_match_count = match_count
            best_doctor = (doctor_name, specialization, price, room_number)

    if best_doctor and max_match_count >= 2:
        doctor_name, specialization, price, room_number = best_doctor
        doctor_message = [
            "👨‍⚕ Based on your symptoms, we recommend you consult:",
            f"🔍 *  For {specialization}*: {doctor_name}",
            f"🏢 Room Number: {room_number}",
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


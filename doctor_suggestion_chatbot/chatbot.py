

# full done on;y outputis not ccoming in frontend
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# import re

# app = Flask(__name__)
# CORS(app)  # Enable CORS for cross-origin requests

# # Load the dataset
# def load_dataset():
#     try:
#         df = pd.read_csv('D:/CHAT_BOT/doctor_suggestion_chatbot/dataset.csv')
#         print("Dataset loaded successfully.")
#         print(df.head())  # Print the first few rows of the DataFrame
#         return df
#     except FileNotFoundError:
#         print("Dataset file not found. Check the path.")
#         return None

# # Preprocess symptoms by removing extra spaces, converting to lowercase, and splitting by commas
# def preprocess_symptoms(symptom_string):
#     return [symptom.strip().lower() for symptom in re.split(r',\s*', symptom_string)]

# # Clean and process the user's input for symptom matching
# def clean_user_input(user_input):
#     cleaned_input = re.sub(r"\bi have\b|\band\b", "", user_input.lower())
#     user_symptoms_list = [symptom.strip() for symptom in re.split(r',\s*', cleaned_input) if symptom]
#     return user_symptoms_list

# # Suggest doctor based on the maximum matching symptoms
# def suggest_doctor(df, user_symptoms, payment_status):
#     # Clean and process user symptoms
#     user_symptoms_list = clean_user_input(user_symptoms)
#     print(f"User Symptoms List: {user_symptoms_list}")  # Debugging line

#     # Variables to track the best match
#     best_doctor = None
#     max_match_count = 0

#     # Loop through each row of the dataframe to find matching symptoms
#     for _, row in df.iterrows():
#         doctor_symptoms = preprocess_symptoms(row['Symptoms'])
#         doctor_name = row['Doctor']
#         price = row['Price']

#         # Debugging output
#         print(f"Doctor: {doctor_name}, Symptoms: {doctor_symptoms}")

#         # Count the number of symptoms that match
#         match_count = sum(1 for symptom in user_symptoms_list if symptom in doctor_symptoms)
#         print(f"Matching Symptoms Count for {doctor_name}: {match_count}")  # Debugging line

#         # Update best doctor if the current one has more matches
#         if match_count > max_match_count:
#             max_match_count = match_count
#             best_doctor = (doctor_name, row['Specialization'], price)

#     # Prepare the output message
#     if best_doctor and max_match_count >= 3:
#         doctor_name, specialization, price = best_doctor
        
#         # Prepare the doctor recommendation message
#         doctor_message = [
#             "👨‍⚕️ Based on your symptoms, we recommend you consult:",
#             f"🔍 **For {specialization}**: {doctor_name}",
#             "\nPlease feel free to consult them for the best care! 💖"
#         ]

#         # If payment status is False, add payment message
#         if not payment_status:
#             payment_message = f"💳 Please make the payment of {price} to receive doctor suggestions."
#             # Combine both messages
#             return "\n".join([payment_message])

#         return "\n".join(doctor_message)

#     # If no match is found
#     return "🤔 No suitable doctors found. Please provide more symptoms or check with a general physician."

# # Root route to indicate the API is running
# @app.route('/')
# def home():
#     return "Doctor Suggestion Chatbot API is running!"

# # API endpoint to handle doctor suggestions
# @app.route('/suggest_doctor', methods=['POST'])
# def handle_suggest_doctor():
#     df = load_dataset()  # Load the dataset
#     if df is None:
#         return jsonify({"error": "Dataset could not be loaded."}), 500
    
#     data = request.get_json()
#     symptoms = data.get("symptoms", "")
#     payment_status = data.get("payment_status", False)

#     result = suggest_doctor(df, symptoms, payment_status)
    
#     return jsonify({"message": result})

# if __name__ == "__main__":
#     app.run(debug=True)


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
        print(df.head())  # Print the first few rows of the DataFrame
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
    cleaned_input = re.sub(r"[^\w\s,]", "", cleaned_input)  # Remove punctuation
    user_symptoms_list = [symptom.strip() for symptom in re.split(r',\s*', cleaned_input) if symptom]
    return user_symptoms_list

# Suggest doctor based on the maximum matching symptoms
def suggest_doctor(df, user_symptoms, payment_status):
    # Clean and process user symptoms
    user_symptoms_list = clean_user_input(user_symptoms)
    print(f"User Symptoms List: {user_symptoms_list}")  # Debugging line

    # Check if user_symptoms_list is empty
    if not user_symptoms_list:
        return {"message": "🤔 No symptoms provided. Please specify your symptoms clearly."}

    # Variables to track the best match
    best_doctor = None
    max_match_count = 0

    # Loop through each row of the dataframe to find matching symptoms
    for _, row in df.iterrows():
        doctor_symptoms = preprocess_symptoms(row['Symptoms'])
        doctor_name = row['Doctor']
        specialization = row['Specialization']
        price = row['Price']

        # Debugging output
        print(f"Doctor: {doctor_name}, Symptoms: {doctor_symptoms}")  # Debugging line

        # Count the number of symptoms that match
        match_count = sum(1 for symptom in user_symptoms_list if symptom in doctor_symptoms)
        print(f"Matching Symptoms Count for {doctor_name}: {match_count}")  # Debugging line

        # Update best doctor if the current one has more matches
        if match_count > max_match_count:
            max_match_count = match_count
            best_doctor = (doctor_name, specialization, price)

    # Prepare the output message
    if best_doctor and max_match_count >= 2:  # Lowered the threshold from 3 to 2
        doctor_name, specialization, price = best_doctor
        
        # Prepare the doctor recommendation message
        doctor_message = [
            "👨‍⚕️ Based on your symptoms, we recommend you consult:",
            f"🔍 **For {specialization}**: {doctor_name}",
            "\nPlease feel free to consult them for the best care! 💖"
        ]

        # If payment status is False, add payment message
        if not payment_status:
            payment_message = f"💳 Please make the payment of ₹{price} to receive doctor suggestions."
            return {"message": "\n".join([payment_message])}

        return {"message": "\n".join(doctor_message)}

    # If no match is found
    return {"message": f"🤔 No suitable doctors found for the symptoms: {', '.join(user_symptoms_list)}. Please provide more symptoms or check with a general physician."}

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
    payment_status = data.get("payment_status", False)

    result = suggest_doctor(df, symptoms, payment_status)
    
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from twilio.rest import Client

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Twilio Credentials
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', 'AC3a8f0101b4e0b8d8d640ef2f9e650857')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '9d0c784d2e853da915ddc30b81dd91ff')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '+12317945891')
USER_PHONE_NUMBER = '+918804339456'

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Function to send SMS
@app.route('/send-sms', methods=['POST','GET'])
def send_sms(phone, message):
    try:
        print(message)
        response = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=phone
        )
        print(response)
        print(f"SMS sent successfully! Message SID: {response.sid}")
        return True
    except Exception as e:
        print(f"Failed to send SMS: {str(e)}")
        if "Authenticate" in str(e):
            print("Check Twilio SID, Auth Token, and phone numbers.")
        return False

# API endpoint to handle notifications
@app.route('/send-notification', methods=['POST'])
def send_notification():
    try:
        data = request.get_json()
        print("Received data:", data)

        phone = data.get('phone')
        message = data.get('message')

        if not phone or not message:
            return jsonify({"error": "Phone number or message not provided."}), 400

        success = send_sms(phone, message)
        if success:
            return jsonify({"success": True, "message": "Notification sent successfully."})
        else:
            return jsonify({"error": "Failed to send notification."}), 500
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=4000)

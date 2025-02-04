
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from twilio.rest import Client

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Twilio Credentials
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', 'ACeb34f06570a4f319063db593e58792dc')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', 'fc03c2a684612033f10481b143e6aa57')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '+12185015312')
USER_PHONE_NUMBERS = ['+918804339456','+919632983944']  # List of phone numbers

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Function to send SMS to multiple users
def send_sms(message):
    for phone_number in USER_PHONE_NUMBERS:
        try:
            response = client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=phone_number
            )
            print(f"SMS sent successfully to {phone_number}! Message SID: {response.sid}")
        except Exception as e:
            print(f"Failed to send SMS to {phone_number}: {str(e)}")
            if "Authenticate" in str(e):
                print("Check Twilio SID, Auth Token, and phone numbers.")

# API endpoint to handle notifications
@app.route('/send-notification', methods=['POST'])
def send_notification():
    try:
        data = request.get_json()
        print("Received data:", data)

        message = data.get('message')

        if not message:
            return jsonify({"error": "Message not provided."}), 400

        send_sms(message)
        return jsonify({"success": True, "message": "Notification sent successfully."})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=4000)

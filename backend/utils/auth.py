import os
import logging
import firebase_admin
from firebase_admin import auth, credentials
from functools import wraps
from flask import request, jsonify, g
from models.user import User
from extensions import db

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
# Expects serviceAccountKey.json in the backend root
SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), '..', 'serviceAccountKey.json')
FIREBASE_READY = False

try:
    if not firebase_admin._apps:
        if os.path.exists(SERVICE_ACCOUNT_PATH):
            cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin initialized successfully.")
            FIREBASE_READY = True
        else:
            logger.warning("Firebase serviceAccountKey.json not found. Entering Mock Auth Mode for development.")
except Exception as e:
    logger.error(f"Error initializing Firebase Admin: {e}")

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        
        id_token = auth_header.split('Bearer ')[1]
        
        # MOCK AUTH BYPASS (for hackathon/demo when serviceAccountKey is missing)
        if not FIREBASE_READY and id_token == 'mock-token':
            mock_uid = "mock-user-123"
            user = User.query.filter_by(firebase_uid=mock_uid).first()
            if not user:
                user = User(firebase_uid=mock_uid, email="demo@example.com", company_name="Demo Corp")
                db.session.add(user)
                db.session.commit()
            g.user = user
            return f(*args, **kwargs)

        try:
            # Verify the ID token from the frontend
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            email = decoded_token.get('email')
            
            # Find or create user in local DB
            user = User.query.filter_by(firebase_uid=uid).first()
            if not user:
                user = User(firebase_uid=uid, email=email)
                db.session.add(user)
                db.session.commit()
            
            # Add user to Flask 'g' for accessibility in routes
            g.user = user
            
        except Exception as e:
            logger.error(f"Auth verification failed: {e}")
            return jsonify({"error": "Unauthorized", "details": str(e)}), 401
            
        return f(*args, **kwargs)
    return decorated_function

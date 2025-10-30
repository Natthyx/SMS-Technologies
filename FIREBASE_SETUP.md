# Firebase Setup Instructions

## Overview

This project uses both Firebase client SDK for frontend operations and Firebase Admin SDK for backend operations. The service account file (`smsserviceAccount.json`) is used for server-side operations.

## Firestore Security Rules

To enable proper read/write access for the career applications, you need to configure Firestore security rules in the Firebase Console.

### Steps to Configure Firestore Rules:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project "smstechnologiescareer"
3. Navigate to Firestore Database
4. Click on "Rules" tab
5. Replace the existing rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public form submissions
    match /careerApplications/{docId} {
      allow create: if true;  // anyone can submit
      allow read, update, delete: if request.auth != null;  // only authenticated users can read
    }

    // Everything else remains protected
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Click "Publish" to save the rules

## Environment Variables

Make sure all the following environment variables are set in your `.env` file:

```
VITE_EMAILJS_SERVICE_ID=service_yfhsyn2
VITE_EMAILJS_TEMPLATE_ID=template_sw4quli
VITE_EMAILJS_AUTO_TEMPLATE_ID=template_kmc92lv
VITE_EMAILJS_PUBLIC_KEY=xPzM7nmxZ70neMMpD
VITE_FIREBASE_API_KEY=AIzaSyAFyp1o57XsBl5KA7BiNpM94_SrcllMYtY
VITE_FIREBASE_AUTH_DOMAIN=smstechnologiescareer.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smstechnologiescareer
VITE_FIREBASE_STORAGE_BUCKET=smstechnologiescareer.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=822304463205
VITE_FIREBASE_APP_ID=1:822304463205:web:bc27ff06941c3c75b7a98c
VITE_FIREBASE_MEASUREMENT_ID=G-Q631JDD0JW
```

## Service Account Usage

The `smsserviceAccount.json` file is used for server-side operations with the Firebase Admin SDK. This would typically be used in:

1. Backend API endpoints
2. Cloud Functions
3. Server-side data processing

For this client-side application, we continue to use the client SDK with proper authentication.

## Authentication Setup

To enable proper authentication:

1. Go to the Firebase Console
2. Navigate to Authentication > Sign-in method
3. Enable Email/Password authentication
4. Add authorized domains (localhost for development)

## Admin Authentication

The admin credentials are:
- Email: admin@smstechnologies.com
- Password: SMSTechnologies2025

These credentials should be added to Firebase Authentication.

## Testing the Implementation

1. Start the development server: `npm run dev`
2. Navigate to `/career` and submit a test application
3. Check the browser console for any errors
4. Navigate to `/login` and log in with admin credentials
5. Check if applications appear in the admin dashboard

If you still encounter permission errors, double-check that the Firestore rules have been properly updated and published.

## Server-Side Operations

For server-side operations using the service account:

1. Create API endpoints that use the Firebase Admin SDK
2. Use the service account credentials for privileged operations
3. Implement proper authentication and authorization checks
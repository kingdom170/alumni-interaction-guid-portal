# Deploying Firebase Rules

This guide explains how to deploy your Firestore and Storage security rules to your Firebase project.

## Prerequisites

- Firebase CLI installed
- Authenticated with Firebase

## Installation

If you haven't installed the Firebase CLI:

```bash
npm install -g firebase-tools
```

## Login to Firebase

```bash
firebase login
```

## Initialize Firebase (if not already done)

```bash
firebase init
```

Select:
- ✅ Firestore
- ✅ Storage

This will create `firebase.json` if it doesn't exist.

## Update firebase.json

Make sure your `firebase.json` includes:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

## Deploy Rules

### Deploy Everything

```bash
firebase deploy
```

### Deploy Only Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Deploy Only Storage Rules

```bash
firebase deploy --only storage
```

## Test Rules Locally (Optional)

You can test your rules using the Firebase Emulator:

```bash
firebase emulators:start
```

This will start local emulators for Firestore and Storage where you can test your security rules before deploying to production.

## Verify Deployment

After deployment, verify your rules in the Firebase Console:

1. Go to https://console.firebase.google.com
2. Select your project (alumini-45997)
3. Navigate to **Firestore Database** → **Rules**
4. Navigate to **Storage** → **Rules**

## Important Security Notes

⚠️ **Before Deploying:**
- Review all rules carefully
- Test with different user roles
- Ensure no data is publicly accessible
- Verify file size and type restrictions

✅ **After Deploying:**
- Test user authentication flows
- Verify role-based access works correctly
- Test file uploads with size/type restrictions
- Monitor Firebase Console for security warnings

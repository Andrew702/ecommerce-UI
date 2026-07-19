// Copy this file to environment.ts and fill in your real keys.
// environment.ts is gitignored — never commit real keys.

export const environment = {
    production: false,
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID"
    },
    stripePublicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY'
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "amine.aouina.lp.4@gmail.com",
        clientId: "365220988857-s0phi3fp45sidpg4vfk169uetjs4alis.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//04U4dzaWtJD57CgYIARAAGAQSNwF-L9IrpdFGiCqprrPdfdk0j3J4Q5KZfi_AZU78syqSd5fBU7LamwexoeUt6GIa9oQ9UF6q8o0",
    },
});
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    const mailOptions = {
        from: "amine.aouina.lp.4@gmail.com",
        to: user.email,
        subject: "Welcome to our application!",
        text: "Welcome to our application! Thank you for signing up!",
    };
    return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Sent email", info);
    });
});
exports.notifyCandidates = functions.firestore
    .document("jobs/{jobId}")
    .onCreate(async (snap) => {
    // Fetch job details
    const jobData = snap.data();
    // Query all users
    const candidatesSnapshot = await admin.firestore().collection("users").get();
    // For each candidate, send notification
    candidatesSnapshot.forEach(async (candidate) => {
        const userToken = candidate.data().fcmToken;
        const message = {
            notification: {
                title: "New Job Alert",
                body: `A new job posting you might be interested in: ${jobData.title}`,
                icon: "/path_to_icon.png", // Update with path to your notification icon
            },
        };
        // Send the message to the candidate's FCM token
        await admin.messaging().sendToDevice(userToken, message);
        console.log("Notification sent to:", userToken);
    });
});
//# sourceMappingURL=index.js.map
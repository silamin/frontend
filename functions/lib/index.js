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
exports.notifyNewJob = functions.firestore
    .document('jobs/{documentId}')
    .onCreate(async (snapshot, context) => {
    try {
        const usersSnapshot = await admin.firestore().collection('users').get();
        const notificationPromises = [];
        for (const userDoc of usersSnapshot.docs) {
            const fcmToken = userDoc.data().fcmToken;
            if (fcmToken) {
                const message = {
                    notification: {
                        title: 'New Job',
                        body: 'A new job has been added!',
                    },
                    token: fcmToken,
                };
                notificationPromises.push(admin.messaging().send(message));
            }
        }
        await Promise.all(notificationPromises);
        console.log('Notifications sent successfully');
    }
    catch (error) {
        console.log('Error sending notifications:', error);
    }
});
//# sourceMappingURL=index.js.map
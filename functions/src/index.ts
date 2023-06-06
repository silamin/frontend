import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import {SentMessageInfo} from "nodemailer";


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
  const mailOptions: nodemailer.SendMailOptions = {
    from: "amine.aouina.lp.4@gmail.com",
    to: user.email,
    subject: "Welcome to our application!",
    text: "Welcome to our application! Thank you for signing up!",
  };

  return transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
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
      // Only get documents where `fcmToken` is not null
      const usersSnapshot = await admin.firestore().collection('users').where("fcmToken", "!=", null).get();
      const notificationPromises = [];

      console.log(`Total users: ${usersSnapshot.size}`); // log total number of users fetched

      for (const userDoc of usersSnapshot.docs) {
        const fcmToken = userDoc.data().fcmToken;

        if (fcmToken) {
          console.log(`Sending message to fcmToken: ${fcmToken}`); // log the token

          const message = {
            notification: {
              title: 'New Job',
              body: 'A new job has been added!',
            },
            token: fcmToken,
          };

          notificationPromises.push(admin.messaging().send(message));
        } else {
          console.log(`No valid fcmToken for user: ${userDoc.id}`); // log if the user has no valid token
        }
      }

      await Promise.all(notificationPromises);

      console.log('Notifications sent successfully');
    } catch (error) {
      console.log('Error sending notifications:', error);
    }
  });

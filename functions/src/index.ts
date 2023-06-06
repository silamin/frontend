import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";
import {SentMessageInfo} from "nodemailer";
import * as admin from "firebase-admin";
import * as serviceAccount from "../serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

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
  .document("jobs/{documentId}")
  .onCreate(async () => {
    try {
      // Get all user documents
      const usersSnapshot = await admin.firestore().collection("users").get();

      console.log(`Total users: ${usersSnapshot.size}`);

      const sendPromises: Promise<string>[] = [];

      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        console.log(`User: ${userDoc.id}, FCM Token: ${userData.fcmToken}`);

        // Only send a message if the fcmToken exists and is a non-empty string
        if (userData.fcmToken && typeof userData.fcmToken === "string" && userData.fcmToken.trim() !== "") {
          console.log(`Sending message to fcmToken: ${userData.fcmToken}`);
          try {
            if (userData.fcmToken) {
              const message = {
                token: userData.fcmToken,
                notification: {
                  title: "Notification Title",
                  body: "Notification Body",
                },
              };

              console.log(`Message: ${JSON.stringify(message)}`);

              // Send the message
              sendPromises.push(admin.messaging().send(message));
            }
          } catch (error) {
            console.log(`Error sending message to ${userDoc.id}:`, error);
          }
        } else {
          console.log(`Skipping user with invalid fcmToken: ${userDoc.id}`);
        }
      });

      await Promise.all(sendPromises);

      console.log("Notifications sent successfully");
    } catch (error) {
      console.log("Error sending notifications:", error);
    }
  });

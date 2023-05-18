import { sign } from "jsonwebtoken";
import { createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";
import { EMAIL_VERIFICATION_TOKEN_SECRET, prisma } from "./constants";

export interface EmailTokenPayload {
    email: string;
    userId: string;
}

export const sendEmailToken = async (email: string, userId: string) => {
    const token = sign({ email, userId }, EMAIL_VERIFICATION_TOKEN_SECRET, {
        expiresIn: "1h",
    });
    await sendEmail(email, token, "Email Verification")
}

// async..await is not allowed in global scope, must use a wrapper
export const sendResetPasswordToken = async (email: string, userId: string) => {
    const token = sign({ email, userId }, EMAIL_VERIFICATION_TOKEN_SECRET, {
        expiresIn: "1h",
    });

    // save token to database
    // update existing token
    await prisma.forgotPasswordTokens.upsert({
        where: { userId },
        update: { token },
        create: { userId, token }
    })

    await sendEmail(email, token, "Password Reset")
}

export async function sendEmail(email: string, text: string, subject: string) {

    let testAccount = await createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"OneStop" <bot@onestop.com>', // sender address
        to: email, // list of receivers
        subject, // Subject line
        text, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

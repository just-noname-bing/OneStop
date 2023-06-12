import { sign } from "jsonwebtoken";
import {
    createTestAccount,
    createTransport,
    getTestMessageUrl,
} from "nodemailer";
import {
    DOMAIN,
    EMAIL_VERIFICATION_TOKEN_SECRET,
    prisma,

} from "./constants";
import Mail from "nodemailer/lib/mailer";

export interface EmailTokenPayload {
    email: string;
    userId: string;
}

export const sendEmailToken = async (email: string, userId: string) => {
    const token = sign({ email, userId }, EMAIL_VERIFICATION_TOKEN_SECRET, {
        expiresIn: "1h",
    });

    // const expoUrl =
    //     "exp://192.168.118.132:19000/--/email-verification?token=" + token;
    const link = `<a href="${DOMAIN}/expo/redirect/email-verification/${token}">${token}</a>`;

    await sendEmail(email, link, "Email Verification");
};

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
        create: { userId, token },
    });

    await sendEmail(email, token, "Password Reset");
};

export async function sendEmail(email: string, text: string, subject: string) {
    let testAccount = await createTestAccount();
    let realAccount = {
        user: "onestop.bot124@gmail.com",
        pass: "kxnrbibqncmainyl",
    };

    // create reusable transporter object using the default SMTP transport
    let transporterTest = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    let transporterReal = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: realAccount.user, // generated ethereal user
            pass: realAccount.pass, // generated ethereal password
        },
    });

    const message: Mail.Options = {
        from: '"OneStop" <bot@onestop.com>', // sender address
        to: email, // list of receivers
        subject, // Subject line
        html: text, // plain text body
    };

    // send mail with defined transport object
    let infoTest = await transporterTest.sendMail(message);

    await transporterReal.sendMail(message);

    console.log("Message sent: %s", infoTest.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", getTestMessageUrl(infoTest));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

import { sign } from "jsonwebtoken";
import { createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";
import { emailVerificationToken_secret } from "./constants";

export interface EmailTokenPayload {
	email: string;
	userId: string;
}

const ValidateEmail = async (email: string, userId: string) => {
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

	const token = sign({ email, userId }, emailVerificationToken_secret, {
		expiresIn: "1h",
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Jean Overwtach" <foo@example.com>', // sender address
		to: email, // list of receivers
		subject: "Email verification", // Subject line
		text: token, // plain text body
		html: `<b>${token}</b>`, // html body
	});

	console.log("Message sent: %s", info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log("Preview URL: %s", getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

export default ValidateEmail;

// async..await is not allowed in global scope, must use a wrapper

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const nodemailer_1 = require("nodemailer");
const constants_1 = require("./constants");
const ValidateEmail = async (email, userId) => {
    let testAccount = await (0, nodemailer_1.createTestAccount)();
    let transporter = (0, nodemailer_1.createTransport)({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    const token = (0, jsonwebtoken_1.sign)({ email, userId }, constants_1.emailVerificationToken_secret, {
        expiresIn: "1h",
    });
    let info = await transporter.sendMail({
        from: '"Jean Overwtach" <foo@example.com>',
        to: email,
        subject: "Email verification",
        text: token,
        html: `<b>${token}</b>`,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", (0, nodemailer_1.getTestMessageUrl)(info));
};
exports.default = ValidateEmail;
//# sourceMappingURL=validateEmail.js.map
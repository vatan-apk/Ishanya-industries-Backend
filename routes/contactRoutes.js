import express from "express";
import dotenv from "dotenv";
dotenv.config();
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const {
      name,
      phone,
      email,
      company,
      message
    } = req.body;


    // Required Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }


    // Length Validation
    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Message too long"
      });
    }


    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }


    // Save Clean Data Only
    await Contact.create({
      name,
      phone,
      email,
      company,
      message
    });

await transporter.sendMail({
  from: `"Company Website" <${process.env.EMAIL_USER}>`,

  to: process.env.EMAIL_USER,

  replyTo: email,

subject: `New Business Client | ${name}`,
  html: `
    <div style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 30px;
    ">

      <div style="
        max-width: 600px;
        margin: auto;
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      ">

        <h1 style="
          color: #111827;
          margin-bottom: 10px;
        ">
          📩 New Contact Request
        </h1>

        <p style="
          color: #6b7280;
          margin-bottom: 30px;
        ">
          A new inquiry has been submitted through your company website.
        </p>

        <table style="
          width: 100%;
          border-collapse: collapse;
        ">

          <tr>
            <td style="padding: 12px; font-weight: bold;">Name</td>
            <td style="padding: 12px;">${name}</td>
          </tr>

          <tr style="background-color:#f9fafb;">
            <td style="padding: 12px; font-weight: bold;">Phone</td>
            <td style="padding: 12px;">${phone || "Not Provided"}</td>
          </tr>

          <tr>
            <td style="padding: 12px; font-weight: bold;">Email</td>
            <td style="padding: 12px;">${email}</td>
          </tr>

          <tr style="background-color:#f9fafb;">
            <td style="padding: 12px; font-weight: bold;">Company</td>
            <td style="padding: 12px;">
              ${company || "Not Provided"}
            </td>
          </tr>

        </table>

        <div style="
          margin-top: 30px;
          padding: 20px;
          background-color: #f9fafb;
          border-left: 4px solid #111827;
          border-radius: 8px;
        ">

          <p style="
            margin: 0 0 10px 0;
            font-weight: bold;
          ">
            Message
          </p>

          <p style="
            margin: 0;
            color: #374151;
            line-height: 1.6;
          ">
            ${message}
          </p>

        </div>

        <p style="
          margin-top: 30px;
          font-size: 13px;
          color: #9ca3af;
          text-align: center;
        ">
          This email was automatically generated from your website contact form.
        </p>

      </div>
    </div>
  `
});

    res.status(201).json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

export default router;
import XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const wb = XLSX.utils.book_new();
const data = [
  ['Name', 'Email', 'Course', 'Status', 'Date'],
  ['Anshul Jha', 'anshuljha1149@gmail.com', 'AI Live Cohort', 'Completed', new Date().toISOString().split('T')[0]],
];
const ws = XLSX.utils.aoa_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, 'Students');

const filePath = path.join(__dirname, 'test_certificates.xlsx');
XLSX.writeFile(wb, filePath);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'support@edrilla.com',
    pass: process.env.SMTP_PASS || 'vjbfuqityyfivvii',
  },
});

const info = await transporter.sendMail({
  from: `"Edrilla" <${process.env.SMTP_USER || 'support@edrilla.com'}>`,
  to: 'anshuljha1149@gmail.com',
  subject: 'Test Excel File - Certificate Report',
  text: 'Please find attached the test Excel file.',
  attachments: [{ filename: 'test_certificates.xlsx', path: filePath }],
});

console.log('Sent:', info.messageId);

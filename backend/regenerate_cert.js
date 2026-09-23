import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Certificate from './models/Certificate.js';
import User from './models/user.js';
import Course from './models/Course.js';
import CertificateTemplate from './models/CertificateTemplate.js';
import { generateCertificatePDF } from './utils/certificateGenerator.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const certId = process.argv[2];
const cert = await Certificate.findById(certId).lean();

const user = await User.findById(cert.user_id).select('fullName').lean();
const course = cert.course_id ? await Course.findById(cert.course_id).select('title').lean() : null;
const instructor = cert.instructor_id ? await User.findById(cert.instructor_id).select('fullName').lean() : null;

const template = await CertificateTemplate.findById(cert.certification_template).lean();

const certificateData = {
  student_name: user.fullName || 'Student',
  course_name: course?.title || 'Course',
  completion_date: cert.completion_date ? new Date(cert.completion_date) : new Date(),
  instructor_name: instructor?.fullName || cert.instructor_name || 'Instructor',
  platform_name: 'OS Academy',
};

const newUrl = await generateCertificatePDF({ template, certificateData });

const uploadsDir = path.join(process.cwd(), 'uploads');
const fileName = `certificate_${cert._id}.pdf`;
const newPath = path.join(uploadsDir, fileName);
const newRelativePath = `uploads/${fileName}`;

const tempPath = path.join(process.cwd(), newUrl);
if (fs.existsSync(tempPath)) {
  if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
  fs.renameSync(tempPath, newPath);
}

await Certificate.findByIdAndUpdate(cert._id, { certificate_url: newRelativePath });
console.log('Regenerated:', newRelativePath);
await mongoose.disconnect();

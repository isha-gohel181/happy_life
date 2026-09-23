import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import XLSX from 'xlsx';
import CourseEnrollment from './models/CourseEnrollment.js';
import User from './models/user.js';
import Course from './models/Course.js';
import './models/CourseBundle.js';
import './models/CoursePlan.js';

async function generateAdminEnrollmentsReport() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const enrollments = await CourseEnrollment.find({
      enrollmentSource: 'admin'
    })
      .populate('userId', 'fullName email phone role status')
      .populate('courseId', 'title slug')
      .populate('courseBundleId', 'title slug')
      .populate('coursePlanId', 'title')
      .sort({ enrolledAt: -1 })
      .lean();

    console.log(`Found ${enrollments.length} admin enrollments`);

    const rows = enrollments.map((e, i) => ({
      '#': i + 1,
      'Student Name': e.userId?.fullName || '',
      'Email': e.userId?.email || '',
      'Phone': e.userId?.phone || '',
      'Course Title': e.courseId?.title || e.courseBundleId?.title || e.coursePlanId?.title || '',
      'Type': e.type || '',
      'Enrolled At': e.enrolledAt ? new Date(e.enrolledAt).toLocaleString() : '',
      'Status': e.status || '',
      'Access Type': e.accessType || '',
      'Access Expiry': e.accessExpiry ? new Date(e.accessExpiry).toLocaleString() : '',
      'Enrollment Source': e.enrollmentSource || '',
      'Price Paid': e.pricePaid ?? 0,
      'Progress %': e.progressPercentage ?? 0,
      'Completed': e.iscompleted ? 'Yes' : 'No',
      'Certificate Issued': e.certificateIssued ? 'Yes' : 'No',
      'Withdrawn': e.isWithdrawn ? 'Yes' : 'No',
      'Order ID': e.orderId ? e.orderId.toString() : ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    ws['!cols'] = [
      { wch: 4 }, { wch: 25 }, { wch: 30 }, { wch: 18 },
      { wch: 40 }, { wch: 12 }, { wch: 22 }, { wch: 10 },
      { wch: 14 }, { wch: 22 }, { wch: 18 }, { wch: 12 },
      { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 10 },
      { wch: 26 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Admin Enrollments');

    const filename = `admin_enrollments_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
    console.log(`Report saved: ${filename}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

generateAdminEnrollmentsReport();

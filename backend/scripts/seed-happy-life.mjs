import 'dotenv/config';
import mongoose from 'mongoose';
import CourseCategory from '../models/CourseCategory.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import JobPosting from '../models/JobPosting.js';
import ForumThread from '../models/ForumThread.js';
import News from '../models/News.js';
import Banner from '../models/Banner.js';
import Testimonial from '../models/Testimonial.js';
import User from '../models/user.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ishagohel181:JHf4FanNi8VCBZz0@cluster0.pmyvsgz.mongodb.net/happy_life?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  console.log('Connecting to MongoDB at:', MONGO_URI);
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
  console.log('✅ Connected to MongoDB');

  // 1. Get or create Admin user for author references
  let admin = await User.findOne({ email: 'admin@happylife.com' });
  if (!admin) {
    admin = await User.findOne({ role: 'admin' });
  }
  if (!admin) {
    admin = await User.create({
      fullName: 'Happy Life Admin',
      email: 'admin@happylife.com',
      password: 'password_hash_placeholder',
      role: 'admin',
      is_verify: true,
      emailVerified: true,
      status: 'active',
      isActive: true
    });
  }
  const adminId = admin._id;

  // 2. Seed Categories
  console.log('--- Seeding Categories ---');
  const categoriesData = [
    { name: 'Astrology & Numerology', slug: 'astrology-numerology', status: 'active', image: '/images/logo/osa_logo.png' },
    { name: 'Life Coaching & Wellness', slug: 'life-coaching-wellness', status: 'active', image: '/images/logo/osa_logo.png' },
    { name: 'Business & Financial Mastery', slug: 'business-financial-mastery', status: 'active', image: '/images/logo/osa_logo.png' },
    { name: 'Solopreneur & Automation', slug: 'solopreneur-automation', status: 'active', image: '/images/logo/osa_logo.png' }
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    let existing = await CourseCategory.findOne({ slug: cat.slug });
    if (!existing) {
      existing = await CourseCategory.create(cat);
      console.log(`Created Category: ${existing.name}`);
    } else {
      console.log(`Category already exists: ${existing.name}`);
    }
    categoryMap[cat.slug] = existing._id;
  }

  // 3. Seed Courses with Modules & Lessons
  console.log('--- Seeding Courses ---');
  const coursesToSeed = [
    {
      title: 'Complete Solopreneur & Life Mastery Program',
      subtitle: 'Align Your Energy, Master Business Automation, and Lead with Purpose',
      slug: 'complete-solopreneur-mastery',
      description: 'A transformative blueprint for modern creators and entrepreneurs to automate high-margin businesses, align their cosmic energy, and achieve financial independence without burnout.',
      shortDescription: 'Master modern solopreneurship, AI workflow automation, and life balance.',
      categoryId: categoryMap['solopreneur-automation'],
      price: 4999,
      salePrice: 1999,
      discountPrice: 1999,
      currency: 'INR',
      instructorId: adminId,
      isPublished: true,
      level: ['beginner', 'intermediate', 'advanced'],
      tags: ['Solopreneur', 'AI Automation', 'Mindset', 'Business'],
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
      duration: 360,
      totalLessons: 6,
      landingPageSections: [
        {
          type: 'overview',
          data: {
            show: true,
            title: 'Complete Solopreneur & Life Mastery Program',
            subtitle: 'Align Your Energy, Master Business Automation, and Lead with Purpose',
            badge: 'Flagship Masterclass',
            description: 'Learn how to leverage AI tools, freelancers, and personal energy alignment to build a high-margin digital business.'
          }
        },
        {
          type: 'comparison',
          data: {
            show: true,
            leftTitle: 'Traditional Programs',
            rightTitle: 'Happy Life Masterclass',
            leftPoints: [
              'Beginner focus, heavy theory with no practical tools',
              'Taught by instructors who never ran independent businesses',
              'Prepares you for 9-to-5 jobs and makes you dependent',
              'Fragmented topics with no cohesive system',
              'No personalized mentorship or community support'
            ],
            rightPoints: [
              '100% practical, real-world automated workflows & client systems',
              'Taught with 14+ years of actual business and consulting experience',
              'Focuses on true autonomy, self-leadership, and life freedom',
              'Complete step-by-step blueprint from energy to execution',
              'Direct 1-on-1 mentorship and thriving community access'
            ]
          }
        },
        {
          type: 'benefits',
          data: {
            show: true,
            title: 'What You Will Achieve',
            points: [
              'Train your custom GPTs and automate routine tasks',
              'Learn client on-boarding, pricing, and project handover',
              'Master project management and efficient delegation',
              'Hands-on sales, closing, and proposal training',
              'Understand profitability metrics, client retention, and KRAs',
              'Direct 1-on-1 mentorship sessions for personalized clarity'
            ]
          }
        }
      ],
      modulesData: [
        {
          title: 'Chapter 01: Energy Alignment & Mindset Foundation',
          description: 'Unlock clarity, personal archetypes, and the psychological framework for sustainable execution.',
          lessons: [
            {
              title: 'Discovering Your Core Archetype & Energy Flow',
              description: 'An in-depth session on identifying your natural strengths and aligning daily habits with your prime energy states.',
              type: 'video',
              duration: 25,
              isFree: true
            },
            {
              title: 'Designing Your High-Performance Daily Architecture',
              description: 'Step-by-step blueprint for building a distraction-free routine that fuels creativity and calm focus.',
              type: 'text',
              duration: 15,
              isFree: false
            }
          ]
        },
        {
          title: 'Chapter 02: AI Workflows & Business Automation',
          description: 'Build your autonomous business stack using custom GPTs, automated pipeline setups, and smart workflows.',
          lessons: [
            {
              title: 'Building Custom AI Workflows & Client Copilots',
              description: 'Hands-on tutorial on training customized AI models to handle research, copywriting, and operational tasks.',
              type: 'video',
              duration: 40,
              isFree: false
            },
            {
              title: 'Client Acquisition, Onboarding & Smooth Handover',
              description: 'Create high-converting proposals, automate contracts, and establish frictionless client onboarding systems.',
              type: 'video',
              duration: 35,
              isFree: false
            }
          ]
        },
        {
          title: 'Chapter 03: Scaling & Financial Freedom',
          description: 'Transition from solo operator to a leveraged leader with proven pricing strategies and mentorship.',
          lessons: [
            {
              title: 'High-Margin Pricing & Profitability Mastery',
              description: 'How to price based on transformative value rather than trading hours for dollars.',
              type: 'video',
              duration: 30,
              isFree: false
            },
            {
              title: '1-on-1 Mentorship Integration & Final Roadmap',
              description: 'Your long-term execution playbook with direct review steps and accountability guidelines.',
              type: 'video',
              duration: 20,
              isFree: false
            }
          ]
        }
      ]
    },
    {
      title: 'Cosmic Career & Financial Timing Mastery',
      subtitle: 'Unlock Astrological Insights to Navigate Major Life & Business Decisions',
      slug: 'cosmic-career-financial-timing',
      description: 'Harness the ancient wisdom of astrological timing and planetary cycles to optimize major business launches, career transitions, and wealth creation.',
      shortDescription: 'Navigate major decisions with astrological timing and cosmic alignment.',
      categoryId: categoryMap['astrology-numerology'],
      price: 2999,
      salePrice: 999,
      discountPrice: 999,
      currency: 'INR',
      instructorId: adminId,
      isPublished: true,
      level: ['beginner', 'intermediate'],
      tags: ['Astrology', 'Career', 'Timing', 'Success'],
      thumbnail: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
      duration: 180,
      totalLessons: 4,
      modulesData: [
        {
          title: 'Module 1: Foundations of Planetary Cycles',
          description: 'Understanding key astrological transits and how they correspond to energy shifts in career and relationships.',
          lessons: [
            {
              title: 'Understanding Key Planetary Transits & Life Phases',
              description: 'How to map favorable periods for investments, career changes, and personal growth.',
              type: 'video',
              duration: 30,
              isFree: true
            },
            {
              title: 'Career Houses & Identifying Your True Calling',
              description: 'Analyzing the 10th and 2nd houses to uncover natural vocational aptitudes.',
              type: 'video',
              duration: 35,
              isFree: false
            }
          ]
        },
        {
          title: 'Module 2: Strategic Decision Timing',
          description: 'Practical tools to calculate auspicious timing (Muhurat) for launches, contracts, and partnerships.',
          lessons: [
            {
              title: 'Timing Major Business Launches & Agreements',
              description: 'Practical calculation of optimal timing windows for maximum success.',
              type: 'video',
              duration: 45,
              isFree: false
            },
            {
              title: 'Remedies, Gemstones & Energy Harmonization',
              description: 'Practical, grounded remedies to balance planetary influences in your daily environment.',
              type: 'text',
              duration: 20,
              isFree: false
            }
          ]
        }
      ]
    },
    {
      title: 'Mindful Energy & Holistic Relationship Harmony',
      subtitle: 'Build Deep Connection, Resolve Conflict, and Foster Lifelong Balance',
      slug: 'mindful-energy-relationship-harmony',
      description: 'A comprehensive guide to understanding interpersonal dynamics, emotional intelligence, and energetic alignment in personal and professional relationships.',
      shortDescription: 'Elevate emotional intelligence and build harmonious relationships.',
      categoryId: categoryMap['life-coaching-wellness'],
      price: 1999,
      salePrice: 499,
      discountPrice: 499,
      currency: 'INR',
      instructorId: adminId,
      isPublished: true,
      level: ['beginner'],
      tags: ['Relationships', 'Wellness', 'Communication', 'Harmony'],
      thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&auto=format&fit=crop&q=80',
      duration: 120,
      totalLessons: 3,
      modulesData: [
        {
          title: 'Module 1: Emotional Intelligence & Inner Balance',
          description: 'Cultivating emotional resilience and non-reactive communication.',
          lessons: [
            {
              title: 'The Mirror Principle: Healing Inner Conflict',
              description: 'How internal balance directly transforms external communication and relationships.',
              type: 'video',
              duration: 25,
              isFree: true
            },
            {
              title: 'Compassionate Communication & Boundary Setting',
              description: 'Setting healthy boundaries with clarity, empathy, and strength.',
              type: 'video',
              duration: 35,
              isFree: false
            },
            {
              title: 'Daily Practices for Sustained Inner Peace',
              description: 'Guided meditations and reflective prompts for lasting harmony.',
              type: 'text',
              duration: 15,
              isFree: false
            }
          ]
        }
      ]
    }
  ];

  for (const cData of coursesToSeed) {
    let course = await Course.findOne({ slug: cData.slug });
    const { modulesData, ...courseFields } = cData;

    if (!course) {
      course = await Course.create(courseFields);
      console.log(`Created Course: ${course.title}`);
    } else {
      Object.assign(course, courseFields);
      await course.save();
      console.log(`Updated Course: ${course.title}`);
    }

    // Create Modules and Lessons
    const moduleIds = [];
    let lessonCount = 0;

    for (let mIdx = 0; mIdx < modulesData.length; mIdx++) {
      const mItem = modulesData[mIdx];
      let mod = await Module.findOne({ courseId: course._id, order: mIdx + 1 });
      if (!mod) {
        mod = await Module.create({
          courseId: course._id,
          title: mItem.title,
          description: mItem.description,
          order: mIdx + 1,
          isPublished: true
        });
      } else {
        mod.title = mItem.title;
        mod.description = mItem.description;
        await mod.save();
      }

      const lessonIds = [];
      for (let lIdx = 0; lIdx < mItem.lessons.length; lIdx++) {
        const lItem = mItem.lessons[lIdx];
        let lesson = await Lesson.findOne({ moduleId: mod._id, order: lIdx + 1 });
        if (!lesson) {
          lesson = await Lesson.create({
            courseId: course._id,
            section: course._id,
            moduleId: mod._id,
            title: lItem.title,
            description: lItem.description,
            type: lItem.type,
            duration: lItem.duration,
            isFree: lItem.isFree,
            order: lIdx + 1,
            isPublished: true,
            language: 'English'
          });
        } else {
          lesson.title = lItem.title;
          lesson.description = lItem.description;
          lesson.section = course._id;
          await lesson.save();
        }
        lessonIds.push(lesson._id);
        lessonCount++;
      }

      mod.lessons = lessonIds;
      await mod.save();
      moduleIds.push(mod._id);
    }

    course.modules = moduleIds;
    course.totalLessons = lessonCount;
    await course.save();
  }

  // 4. Seed Gigs / Jobs
  console.log('--- Seeding Gigs / Jobs ---');
  const jobsData = [
    {
      title: 'AI Automation & Custom Workflow Specialist',
      description: 'Looking for a skilled AI Automation specialist to design custom GPT workflows, automate client onboarding, and integrate Zapier / Make.com pipelines for our digital agency.',
      category: 'AI & Automation',
      skillsRequired: ['OpenAI APIs', 'Prompt Engineering', 'Zapier', 'Python', 'Workflow Design'],
      experienceLevel: 'intermediate',
      budget: { min: 35000, max: 70000, currency: 'INR' },
      mode: 'freelance',
      location: { type: 'remote' },
      estimatedDuration: { value: 3, unit: 'months' },
      isAdminApproved: true,
      status: true,
      createdBy: adminId
    },
    {
      title: 'Video Editor & Social Media Content Creator',
      description: 'Create engaging short-form video content (Reels, YouTube Shorts) and educational carousels focusing on personal growth, astrology insights, and business building.',
      category: 'Content & Media',
      skillsRequired: ['Adobe Premiere Pro', 'CapCut', 'Canva', 'Motion Graphics', 'Storytelling'],
      experienceLevel: 'intermediate',
      budget: { min: 25000, max: 50000, currency: 'INR' },
      mode: 'part-time',
      location: { type: 'remote' },
      estimatedDuration: { value: 6, unit: 'months' },
      isAdminApproved: true,
      status: true,
      createdBy: adminId
    },
    {
      title: 'Community Manager & Student Support Coordinator',
      description: 'Facilitate community engagement in our forums, host live weekly Q&A check-ins, and ensure every student gets timely answers to their queries.',
      category: 'Community & Operations',
      skillsRequired: ['Community Management', 'Customer Support', 'Communication', 'Event Hosting'],
      experienceLevel: 'beginner',
      budget: { min: 20000, max: 40000, currency: 'INR' },
      mode: 'full-time',
      location: { type: 'remote' },
      estimatedDuration: { value: 12, unit: 'months' },
      isAdminApproved: true,
      status: true,
      createdBy: adminId
    },
    {
      title: 'Senior Astrology & Life Consultant',
      description: 'Conduct personalized chart readings, career forecasting sessions, and provide actionable life coaching to premium clients.',
      category: 'Consulting',
      skillsRequired: ['Vedic Astrology', 'Chart Analysis', 'Numerology', 'Empathetic Counseling'],
      experienceLevel: 'expert',
      budget: { min: 60000, max: 120000, currency: 'INR' },
      mode: 'contract',
      location: { type: 'remote' },
      estimatedDuration: { value: 6, unit: 'months' },
      isAdminApproved: true,
      status: true,
      createdBy: adminId
    }
  ];

  for (const job of jobsData) {
    let existing = await JobPosting.findOne({ title: job.title });
    if (!existing) {
      await JobPosting.create(job);
      console.log(`Created Job / Gig: ${job.title}`);
    } else {
      console.log(`Job already exists: ${job.title}`);
    }
  }

  // 5. Seed Forum Threads
  console.log('--- Seeding Forum Threads ---');
  const forumThreadsData = [
    {
      title: 'Welcome to the Happy Life Community! Introduce Yourself Here 🎉',
      content: 'Welcome everyone! This community is built to help you align your energy, master modern solopreneur skills, and connect with fellow seekers and builders. Drop a comment below with your name, where you are from, and your main goal for this year!',
      tags: ['welcome', 'community', 'general'],
      isPinned: true,
      isApproved: true,
      Is_openSource: true,
      createdBy: adminId
    },
    {
      title: 'How AI Automation freed up 15 hours in my weekly schedule',
      content: 'I used to spend 4 hours every Monday on manual data entry and drafting client emails. By setting up a custom GPT with specific prompt templates, I cut that down to 20 minutes. What is one repetitive task you are trying to automate right now?',
      tags: ['solopreneur', 'automation', 'productivity'],
      isPinned: false,
      isApproved: true,
      Is_openSource: true,
      createdBy: adminId
    },
    {
      title: 'The Power of Morning Routines: Combining Mindful Focus with Daily Action',
      content: 'Starting the morning with 15 minutes of quiet reflection and reviewing top 3 priorities before opening email or social media completely shifts energy for the entire day. What does your morning routine look like?',
      tags: ['mindset', 'wellness', 'habits'],
      isPinned: false,
      isApproved: true,
      Is_openSource: true,
      createdBy: adminId
    },
    {
      title: 'Client Onboarding Checklist: Ensuring 100% Satisfaction from Day 1',
      content: 'A smooth onboarding experience sets the tone for the entire client relationship. Always establish clear milestones, communication channels, and deliverables up front. Here is what we include in our standard welcome deck...',
      tags: ['freelance', 'client-management', 'business'],
      isPinned: false,
      isApproved: true,
      Is_openSource: true,
      createdBy: adminId
    }
  ];

  for (const thread of forumThreadsData) {
    let existing = await ForumThread.findOne({ title: thread.title });
    if (!existing) {
      await ForumThread.create(thread);
      console.log(`Created Forum Thread: ${thread.title}`);
    } else {
      console.log(`Forum thread already exists: ${thread.title}`);
    }
  }

  // 6. Seed News & Articles
  console.log('--- Seeding News & Blog Articles ---');
  const newsData = [
    {
      title: 'The Rise of the Modern Solopreneur: Why 2026 Belongs to Agile Creators',
      articleTitle: 'The Rise of the Modern Solopreneur',
      slug: 'rise-of-the-modern-solopreneur-2026',
      summary: 'Explore how accessible AI tools, remote workflows, and focused niche expertise are empowering individuals to build 7-figure businesses with zero full-time staff.',
      content: 'The landscape of entrepreneurship has fundamentally changed. Today, a single dedicated solopreneur equipped with modern automation and authentic communication can outpace traditional large teams...',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      url: 'https://happylife.com/news/rise-of-the-modern-solopreneur-2026',
      publishedAt: new Date(),
      categories: ['Business & Growth'],
      tags: ['Solopreneur', 'Automation', 'AI', 'Future of Work'],
      author: 'Happy Life Editorial'
    },
    {
      title: 'Harmonizing Cosmic Timing with Major Career and Business Decisions',
      articleTitle: 'Harmonizing Cosmic Timing with Career Decisions',
      slug: 'harmonizing-cosmic-timing-career-decisions',
      summary: 'Understanding favorable planetary phases can provide deep clarity, calm assurance, and strategic timing for pivotal life transitions.',
      content: 'Throughout history, leaders and visionaries have observed natural celestial cycles to time major endeavors. In this article, we break down practical, grounded ways to align your planning with cosmic timing...',
      imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
      url: 'https://happylife.com/news/harmonizing-cosmic-timing-career-decisions',
      publishedAt: new Date(),
      categories: ['Astrology & Insights'],
      tags: ['Astrology', 'Career', 'Timing', 'Mindset'],
      author: 'Dr. Yogesh'
    },
    {
      title: '5 Daily Practices for Sustained Emotional Clarity and Vital Energy',
      articleTitle: '5 Daily Practices for Vital Energy',
      slug: '5-daily-practices-vital-energy',
      summary: 'Simple, powerful habits to cultivate grounded focus, protect your emotional boundaries, and show up at your highest capacity.',
      content: 'True success begins with physical and emotional vitality. Discover 5 daily micro-habits that take less than 10 minutes but dramatically elevate your clarity, resilience, and sense of peace...',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
      url: 'https://happylife.com/news/5-daily-practices-vital-energy',
      publishedAt: new Date(),
      categories: ['Wellness & Lifestyle'],
      tags: ['Wellness', 'Energy', 'Mindfulness', 'Balance'],
      author: 'Happy Life Editorial'
    }
  ];

  for (const item of newsData) {
    let existing = await News.findOne({ slug: item.slug });
    if (!existing) {
      await News.create(item);
      console.log(`Created News Article: ${item.title}`);
    } else {
      console.log(`News article already exists: ${item.title}`);
    }
  }

  // 7. Seed Banners
  console.log('--- Seeding Banners ---');
  const firstCourse = await Course.findOne({ slug: 'complete-solopreneur-mastery' });
  const bannersData = [
    {
      title: 'Transform Your Energy, Career & Life',
      description: 'Master practical AI solopreneurship, astrological clarity, and deep personal harmony.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&auto=format&fit=crop&q=80',
      type: 'course',
      referenceId: firstCourse ? firstCourse._id : adminId,
      isActive: true,
      priority: 10
    }
  ];

  for (const b of bannersData) {
    let existing = await Banner.findOne({ title: b.title });
    if (!existing) {
      await Banner.create(b);
      console.log(`Created Banner: ${b.title}`);
    }
  }

  // 8. Seed Testimonials
  console.log('--- Seeding Testimonials ---');
  const testimonialsData = [
    {
      name: 'Priya Sharma',
      role: 'Agency Founder',
      message: 'The Solopreneur Mastery course transformed how I run my client business. I doubled my revenue in 3 months while working fewer hours.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      status: 'approved'
    },
    {
      name: 'Rahul Mehta',
      role: 'Consultant & Creator',
      message: 'Dr. Yogesh’s astrological timing insights gave me the exact clarity I needed before launching my new consultancy. Invaluable guidance!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      status: 'approved'
    }
  ];

  for (const t of testimonialsData) {
    let existing = await Testimonial.findOne({ name: t.name });
    if (!existing) {
      await Testimonial.create(t);
      console.log(`Created Testimonial: ${t.name}`);
    }
  }

  console.log('\n========================================');
  console.log('🎉 Database seeding complete successfully!');
  console.log('========================================\n');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

seed().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});

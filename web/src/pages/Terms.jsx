import React, { useEffect } from 'react';
import gsap from 'gsap';

const Terms = () => {
  useEffect(() => {
    gsap.fromTo('.terms-animate',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="terms-animate text-4xl md:text-5xl font-newsreader font-bold text-amber-600 mb-8">Terms & Conditions</h1>

        <div className="terms-animate space-y-6 text-base leading-relaxed">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <p>
            Welcome to OS Academy. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">1. Use of the Platform</h2>
          <p>
            OS Academy provides educational courses and study materials for banking professionals. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of others.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You must immediately notify us of any unauthorized use of your account.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">3. Intellectual Property</h2>
          <p>
            All content on the OS Academy platform, including videos, e-books, practice tests, and logos, is the exclusive property of EdutouchInfinity Pvt. Ltd. You may not reproduce, distribute, or modify any content without written permission.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">4. Limitation of Liability</h2>
          <p>
            OS Academy strives to provide accurate and helpful preparation materials. However, we do not guarantee exam success or specific outcomes. We shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our services.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the platform after any changes indicates your acceptance of the new terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;

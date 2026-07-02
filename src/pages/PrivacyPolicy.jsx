import React from "react";
import { motion } from "framer-motion";

function PrivacyPolicy() {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="bg-gold-50 min-h-screen">
      <motion.section
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        role="region"
        aria-label="Privacy Policy"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold font-serif text-gray-800 mb-8 text-center tracking-tight border-b border-gold-200 pb-4"
          variants={itemVariants}
        >
          Privacy Policy
        </motion.h1>

        <motion.div className="prose prose-md text-gray-600 mx-auto space-y-6 font-sans leading-relaxed" variants={itemVariants}>
          <motion.p variants={itemVariants}>
            Welcome to <strong>Sparkle Bangles</strong> ("we," "us," or "our"). This Privacy Policy explains how we collect, use,
            disclose, and protect your personal information when you visit our website <a href="https://sparklebangles.com" className="text-maroon-800 hover:underline">https://sparklebangles.com</a> or make a purchase.
            By using our services, you agree to the terms of this policy.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            1. Information We Collect
          </motion.h2>
          <motion.p variants={itemVariants}>
            We collect the following types of information:
          </motion.p>
          <motion.ul className="list-disc pl-6 space-y-2" variants={itemVariants}>
            <motion.li variants={itemVariants}>
              <strong>Personal Information</strong>: Name, email address, phone number, billing and shipping addresses, and
              details for offline order fulfillment when you create an account, place an order, or send a contact query.
            </motion.li>
            <motion.li variants={itemVariants}>
              <strong>Non-Personal Information</strong>: Browser type, IP address, device type, operating system, and browsing
              behavior collected via cookies and analytics tools.
            </motion.li>
            <motion.li variants={itemVariants}>
              <strong>Order Information</strong>: Details about the bangles you purchase, including sizes (e.g. 2.4, 2.6, 2.8, 2.10), quantities, and prices.
            </motion.li>
          </motion.ul>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            2. How We Use Your Information
          </motion.h2>
          <motion.p variants={itemVariants}>
            We use your information to:
          </motion.p>
          <motion.ul className="list-disc pl-6 space-y-2" variants={itemVariants}>
            <motion.li variants={itemVariants}>Process and record your orders, and coordinate customized sizing.</motion.li>
            <motion.li variants={itemVariants}>Contact you via email or phone to coordinate offline payments and delivery details.</motion.li>
            <motion.li variants={itemVariants}>Respond to your customer service questions or custom requests submitted through our contact form.</motion.li>
            <motion.li variants={itemVariants}>Improve our catalog design, web layout, and user experience based on traffic feedback.</motion.li>
            <motion.li variants={itemVariants}>Prevent fraudulent transactions and secure our platform.</motion.li>
          </motion.ul>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            3. Cookies
          </motion.h2>
          <motion.p variants={itemVariants}>
            We use basic cookies to enhance your experience, remember items in your shopping cart, and analyze traffic patterns.
            You can configure your browser to disable cookies, but this may impact your ability to add items to your cart.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            4. Data Security
          </motion.h2>
          <motion.p variants={itemVariants}>
            We implement security measures (including secure database policies and HTTPS encryption) to protect your personal data.
            However, no transmission method over the internet is completely bulletproof, and we cannot guarantee absolute security.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            5. Contact Us
          </motion.h2>
          <motion.p variants={itemVariants}>
            If you have questions about this Privacy Policy, or want to query/delete your details, please reach out to us at:
          </motion.p>
          <motion.ul className="list-none pl-0 space-y-1 font-semibold text-gray-700" variants={itemVariants}>
            <motion.li variants={itemVariants}>Email: support@sparklebangles.com</motion.li>
            <motion.li variants={itemVariants}>Address: 123 Bangle Street, Mumbai, India</motion.li>
            <motion.li variants={itemVariants}>Phone: +91 123 456 7890</motion.li>
          </motion.ul>
          <motion.p className="text-xs text-gray-400 mt-8" variants={itemVariants}>
            Effective Date: July 2, 2026
          </motion.p>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default PrivacyPolicy;
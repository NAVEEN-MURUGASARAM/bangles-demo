import React from "react";
import { motion } from "framer-motion";

function TermsCondition() {
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
        aria-label="Terms and Conditions"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold font-serif text-gray-800 mb-8 text-center tracking-tight border-b border-gold-200 pb-4"
          variants={itemVariants}
        >
          Terms and Conditions
        </motion.h1>

        <motion.div className="prose prose-md text-gray-600 mx-auto space-y-6 font-sans leading-relaxed" variants={itemVariants}>
          <motion.p variants={itemVariants}>
            Welcome to <strong>Sparkle Bangles</strong> ("we," "us," or "our"). These Terms and Conditions govern your use of our website
            <a href="https://sparklebangles.com" className="text-maroon-800 hover:underline"> https://sparklebangles.com</a> and any purchases made through it. By accessing or using our services, you agree to be bound by
            these terms.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            1. Acceptance of Terms
          </motion.h2>
          <motion.p variants={itemVariants}>
            By using our website, placing an order, or creating an account, you confirm that you are at least 18 years old (or
            have parental consent if under 18) and agree to these terms. If you do not agree, please do not use our services.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            2. Offline Order Placement
          </motion.h2>
          <motion.p variants={itemVariants}>
            Sparkle Bangles operates a boutique-style catalog. When you submit your checkout form, your order is recorded in our system as a reservation request. We do not process online credit card transactions on the website. A representative will contact you via email or phone shortly after order placement to confirm available sizes, coordinate payment methods (such as UPI, Net Banking, or cash options), and arrange shipping.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            3. Pricing and Sizing
          </motion.h2>
          <motion.p variants={itemVariants}>
            All prices are listed in Indian Rupees (₹) and include applicable taxes. Sizing is indicated in traditional Indian bangle diameters (e.g. 2.4, 2.6, 2.8, 2.10). We recommend measuring your size before ordering to ensure correct fitting. We reserve the right to adjust prices or stock availability without prior notice.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            4. Shipping and Delivery
          </motion.h2>
          <motion.p variants={itemVariants}>
            We ship to addresses within <strong>India</strong>. Shipping costs and estimated delivery times are
            provided at the time of order confirmation. Delivery times are estimates and may vary due to external factors (e.g., courier delays).
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            5. Returns and Refunds
          </motion.h2>
          <motion.p variants={itemVariants}>
            We offer returns within <strong>7 days</strong> of delivery for unused, undamaged items in original
            packaging. To initiate a return, contact us at <strong>support@sparklebangles.com</strong>. Refunds will be processed within <strong>7-10 business days</strong> after we receive and inspect the returned item.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            6. Intellectual Property
          </motion.h2>
          <motion.p variants={itemVariants}>
            All content on our website, including images, logos, product descriptions, and designs, is owned by Sparkle Bangles or our licensors. You may not reproduce, distribute, or use our content without prior written permission.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            7. Limitation of Liability
          </motion.h2>
          <motion.p variants={itemVariants}>
            To the fullest extent permitted by law, Sparkle Bangles is not liable for any indirect, incidental, or
            consequential damages arising from your use of our website or products. Our liability is limited to the amount paid for the product in question.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            8. Governing Law
          </motion.h2>
          <motion.p variants={itemVariants}>
            These terms are governed by the laws of <strong>India</strong>. Any disputes will be resolved in the courts of <strong>Mumbai</strong>.
          </motion.p>

          <motion.h2 className="text-2xl font-bold font-serif text-gray-800 mt-6" variants={itemVariants}>
            9. Contact Us
          </motion.h2>
          <motion.p variants={itemVariants}>
            For questions about these Terms and Conditions, please contact us at:
          </motion.p>
          <motion.ul className="list-none pl-0 space-y-1 font-semibold text-gray-700" variants={itemVariants}>
            <li>Email: support@sparklebangles.com</li>
            <li>Address: 123 Bangle Street, Mumbai, India</li>
            <li>Phone: +91 123 456 7890</li>
          </motion.ul>
          <motion.p className="text-xs text-gray-400 mt-8" variants={itemVariants}>
            Effective Date: July 2, 2026
          </motion.p>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default TermsCondition;
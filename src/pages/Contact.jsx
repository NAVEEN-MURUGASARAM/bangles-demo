import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

// Contact Info Component
const ContactInfo = ({ icon, title, details, index }) => (
  <motion.div
    variants={{
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } },
      hover: { scale: 1.03, transition: { duration: 0.2 } },
    }}
    initial="initial"
    whileInView="animate"
    whileHover="hover"
    viewport={{ once: true }}
    className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gold-100/50"
  >
    <div className="text-maroon-800 text-3xl mb-4 mx-auto flex justify-center">{icon}</div>
    <h3 className="text-xl font-bold font-serif text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{details}</p>
  </motion.div>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', or 'error'

  // Memoize contact info
  const contactInfo = useMemo(
    () => [
      {
        icon: <FaEnvelope />,
        title: "Email Us",
        details: "support@sparklebangles.com",
      },
      {
        icon: <FaPhone />,
        title: "Call Us",
        details: "+91 123 456 7890",
      },
      {
        icon: <FaMapMarkerAlt />,
        title: "Visit Us",
        details: "123 Bangle Street, Mumbai, India",
      },
    ],
    []
  );

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitStatus(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.length > 1000) newErrors.message = "Message must be under 1000 characters";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await addDoc(collection(db, "contacts"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        timestamp: new Date(),
      });
      setFormData({ name: "", email: "", message: "" });
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus(null), 5000); // Hide success message after 5s
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setErrors({ submit: "Failed to send message. Please try again." });
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-gold-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="text-center mb-16"
          role="region"
          aria-label="Contact Sparkle Bangles"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold font-serif text-gray-800 mb-6 tracking-tight"
          >
            Contact Sparkle Bangles
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-3xl mx-auto prose leading-relaxed font-sans"
          >
            We’re here to help! Reach out with any sizing questions, custom bridal order requests, or feedback, and our team will get back to you promptly.
          </motion.p>
        </motion.section>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info, idx) => (
            <ContactInfo
              key={idx}
              icon={info.icon}
              title={info.title}
              details={info.details}
              index={idx}
            />
          ))}
        </div>

        {/* Contact Form Section */}
        <motion.section
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gold-100"
        >
          <h3 className="text-2xl font-bold font-serif text-gray-800 mb-6 text-center">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none bg-gold-50/20 ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
                aria-invalid={!!errors.name}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none bg-gold-50/20 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
                aria-invalid={!!errors.email}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message / Custom Request Details
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Let us know what you need, including your bangle sizes if asking about a custom set..."
                className={`mt-1 block w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none bg-gold-50/20 ${
                  errors.message ? "border-red-500" : "border-gray-200"
                }`}
                aria-invalid={!!errors.message}
                disabled={isSubmitting}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>
            {errors.submit && (
              <p className="text-red-500 text-xs mt-1">{errors.submit}</p>
            )}
            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg text-sm border border-green-200"
                >
                  <FaCheckCircle className="mr-2 text-lg" />
                  Your message has been sent successfully! We will write back soon.
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-medium py-3 rounded-xl transition-colors duration-200 text-sm shadow-sm cursor-pointer disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.section>
      </main>
    </div>
  );
}
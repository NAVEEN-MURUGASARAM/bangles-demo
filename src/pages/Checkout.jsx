import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { sendOrderEmail } from "../utils/emailService";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      newErrors.email = "Valid email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
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
    try {
      // Create order object
      const orderData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant || { size: "N/A", color: "N/A" },
        })),
        totalPrice: totalPrice,
        status: "Pending Contact",
        timestamp: new Date().toISOString(),
      };

      // 1. Write to Firestore 'orders' collection
      const docRef = await addDoc(collection(db, "orders"), orderData);
      const generatedOrderId = docRef.id;
      setOrderId(generatedOrderId);

      // 2. Dispatch EmailJS notification
      await sendOrderEmail({
        id: generatedOrderId,
        ...orderData,
      });

      // 3. Clear the cart
      clearCart();

      // 4. Set success state
      setOrderSuccess(true);
    } catch (err) {
      console.error("Order submission failed:", err);
      setErrors({ submit: "Failed to place order. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
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

  // Inline success screen
  if (orderSuccess) {
    return (
      <div className="bg-gold-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-6 p-8 bg-white rounded-2xl shadow-xl border border-gold-200 text-center"
        >
          <div className="mx-auto h-32 w-32 rounded-full border-2 border-gold-200 overflow-hidden shadow-md flex items-center justify-center bg-gold-50 transition-all duration-300">
            <img src="/logo.png" alt="Sparkle Bangles Logo" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 font-serif">Order Placed!</h2>
          <p className="text-gray-600 text-sm">
            Thank you for shopping with <span className="font-semibold text-maroon-800 font-serif">Sparkle Bangles</span>. Your order has been successfully recorded.
          </p>
          <div className="bg-gold-50 p-4 rounded-xl text-left border border-gold-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Reference</p>
            <p className="text-sm font-mono text-gray-800 font-bold select-all break-all">{orderId}</p>
          </div>
          <p className="text-xs text-gray-500 prose">
            We will contact you via email (<span className="font-semibold text-gray-700">{formData.email}</span>) shortly to coordinate payment and shipping details.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full bg-maroon-800 text-white py-3 rounded-lg hover:bg-maroon-900 transition-colors duration-200 font-medium font-sans shadow-md"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gold-50 min-h-screen">
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        role="region"
        aria-label="Checkout"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center tracking-tight font-serif"
          variants={itemVariants}
        >
          Checkout
        </motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div className="bg-white p-6 rounded-lg shadow-md border border-gold-100" variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-serif">Order Summary</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-100 mb-4">
                  {cart.map((item) => (
                    <li key={item.id} className="py-4 flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.variant.size}, {item.variant.color} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
                  <span>Total:</span>
                  <span className="text-maroon-800">₹{totalPrice.toFixed(2)}</span>
                </div>
              </>
            )}
          </motion.div>

          {/* User Information Form */}
          <motion.div className="bg-white p-6 rounded-lg shadow-md border border-gold-100" variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-serif">Shipping Information</h2>
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
                  className={`mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-gold-500 focus:outline-none ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
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
                  className={`mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-gold-500 focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-gold-500 focus:outline-none ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  rows="4"
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? "address-error" : undefined}
                  disabled={isSubmitting}
                />
                {errors.address && (
                  <p id="address-error" className="text-red-500 text-sm mt-1">
                    {errors.address}
                  </p>
                )}
              </div>
              {errors.submit && (
                <p className="text-red-500 text-sm mt-1 font-semibold">
                  {errors.submit}
                </p>
              )}
              <motion.button
                type="submit"
                className="w-full bg-maroon-800 text-white py-3 rounded-lg hover:bg-maroon-900 transition-colors duration-200 disabled:bg-gray-400 font-medium font-sans shadow-md"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                disabled={cart.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default Checkout;
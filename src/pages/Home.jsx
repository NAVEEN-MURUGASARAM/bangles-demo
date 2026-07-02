import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// Bangle banners data with high-quality unsplash links
const bannerData = {
  banners: [
    {
      id: "banner-001",
      category: "collections/bridal",
      image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&h=500&q=80",
    },
    {
      id: "banner-002",
      category: "categories/glass",
      image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&h=500&q=80",
    },
    {
      id: "banner-003",
      category: "collections/festive",
      image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&h=500&q=80",
    },
    {
      id: "banner-004",
      category: "categories/kada",
      image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&h=500&q=80",
    }
  ],
};

const FALLBACK_IMAGE = "https://via.placeholder.com/1200x500?text=Bangles+Collection";

// Enrich banners with path and capitalized display name
const banners = bannerData.banners.map((banner) => {
  const categorySegments = banner.category.split("/");
  const displayName = categorySegments[categorySegments.length - 1]
    .replace("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    ...banner,
    path: `/${banner.category}`,
    displayName: displayName + " Collection",
  };
});

// Featured items (Bridal, Festive, Kada, Glass)
const featuredCategories = ["collections/bridal", "collections/festive", "categories/kada", "categories/glass"];
const featuredItems = featuredCategories
  .map((cat) => {
    const banner = banners.find((b) => b.category === cat);
    return banner ? { ...banner, id: `featured-${banner.id}` } : null;
  })
  .filter(Boolean);

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const reviewsRef = useRef(null);
  const REVIEW_LIMIT = 5;

  // Auto-slide effect for banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fetch reviews from Firestore
  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(fetchedReviews.slice(0, REVIEW_LIMIT));
        setIsLoadingReviews(false);
      },
      (error) => {
        console.error("Error fetching reviews:", error);
        setErrors({ fetch: "Failed to load reviews. Please try again later." });
        setIsLoadingReviews(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle rating selection
  const handleRating = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
    setErrors((prev) => ({ ...prev, rating: "" }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = "Please select a rating (1–5 stars)";
    if (!formData.comment.trim()) newErrors.comment = "Comment is required";
    else if (formData.comment.length > 500) newErrors.comment = "Comment must be under 500 characters";
    return newErrors;
  };

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const newReview = {
        name: formData.name.trim() || "Anonymous Customer",
        rating: formData.rating,
        comment: formData.comment.trim(),
        timestamp: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, "reviews"), newReview);
      setReviews((prev) => [
        { id: docRef.id, ...newReview },
        ...prev.slice(0, REVIEW_LIMIT - 1),
      ]);
      setFormData({ name: "", rating: 0, comment: "" });
      setErrors({});
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrors({ submit: "Failed to submit review. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll to reviews section
  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        return new Date(timestamp.toDate()).toLocaleDateString();
      }
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "N/A";
    }
  };

  // Animation variants
  const slideVariants = {
    initial: { opacity: 0, x: 30, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, x: -30, scale: 0.98, transition: { duration: 0.8, ease: "easeIn" } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay: i * 0.1, type: "spring", stiffness: 100 },
    }),
  };

  const reviewVariants = {
    initial: { opacity: 0, y: 15 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.08 },
    }),
  };

  return (
    <div className="bg-gold-50 min-h-screen">
      {/* Hero Banner with Slider */}
      <section className="relative h-[45vh] sm:h-[60vh] md:h-[75vh] overflow-hidden" role="region" aria-label="Hero banner">
        <AnimatePresence mode="wait">
          {banners.map((banner, index) =>
            index === currentSlide ? (
              <motion.div
                key={banner.id}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0"
              >
                <NavLink
                  to={banner.path}
                  aria-label={`View ${banner.displayName}`}
                  className="block w-full h-full relative"
                >
                  <img
                    src={banner.image_url}
                    alt={`Explore ${banner.displayName}`}
                    className="w-full h-full object-cover transition-all duration-300"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load banner image: ${banner.image_url}`);
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 flex flex-col justify-end p-8 sm:p-16">
                    <h2 className="text-white text-3xl sm:text-5xl font-bold font-serif mb-2 tracking-wide drop-shadow-md">
                      {banner.displayName}
                    </h2>
                    <p className="text-gold-200 text-sm sm:text-lg font-light tracking-widest uppercase mb-4 drop-shadow-sm">
                      Handcrafted Masterpieces
                    </p>
                  </div>
                </NavLink>
                <motion.button
                  onClick={scrollToReviews}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-6 right-6 bg-maroon-800 text-white text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-maroon-900 transition-colors duration-200 shadow-lg cursor-pointer"
                  aria-label="View customer reviews"
                >
                  Reviews & Feedback
                </motion.button>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </section>

      {/* Featured Items Section */}
      <section
        className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        role="region"
        aria-label="Featured items"
      >
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 text-center tracking-tight font-serif"
        >
          Curated Collections
        </motion.h2>
        <p className="text-gray-500 text-center mb-10 text-sm max-w-md mx-auto">
          Indulge in our exquisite collections made for weddings, festivals, and elegant daily styling.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={index}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gold-100/50 bg-white"
            >
              <NavLink
                to={item.path}
                aria-label={`View ${item.displayName}`}
                className="block"
              >
                <div className="overflow-hidden h-52 sm:h-72 relative">
                  <img
                    src={item.image_url}
                    alt={`Explore ${item.displayName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load featured image: ${item.image_url}`);
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end justify-center p-4">
                    <motion.h3
                      className="text-white text-lg sm:text-xl font-semibold font-serif text-center"
                      whileHover={{ y: -2 }}
                    >
                      {item.displayName.replace(" Collection", "")}
                    </motion.h3>
                  </div>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section
        ref={reviewsRef}
        className="py-12 sm:py-16 bg-white border-t border-gold-100"
        role="region"
        aria-label="Customer reviews"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 text-center tracking-tight font-serif"
          >
            What Our Patrons Say
          </motion.h2>
          <p className="text-gray-500 text-center mb-12 text-sm max-w-md mx-auto">
            Discover feedback from customers who wear Sparkle Bangles with pride.
          </p>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Review Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gold-50/50 p-6 sm:p-8 rounded-2xl border border-gold-100 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6 font-serif">Share Your Feedback</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Anonymous Patron"
                    className={`mt-1 block w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none bg-white ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    }`}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className={`text-2xl cursor-pointer ${formData.rating >= star ? "text-amber-500" : "text-gray-200"}`}
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <FaStar />
                      </motion.button>
                    ))}
                  </div>
                  {errors.rating && (
                    <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Write a few words about our bangles, fitting, or service..."
                    className={`mt-1 block w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none bg-white ${
                      errors.comment ? "border-red-500" : "border-gray-200"
                    }`}
                    rows="4"
                    aria-invalid={!!errors.comment}
                  />
                  {errors.comment && (
                    <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
                  )}
                </div>
                {errors.submit && (
                  <p className="text-red-500 text-xs">{errors.submit}</p>
                )}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-medium py-3 rounded-xl transition-colors duration-200 text-sm shadow-sm cursor-pointer disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </motion.button>
              </form>
            </motion.div>

            {/* Review Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6 font-serif">Customer Stories</h3>
              {isLoadingReviews ? (
                <p className="text-gray-500 text-sm">Loading customer feedback...</p>
              ) : errors.fetch ? (
                <p className="text-red-500 text-sm">{errors.fetch}</p>
              ) : reviews.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No reviews yet. Be the first to share your experience with our bangles!</p>
              ) : (
                <motion.ul className="space-y-4" role="list">
                  {reviews.map((review, index) => (
                    <motion.li
                      key={review.id}
                      variants={reviewVariants}
                      initial="initial"
                      animate="animate"
                      custom={index}
                      className="bg-gold-50/20 p-5 rounded-2xl border border-gold-100 shadow-sm flex flex-col justify-between"
                      role="listitem"
                    >
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="font-semibold text-gray-800 text-sm sm:text-base">{review.name}</span>
                          <div className="flex ml-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={`text-xs ${review.rating >= star ? "text-amber-500" : "text-gray-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                      </div>
                      <p className="text-gray-400 text-[10px] mt-4 self-end uppercase font-semibold tracking-wider">
                        {formatTimestamp(review.timestamp)}
                      </p>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
import React from "react";
import { motion } from "framer-motion";

const ProductPreview = ({ product, variant, onClose, onVariantChange, onAddToCart }) => {
  if (!product) return null;
  
  const variantOptions = product.variantOptions || {
    size: ["2.4", "2.6", "2.8", "2.10"],
    color: ["Gold", "Silver", "Rose Gold"],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-label="Product preview modal"
    >
      <motion.div
        initial={{ scale: 0.9, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 15 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full border border-gold-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-xl mb-4 relative aspect-[4/3]">
          <img
            src={product.image_url}
            alt={`${product.name} in ${variant.color}`}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 font-serif leading-snug mb-1">
          {product.name}
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          {product.description}
        </p>
        <p className="text-maroon-800 font-bold text-xl mb-4">
          ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
        <div className="flex space-x-2 mb-6">
          <div className="flex-1">
            <label htmlFor="modal-size" className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">
              Select Size (Diameter)
            </label>
            <select
              id="modal-size"
              value={variant.size}
              onChange={(e) => onVariantChange("size", e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none bg-gold-50/50"
              aria-label="Select size"
            >
              {variantOptions.size.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="modal-color" className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">
              Select Color / Finish
            </label>
            <select
              id="modal-color"
              value={variant.color}
              onChange={(e) => onVariantChange("color", e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none bg-gold-50/50"
              aria-label="Select color"
            >
              {variantOptions.color.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onAddToCart}
            className="flex-1 bg-maroon-800 text-white px-4 py-2.5 rounded-xl hover:bg-maroon-900 transition-colors duration-200 font-medium active:scale-[0.98]"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium active:scale-[0.98]"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductPreview;
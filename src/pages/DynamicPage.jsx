import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductPreview from "../components/ProductPreview";
import { productsData } from "../data/products";

function DynamicPage() {
  const { items, name } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [modalState, setModalState] = useState({
    isOpen: false,
    product: null,
    variant: { size: "2.4", color: "Gold" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const variantOptions = useMemo(() => ({
    size: ["2.4", "2.6", "2.8", "2.10"],
    color: ["Gold", "Silver", "Rose Gold", "Red", "Green", "Blue"],
  }), []);

  const fetchProducts = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      if (!items || !name) {
        throw new Error("Invalid request parameters.");
      }

      // Fetch from local static catalog data
      const categoryData = productsData[items]?.[name];
      if (!categoryData) {
        throw new Error(`Bangle collection "${name}" not found.`);
      }

      setProducts(categoryData);
      setFilteredProducts(categoryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [items, name]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleVariantChange = (index, type, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [index]: { ...prev[index], [type]: value },
    }));
  };

  const handleAddToCart = (product, index) => {
    const variant = selectedVariants[index] || {
      size: product.variantOptions?.size?.[0] || "2.4",
      color: product.variantOptions?.color?.[0] || "Gold",
    };
    addToCart({
      id: `${product.name}-${index}`,
      name: product.name,
      price: product.price,
      image: product.image_url,
      variant,
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gold-50">
        <div className="flex items-center space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-gold-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-gold-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-gold-500 rounded-full animate-bounce delay-200"></div>
          <p className="text-gray-600 font-medium">Loading Sparkle Bangles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gold-50">
        <div className="text-center p-8 bg-white shadow-md rounded-lg border border-red-100 max-w-sm">
          <p className="text-red-500 font-semibold mb-2">Notice</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gold-50 min-h-screen">
      <header className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-800 capitalize tracking-tight border-b border-gold-200 pb-4">
          {`${name.replace("-", " ")}`}
          <span className="text-sm font-sans font-light text-gray-500 block mt-1 normal-case tracking-normal">
            Exploring {items} collection
          </span>
        </h1>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => {
            const sizes = product.variantOptions?.size || variantOptions.size;
            const colors = product.variantOptions?.color || variantOptions.color;
            const currentSize = selectedVariants[index]?.size || sizes[0];
            const currentColor = selectedVariants[index]?.color || colors[0];

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-5 border border-gold-100 flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <div className="overflow-hidden rounded-xl mb-4 relative aspect-[4/3] group">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl cursor-pointer transition-transform duration-500 group-hover:scale-105"
                      onClick={() =>
                        setModalState({
                          isOpen: true,
                          product,
                          variant: { size: currentSize, color: currentColor },
                        })
                      }
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 font-serif leading-tight mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                    {product.description}
                  </p>
                </div>
                <div>
                  <p className="text-maroon-800 font-bold text-xl mb-4">
                    ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex space-x-2 mb-4">
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">
                        Size (Diameter)
                      </label>
                      <select
                        value={currentSize}
                        onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gold-400 focus:outline-none bg-gold-50/50"
                      >
                        {sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">
                        Color / Finish
                      </label>
                      <select
                        value={currentColor}
                        onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-gold-400 focus:outline-none bg-gold-50/50"
                      >
                        {colors.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product, index)}
                    className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      {modalState.isOpen && (
        <ProductPreview
          product={modalState.product}
          variant={modalState.variant}
          onClose={() =>
            setModalState({
              isOpen: false,
              product: null,
              variant: { size: "2.4", color: "Gold" },
            })
          }
          onVariantChange={(type, value) =>
            setModalState((prev) => ({
              ...prev,
              variant: { ...prev.variant, [type]: value },
            }))
          }
          onAddToCart={() => {
            addToCart({
              id: `${modalState.product.name}-${Date.now()}`,
              name: modalState.product.name,
              price: modalState.product.price,
              image: modalState.product.image_url,
              variant: modalState.variant,
              quantity: 1,
            });
            setModalState({
              isOpen: false,
              product: null,
              variant: { size: "2.4", color: "Gold" },
            });
          }}
        />
      )}
    </div>
  );
}

export default DynamicPage;
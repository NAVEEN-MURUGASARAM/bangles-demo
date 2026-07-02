import React, { useState, useEffect } from "react";
import { db, ADMIN_PASSCODE } from "../firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { productsData } from "../data/products";
import { motion } from "framer-motion";
import { FaTrash, FaCheck, FaDatabase, FaPlus, FaBoxOpen, FaInbox, FaSignOutAlt, FaLock } from "react-icons/fa";

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("adminAuth") === "true";
  });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  // Dynamic lists from Firestore
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // New product form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    collection: "",
  });
  const [selectedSizes, setSelectedSizes] = useState(["2.4", "2.6", "2.8", "2.10"]);
  const [selectedColors, setSelectedColors] = useState(["Gold", "Silver", "Rose Gold"]);

  // Available options
  const sizeOptions = ["2.4", "2.6", "2.8", "2.10"];
  const colorOptions = ["Gold", "Silver", "Rose Gold", "Red", "Green", "Blue", "Crimson Red", "Deep Maroon", "Emerald Green"];

  // Authenticate Admin
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid passcode. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
    setPasscode("");
  };

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders
      const orderSnap = await getDocs(collection(db, "orders"));
      const orderList = orderSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      orderList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setOrders(orderList);

      // 2. Fetch Products
      const productSnap = await getDocs(collection(db, "products"));
      const productList = productSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);

      // 3. Fetch Contacts
      const contactSnap = await getDocs(collection(db, "contacts"));
      const contactList = contactSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      contactList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setContacts(contactList);
    } catch (error) {
      console.error("Error loading administrative data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Seeder to populate Firestore from products.js
  const handleSeedDatabase = async () => {
    if (!window.confirm("This will upload all default bangle products from the local catalog into your Firestore database. Continue?")) {
      return;
    }
    setSeeding(true);
    try {
      const productsCol = collection(db, "products");
      let count = 0;

      // Seed Collections
      for (const [colName, items] of Object.entries(productsData.collections)) {
        for (const item of items) {
          await addDoc(productsCol, {
            ...item,
            collection: colName,
            category: "",
          });
          count++;
        }
      }

      // Seed Categories
      for (const [catName, items] of Object.entries(productsData.categories)) {
        for (const item of items) {
          await addDoc(productsCol, {
            ...item,
            collection: "",
            category: catName,
          });
          count++;
        }
      }

      alert(`Database successfully seeded with ${count} items!`);
      fetchData();
    } catch (err) {
      console.error("Database seeding failed:", err);
      alert(`Database seeding failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  // Add a product to Firestore
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image_url) {
      alert("Name, Price, and Image URL are required.");
      return;
    }
    if (!newProduct.category && !newProduct.collection) {
      alert("Please specify either a category or a collection.");
      return;
    }

    try {
      const productPayload = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        image_url: newProduct.image_url,
        category: newProduct.category || "",
        collection: newProduct.collection || "",
        variantOptions: {
          size: selectedSizes,
          color: selectedColors,
        },
      };

      await addDoc(collection(db, "products"), productPayload);
      alert("Product added successfully!");
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category: "",
        collection: "",
      });
      fetchData();
    } catch (err) {
      console.error("Error adding product:", err);
      alert(`Failed to add product: ${err.message}`);
    }
  };

  // Delete a product from Firestore
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", productId));
      fetchData();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Mark order as completed
  const handleMarkOrderCompleted = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "Completed" });
      fetchData();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order record?")) return;
    try {
      await deleteDoc(doc(db, "orders", orderId));
      fetchData();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  // Delete contact submission
  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this message record?")) return;
    try {
      await deleteDoc(doc(db, "contacts", contactId));
      fetchData();
    } catch (err) {
      console.error("Error deleting contact submission:", err);
    }
  };

  // Checkbox helpers
  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="bg-gold-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-gold-200"
        >
          <div className="text-center">
            <FaLock className="mx-auto text-4xl text-maroon-800 mb-4" />
            <h2 className="text-3xl font-bold font-serif text-gray-800">Admin Control Panel</h2>
            <p className="mt-2 text-sm text-gray-500 font-sans">
              Enter your passcode to manage Sparkle Bangles dashboard.
            </p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <label htmlFor="passcode" className="sr-only">
                Admin Passcode
              </label>
              <input
                id="passcode"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Passcode"
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gold-500 focus:ring-2 bg-gold-50/20 text-center font-mono tracking-widest text-lg"
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm text-center font-medium">{loginError}</p>
            )}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-maroon-800 hover:bg-maroon-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors shadow-md cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gold-50 min-h-screen">
      {/* Top Header */}
      <header className="bg-white shadow-md border-b border-gold-200 py-4 px-6 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full object-cover border border-gold-300" />
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-800">Sparkle Bangles Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-maroon-800 hover:bg-maroon-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gold-200 pb-4">
          {[
            { id: "orders", label: "Customer Orders", icon: <FaBoxOpen /> },
            { id: "products", label: "Catalog Manager", icon: <FaPlus /> },
            { id: "contacts", label: "Contact Inquiries", icon: <FaInbox /> },
            { id: "system", label: "Database Tools", icon: <FaDatabase /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-maroon-800 text-white shadow-md scale-102"
                  : "bg-white text-gray-600 hover:bg-gold-100 border border-gold-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <p className="text-center text-gray-500 py-8 italic font-sans">Updating dashboard records...</p>
        )}

        {/* Tab 1: Orders */}
        {!loading && activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-gray-800">Customer Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded-xl border text-center">No orders placed yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-2xl border border-gold-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-gray-800 text-lg font-serif">Order #{order.id.slice(-6).toUpperCase()}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(order.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 font-sans">
                        <p><strong>Customer:</strong> {order.name}</p>
                        <p><strong>Email:</strong> {order.email}</p>
                        <p className="sm:col-span-2"><strong>Shipping Address:</strong> {order.address}</p>
                      </div>
                      <div className="border-t border-gold-50 pt-3 mt-3">
                        <p className="font-semibold text-gray-700 text-sm mb-2 font-serif">Items Purchased:</p>
                        <ul className="space-y-1 text-sm text-gray-600 list-disc pl-5">
                          {order.items?.map((item, idx) => (
                            <li key={idx}>
                              {item.name} - (Size: {item.variant?.size}, Color: {item.variant?.color}) x {item.quantity} @ ₹{item.price.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col justify-end items-center gap-3 min-w-[150px]">
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Total Value</p>
                        <p className="text-xl font-bold text-maroon-800">₹{order.totalPrice.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 w-full">
                        {order.status !== "Completed" && (
                          <button
                            onClick={() => handleMarkOrderCompleted(order.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            title="Mark Completed"
                          >
                            <FaCheck /> Done
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Products Manager */}
        {!loading && activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form to Add Product */}
            <div className="bg-white p-6 rounded-2xl border border-gold-100 shadow-sm h-fit">
              <h2 className="text-xl font-bold font-serif text-gray-800 mb-6">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Bangle Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Traditional Kundan Kada Set"
                    className="mt-1 block w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Write details of craftsmanship, coating, or set counts..."
                    rows="3"
                    className="mt-1 block w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (₹)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="999.00"
                      className="mt-1 block w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value, collection: "" })}
                      className="mt-1 block w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white"
                    >
                      <option value="">-- Select Category --</option>
                      <option value="kada">Kada Bangles</option>
                      <option value="glass">Glass Bangles</option>
                      <option value="gold-plated">Gold-Plated</option>
                      <option value="stone-studded">Stone-Studded</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Or Collection</label>
                  <select
                    value={newProduct.collection}
                    onChange={(e) => setNewProduct({ ...newProduct, collection: e.target.value, category: "" })}
                    className="mt-1 block w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white"
                  >
                    <option value="">-- Select Collection --</option>
                    <option value="bridal">Bridal Collection</option>
                    <option value="festive">Festive Collection</option>
                    <option value="daily">Daily Wear</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="mt-1 block w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                {/* Variant sizes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sizes (Diameter)</label>
                  <div className="flex flex-wrap gap-4 text-sm font-sans font-medium text-gray-700">
                    {sizeOptions.map((size) => (
                      <label key={size} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleToggleSize(size)}
                          className="rounded text-gold-500 focus:ring-gold-500"
                        />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Variant colors */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Colors / Finish</label>
                  <div className="grid grid-cols-3 gap-2 text-sm font-sans font-medium text-gray-700">
                    {colorOptions.map((color) => (
                      <label key={color} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={() => handleToggleColor(color)}
                          className="rounded text-gold-500 focus:ring-gold-500"
                        />
                        <span className="truncate">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-medium py-3 rounded-lg text-sm shadow-md transition-colors cursor-pointer"
                >
                  Create Product
                </button>
              </form>
            </div>

            {/* Product List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold font-serif text-gray-800">Bangle Catalog ({products.length} Items)</h2>
              {products.length === 0 ? (
                <p className="text-gray-500 bg-white p-6 rounded-xl border text-center">Your catalog database is empty. Seed it in the tools tab or create your first product above.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((prod) => (
                    <div key={prod.id} className="bg-white p-4 rounded-xl border border-gold-100 flex gap-4 shadow-sm relative">
                      <img src={prod.image_url} alt={prod.name} className="w-20 h-20 rounded-lg object-cover border" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate font-serif text-base">{prod.name}</h3>
                        <p className="text-xs text-gray-400 capitalize">
                          {prod.collection ? `${prod.collection} Collection` : `${prod.category} Category`}
                        </p>
                        <p className="font-bold text-maroon-800 mt-1 text-sm">₹{prod.price.toFixed(2)}</p>
                        <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-gray-500 font-sans">
                          {prod.variantOptions?.size?.map((s) => (
                            <span key={s} className="bg-gold-50 px-1 border rounded">{s}</span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Contacts */}
        {!loading && activeTab === "contacts" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-gray-800">Contact Inquiries</h2>
            {contacts.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded-xl border text-center">No contact inquiries received yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {contacts.map((contact) => (
                  <div key={contact.id} className="bg-white p-6 rounded-2xl border border-gold-100 shadow-sm flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-gray-800 font-serif text-lg">{contact.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(contact.timestamp?.seconds * 1000 || contact.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-maroon-800 font-medium">Email: {contact.email}</p>
                      <p className="text-gray-600 text-sm bg-gold-50/30 p-3 rounded-lg border border-gold-100/50 mt-2 font-sans italic">
                        "{contact.message}"
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-lg transition-colors cursor-pointer"
                      title="Delete Message"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Database Tools */}
        {!loading && activeTab === "system" && (
          <div className="bg-white p-8 rounded-2xl border border-gold-100 shadow-sm max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold font-serif text-gray-800 text-center">Database Seed & Restore</h2>
            <div className="text-center space-y-4">
              <FaDatabase className="text-5xl text-gold-500 mx-auto" />
              <p className="text-sm text-gray-600 font-sans leading-relaxed">
                If you have just initialized your Firestore database and it is currently empty, you can upload all 18 default handcrafted bangle products to your Firestore catalog in one click.
              </p>
              <div className="bg-gold-50 p-4 rounded-lg text-left border border-gold-100/80 text-xs text-gray-500 font-mono space-y-1">
                <p>• Bridal Collection sets (3 items)</p>
                <p>• Festive Collection sets (3 items)</p>
                <p>• Daily Wear sets (3 items)</p>
                <p>• Traditional Kada (3 items)</p>
                <p>• Ferozabad Glass Bangles (3 items)</p>
                <p>• Gold-Plated stacks (3 items)</p>
                <p>• Stone-Studded selections (3 items)</p>
              </div>
              <button
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-medium py-3 rounded-lg text-sm shadow-md transition-colors cursor-pointer disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {seeding ? "Uploading Items..." : "Seed Initial Catalog"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

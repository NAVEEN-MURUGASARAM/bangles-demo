import React, { useMemo } from "react";
import { motion } from "framer-motion";

// Team Member Component
const TeamMember = ({ name, role, image }) => (
  <motion.div
    whileHover={{ scale: 1.03, rotate: 1 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-2xl shadow-md p-6 text-center border border-gold-100/50"
  >
    <img src={image} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-gold-400" />
    <h3 className="text-xl font-bold font-serif text-gray-800">{name}</h3>
    <p className="text-maroon-800 text-sm font-medium mt-1">{role}</p>
  </motion.div>
);

export default function About() {
  const teamMembers = useMemo(
    () => [
      {
        name: "Luna Hart",
        role: "Founder & Master Bangle Artisan",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Zara Quinn",
        role: "Lead Filigree Designer",
        image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Mila Rose",
        role: "Client Relations & Custom Sizing",
        image: "https://images.unsplash.com/photo-1524504383359-3e8e7274461d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      },
    ],
    []
  );

  return (
    <div className="bg-gold-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <img src="/logo.png" alt="Sparkle Bangles Logo" className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover shadow-md border border-gold-300 mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-gray-800 mb-6">About Sparkle Bangles</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto prose font-sans leading-relaxed">
            Sparkle Bangles is a premium boutique dedicated to the art of handcrafted bangles. We craft unique traditional, glass, and gold-plated kadas that celebrate cultural heritage and empower you to shine with grace, sophistication, and custom-fit perfection.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 bg-white p-8 rounded-3xl shadow-sm border border-gold-100 max-w-4xl mx-auto text-center"
        >
          <h3 className="text-3xl font-bold font-serif text-gray-800 mb-4">Our Heritage & Craft</h3>
          <p className="text-gray-600 font-sans leading-relaxed">
            Each pair of kadas and set of glass bangles at Sparkle Bangles is curated with utmost care, using traditional casting and filigree techniques from India's finest artisans. We believe bangles aren't just jewelry; they are a legacy of expression, celebration, and love. Our signature collection supports custom sizing from diameter 2.4 up to 2.10 to guarantee a comfortable fit.
          </p>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold font-serif text-gray-800 mb-8 text-center">Meet Our Creators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
              />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}

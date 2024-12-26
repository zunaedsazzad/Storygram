"use client";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { User, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import "./style.css";

interface Club {
  _id: string;
  clubName: string;
  description?: string;
  logo?: string;
  totalEvents: number;
}

export default function Page() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchClubs() {
      setLoading(true);
      const response = await fetch("/api/clubs");
      const clubs = await response.json();
      setClubs(clubs);
      setLoading(false);
    }
    fetchClubs();
  }, []);

  return (
    <div className="h-full overflow-hidden text-gray-100 p-8">
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
          <Spin size="large" />
        </div>
      )}

      <div className="grid container-class overflow-y-scroll h-full gap-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {clubs.map((club: Club, index) => (
          <motion.div
            key={club._id}
            className="rounded-2xl h-fit bg-gray-800 shadow-xl p-6 space-y-4 hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            {/* Club Header */}
            <div className="flex items-center space-x-4">
              {club.logo ? (
                <img
                  src={club.logo}
                  alt={club.clubName}
                  className="w-16 h-16 rounded-full border-2 border-gray-700 object-cover"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-full">
                  <User size={32} color="white" />
                </div>
              )}
              <div>
                <Link href={`/clubs/${club._id}`}>
                  <p className="text-xl font-semibold hover:text-gray-300 text-white cursor-pointer transition-colors duration-200">
                    {club.clubName}
                  </p>
                </Link>
                <p className="text-sm text-gray-400">
                  {club.description || "No description available"}
                </p>
              </div>
            </div>

            {/* Events Info */}
            <div className="flex items-center space-x-2 text-gray-300 hover:text-gray-100 transition-colors duration-200">
              <Calendar size={20} />
              <p className="text-sm">{club.totalEvents} Events</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      setError('');
      return;
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResults(data.results);
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('⚠️ Something went wrong. Please try again.');
      setResults([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-white">
      <motion.h1
        className="text-4xl font-bold text-green-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        💊 Find Your Medicine
      </motion.h1>

      <motion.div
        className="flex items-center border rounded-full shadow-lg overflow-hidden max-w-md w-full mb-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          className="flex-grow p-4 focus:outline-none"
          placeholder="Search for a medicine..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <motion.button
          onClick={handleSearch}
          className="bg-green-600 text-white px-6 py-2 hover:bg-green-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search size={20} />
        </motion.button>
      </motion.div>

      {error && (
        <motion.p
          className="text-red-500 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {results.length > 0 ? (
        <motion.ul
          className="mt-6 space-y-4 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {results.map((item) => (
            <li
              key={item.id}
              className="border p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="text-lg font-semibold text-green-800">🧪 {item.name}</p>
              <p className="text-gray-700">💰 Price: {item.price}</p>
              <p className="text-gray-700">📦 Stock: {item.stock}</p>
            </li>
          ))}
        </motion.ul>
      ) : (
        !error &&
        query && (
          <motion.p
            className="text-gray-500 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            😕 No medicines found for "<strong>{query}</strong>"
          </motion.p>
        )
      )}
    </div>
  );
}

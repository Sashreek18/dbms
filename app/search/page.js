'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Database } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // If query is empty, still make the request to get sample data
      const res = await fetch(`/api/search?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResults(data.results);
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('⚠️ ' + (err.message || 'Something went wrong. Please try again.'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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

      <div className="w-full max-w-md mb-4">
        <motion.div
          className="flex items-center border rounded-full shadow-lg overflow-hidden w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <input
  type="text"
  id="medicine-search"  
  className="flex-grow p-4 focus:outline-none"
  placeholder="Search for a medicine..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeydo={handleKeyPress}
/>
          <motion.button
            onClick={handleSearch}
            className="bg-green-600 text-white px-6 py-4 hover:bg-green-700 h-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search size={20} />
            )}
          </motion.button>
        </motion.div>

      
      </div>

      {/* Database Status */}
      {dbStatus && (
        <motion.div
          className={`w-full max-w-md mb-4 p-3 rounded-lg text-sm ${
            dbStatus.status === 'success' ? 'bg-green-100 text-green-800' : 
            dbStatus.status === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {dbStatus.message}
          {dbStatus.data && dbStatus.data.sampleMedicines && dbStatus.data.sampleMedicines.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Sample medicines:</p>
              <ul className="list-disc list-inside">
                {dbStatus.data.sampleMedicines.slice(0, 3).map(med => (
                  <li key={med.Medicine_ID}>{med.Medicine_name} - ${med.Price}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {error && (
        <motion.p
          className="text-red-500 mt-2 w-full max-w-md"
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
            <motion.li
              key={item.id}
              className="border p-4 rounded-xl shadow hover:shadow-lg transition bg-white"
              whileHover={{ y: -3 }}
            >
              <p className="text-lg font-semibold text-green-800">🧪 {item.name}</p>
              <p className="text-gray-700">💰 Price: {item.price}</p>
              <p className="text-gray-700">📦 Total Stock: {item.stock}</p>
              
              {item.availability && item.availability.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-green-700">Available at:</p>
                  <ul className="text-xs text-gray-600 mt-1">
                    {item.availability.map((loc, idx) => (
                      <li key={idx} className="mt-1">
                        • {loc.pharmacy} ({loc.location}): {loc.quantity} units
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        !error && query && !loading && (
          <motion.p
            className="text-gray-500 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            😕 No medicines found for "<strong>{query}</strong>"
          </motion.p>
        )
      )}

      {/* Show empty state with hint if no results and not searching */}
      {results.length === 0 && !error && !query && !loading && (
        <motion.div
          className="mt-12 text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Enter a medicine name to search</p>
          <p className="text-sm mt-2">Try searching for "paracetamol" or "aspirin"</p>
          <p className="text-sm mt-1">Or click the search button with empty query to see all medicines</p>
        </motion.div>
      )}
    </div>
  );
}
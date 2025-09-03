import { useState, useEffect } from 'react';
import { WorldMap } from '../components/WorldMap';
import { CountryList } from '../components/CountryList';
import COUNTRIES from '../assets/countries.json';

const countries = COUNTRIES;

export default function App() {
  const [input, setInput] = useState('');
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>(() => {
    const saved = localStorage.getItem('highlightedCountries');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastFound, setLastFound] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('highlightedCountries', JSON.stringify(highlightedCountries));
  }, [highlightedCountries]);

  useEffect(() => {
    const trimmed = input.trim();
    const countryExists = countries.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (countryExists && !highlightedCountries.includes(countryExists.name)) {
      setHighlightedCountries([...highlightedCountries, countryExists.name]);
      setLastFound(countryExists.name);
      setInput('');
      setTimeout(() => setLastFound(null), 3000);
    } else {
      setTimeout(() => setLastFound(null), 3000);
    }
  }, [input, highlightedCountries]);

  const totalCountries = countries.length;
  const foundCount = highlightedCountries.length;
  const percent = Math.min(100, Math.round((foundCount / totalCountries) * 100));

  useEffect(() => {
    if (foundCount === totalCountries && totalCountries > 0) {
      setShowCongrats(true);
    }
  }, [foundCount, totalCountries]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Congratulations Popup */}
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              <span role="img" aria-label="party popper">🎉</span> Congratulations! <span role="img" aria-label="party popper">🎉</span>
            </h2>
            <p className="mb-4 text-lg text-gray-700">You have found all countries!</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setShowCongrats(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2 mt-4">Country Guess</h1>
      <h4 className="italic text-gray-600 mb-2 mt-2">
        Discover geography in an interactive way: name countries and watch the map come alive!
      </h4>
      <div className="w-full max-w-3xl mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-blue-700">Progress</span>
          {lastFound && (
            <span className="text-green-600 text-sm">Country found: {lastFound}</span>
          )}
          <span className="text-sm font-medium text-blue-700">{percent}% ({foundCount}/{totalCountries})</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
      <form className="mb-4 flex gap-2" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a country name..."
          className="border rounded px-2 py-1 align-center"
        />
      </form>
      <div className="w-full max-w-3xl h-[550px] bg-white rounded shadow">
        <WorldMap highlightedCountries={highlightedCountries} />
      </div>
      {highlightedCountries.length > 0 && (
        <div className="mt-4 w-full max-w-3xl flex flex-wrap gap-2">
          <h2 className="text-xl font-semibold">You have guessed:</h2>
          {highlightedCountries.map((country) => (
            <span key={country} className="px-2 py-1 bg-green-200 rounded text-sm">
              {country}
            </span>
          ))}
        </div>
      )}
      <CountryList highlightedCountries={highlightedCountries} />

      <button
        className="m-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={() => setShowResetConfirm(true)}
      >
        Reset Progress
      </button>
      {/* Reset Confirmation Popup */}
      {showResetConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Reset Progress?</h3>
            <p className="mb-4 text-gray-700">Are you sure you want to reset your progress? This cannot be undone.</p>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  setHighlightedCountries([]);
                  localStorage.removeItem('highlightedCountries');
                  setShowCongrats(false);
                  setShowResetConfirm(false);
                }}
              >
                Yes, reset
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

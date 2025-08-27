import { useState, useEffect } from 'react';
import { WorldMap } from '../components/WorldMap';
import { CountryList } from '../components/CountryList';
import COUNTRIES from '../assets/countries.json';

const countries = COUNTRIES;

export default function App() {
  const [input, setInput] = useState('');
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [lastFound, setLastFound] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-2 mt-4">Country Guess</h1>
      <h4 className="italic text-gray-600 mb-2 mt-2">Discover geography in an interactive way: name countries and watch the map come alive!</h4>
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
    </div>
  );
}

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
    if (!trimmed) {
      setLastFound(null);
      return;
    }
    const countryExists = countries.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (countryExists) {
      setHighlightedCountries([...highlightedCountries, countryExists.name]);
      setLastFound(countryExists.name);
      setTimeout(() => setLastFound(null), 3000);
      setInput('');
    } else {
      setLastFound(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // Progress calculation
  const totalCountries = countries.length; // UN member states + widely recognized
  const foundCount = highlightedCountries.length;
  const percent = Math.min(100, Math.round((foundCount / totalCountries) * 100));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-2 mt-4">Country Guess Quiz</h1>
      <div className="w-full max-w-3xl mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-blue-700">Progress</span>
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
        <div className="h-[40px] w-[200px]">
          {lastFound && (
            <div className="text-green-600 text-sm mb-2">Country found: {lastFound}</div>
          )}
        </div>
      </form>
      <div className="w-full max-w-3xl h-[550px] bg-white rounded shadow">
        <WorldMap highlightedCountries={highlightedCountries} />
      </div>
      {highlightedCountries.length > 0 && (
        <div className="mt-4 w-full max-w-3xl flex flex-wrap gap-2">
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

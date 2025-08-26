import { useState, useEffect } from 'react';
import { WorldMap } from '../components/WorldMap';
import { CountryList } from '../components/CountryList';



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
    // Accept any country name (case-insensitive, not already highlighted)
    // Optionally, you can check against a list of valid countries here
    if (!highlightedCountries.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setHighlightedCountries([...highlightedCountries, trimmed]);
      setLastFound(trimmed);
    } else {
      setLastFound(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Country Guess Quiz</h1>
      <form className="mb-4 flex gap-2" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a country name..."
          className="border rounded px-2 py-1"
        />
      </form>
      {lastFound && (
        <div className="text-green-600 text-sm mb-2">Country found: {lastFound}</div>
      )}
      <div className="w-full max-w-3xl h-[500px] bg-white rounded shadow">
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
      <CountryList />
    </div>
  );
}

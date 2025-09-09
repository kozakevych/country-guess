import { useState, useEffect } from 'react';
import { WorldMap } from '../components/WorldMap';
import { CountryList } from '../components/CountryList';
import { TopToolbar } from '../components/TopToolbar';
import { CongratsPopup } from '../components/CongratsPopup';
import { ResetConfirmPopup } from '../components/ResetConfirmPopup';
import COUNTRIES from '../assets/countries.json';
import io from 'socket.io-client';

const countries = COUNTRIES;
const socket = io(
  process.env.NODE_ENV === 'production'
    ? 'https://country-guess-3dte.onrender.com'
    : 'http://localhost:3333'
);

export default function App() {
  const [input, setInput] = useState('');
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [lastFound, setLastFound] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [multiplayer, setMultiplayer] = useState(false);
  const [playerList, setPlayerList] = useState<string[]>([]);
  const [playerMenuOpen, setPlayerMenuOpen] = useState(false);

  useEffect(() => {
    if (multiplayer) {
      socket.emit('guessCountry', highlightedCountries);
    }
    socket.on('update', (socketData) => {
      if (playerList.length !== socketData.players.length) {
        setPlayerList(socketData.players);
      }
      if (socketData.countries?.length > highlightedCountries.length) {
        setHighlightedCountries(socketData.countries);
      }
    });
  }, [multiplayer, highlightedCountries, playerList]);

  useEffect(() => {
    const trimmed = input.trim();
    const countryExists = countries.find(c => c.name.toLowerCase() === trimmed.toLowerCase() || c.alias?.toLowerCase() === trimmed.toLowerCase());
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

  const joinRoom = () => {
      socket.emit('joinRoom');
  };
  const leaveRoom = () => {
      socket.emit('leaveRoom');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative p-3">
      <TopToolbar
        playerMenuOpen={playerMenuOpen}
        setPlayerMenuOpen={() => setPlayerMenuOpen(!playerMenuOpen)}
        playerList={playerList}
        multiplayer={multiplayer}
        setMultiplayer={() => {
          setHighlightedCountries([]);
          setMultiplayer(!multiplayer);
          !multiplayer ? joinRoom() : leaveRoom();
        }}
      />

      {showCongrats && <CongratsPopup onClose={() => setShowCongrats(false)} />}
      {showResetConfirm && (
        <ResetConfirmPopup
          onConfirm={() => {
            setHighlightedCountries([]);
            localStorage.removeItem('highlightedCountries');
            setShowCongrats(false);
            setShowResetConfirm(false);
          }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      <img className="mt-2 mb-4" src="./country-guess-logo-2.png" alt="Country Guess Logo" width="300" />
      <h1 className="text-2xl font-bold mb-2">
        How Many Countries Can You Name?
      </h1>
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

      {!multiplayer && (
        <button
          className="m-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={() => setShowResetConfirm(true)}
        >
          Reset Progress
        </button>
      )}
    </div>
  );
}

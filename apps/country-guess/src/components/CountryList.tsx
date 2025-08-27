import { useState } from 'react';
import COUNTRIES from '../assets/countries.json';

const CONTINENTS = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
  'Antarctica',
];

const countries = COUNTRIES;

export const CountryList = ({highlightedCountries}: {highlightedCountries: string[]}) => {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="mt-8 w-full max-w-3xl">
      {CONTINENTS.map((continent) => (
        <div key={continent} className="mb-4">
          <h2 className="text-xl font-semibold mb-2">{continent}</h2>
          <div className="flex flex-wrap gap-2">
            {countries.filter((c) => c.continent === continent).map((country) => {
                const isHighlighted = highlightedCountries && highlightedCountries.find((c) => c.toLowerCase() === country.name.toLowerCase());
                return (
                  <div key={country.name}
                  style={{ minWidth: `${country.name.length * 9}px` }}
                        className={`px-2 py-1 h-[28px] rounded text-sm ${isHighlighted ? 'bg-green-200' : 'bg-gray-200'}`}>
                    {showAll || isHighlighted ? country.name : ''}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
        <button onClick={() => setShowAll(!showAll)} className="mt-2 mb-4 text-sm text-blue-500">
        {showAll ? 'Hide not revealed countries' : 'Show all countries'}
        </button>
    </div>
  );
};

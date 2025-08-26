import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

import * as geoData from '../assets/pasted.json';

export const WorldMap = ({ highlightedCountries }: { highlightedCountries: string[] }) => {
  return (
    <ComposableMap>
      <Geographies geography={geoData}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const isHighlighted =
              highlightedCountries &&
              highlightedCountries.some(
                (country) => geo.properties.name?.toLowerCase() === country.toLowerCase()
              );
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isHighlighted ? '#FF5722' : '#DDD'}
                stroke="#FFF"
                style={{ default: { outline: 'none' } }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

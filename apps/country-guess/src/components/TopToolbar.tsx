export function TopToolbar({
  playerMenuOpen,
  playerList,
  multiplayer,
  setMultiplayer,
  setPlayerMenuOpen
}: {
  playerMenuOpen: boolean;
  playerList: string[];
  multiplayer: boolean;
  setMultiplayer: (m: boolean) => void;
  setPlayerMenuOpen: (o: boolean) => void;
}) {
  return (
    <div className="w-full flex justify-end items-center h-14 px-4">
      {multiplayer && (
        <div className="relative mr-4">
        <button
          className="px-4 py-2 bg-grey-600 border-blue-600 border-2 text-blue-600 rounded hover:bg-blue-100 transition font-semibold"
          onClick={() => setPlayerMenuOpen(!playerMenuOpen)}
        >
            Current Players ({playerList.length})
        </button>

        {playerMenuOpen && <div className="absolute w-60 bg-white border rounded shadow-lg z-50">
          <div className="p-6">
            <div className="font-semibold mb-2">Players:</div>
            <div className="flex flex-wrap gap-2">
              {playerList.map((player, index) => (
                <div key={index} className="flex items-center inline-flex">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                    src={`https://randomuser.me/api/portraits/lego/${index % 10}.jpg`}
                    alt={player}
                    title={player}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>}
        </div>
      )}
      <div className="relative">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          onClick={() => setMultiplayer(!multiplayer)}
        >
            {multiplayer ? 'Switch to Single Player' : 'Switch to Multiplayer'}
        </button>
      </div>
    </div>
  );
}

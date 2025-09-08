export function TopToolbar({
  playerList,
  multiplayer,
  setMultiplayer,
}: {
  playerList: string[];
  multiplayer: boolean;
  setMultiplayer: (m: boolean) => void;
}) {
  return (
    <div className="fixed top-0 left-0 w-full flex justify-end items-center bg-white shadow z-50 h-14 px-4">
      <div className="absolute left-4 flex items-center space-x-4">
        {multiplayer && <div>Current players:</div>}
        {playerList.map((player, index) => (
          <img
            key={index}
            className="w-8 h-8 rounded-full border-2 border-gray-300"
            src={`https://randomuser.me/api/portraits/lego/${index % 10}.jpg`}
            alt={player}
            title={player}
          />
        ))}
      </div>
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

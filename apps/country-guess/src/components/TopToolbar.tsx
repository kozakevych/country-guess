export function TopToolbar({
  menuOpen,
  setMenuOpen,
  multiplayer,
  setMultiplayer,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  multiplayer: boolean;
  setMultiplayer: (m: boolean) => void;
}) {
  return (
    <div className="fixed top-0 left-0 w-full flex justify-end items-center bg-white shadow z-50 h-14 px-4">
      <div className="relative">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menu
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
            <button
              className="w-full text-left px-4 py-2 hover:bg-blue-100"
              onClick={() => {
                setMultiplayer(!multiplayer);
                setMenuOpen(false);
              }}
            >
              {multiplayer ? 'Switch to Single Player' : 'Switch to Multiplayer'}
            </button>
            {/* Add more menu items here if needed */}
          </div>
        )}
      </div>
    </div>
  );
}

export function CongratsPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          <span role="img" aria-label="party popper">🎉</span> Congratulations! <span role="img" aria-label="party popper">🎉</span>
        </h2>
        <p className="mb-4 text-lg text-gray-700">You have found all countries!</p>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

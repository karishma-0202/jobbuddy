const Confirmation = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-80 sm:w-96 p-6 sm:p-8 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          {message}!
        </h3>

        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Confirmation;

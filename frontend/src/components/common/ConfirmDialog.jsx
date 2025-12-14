export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center">

        <p className="text-lg font-medium mb-4">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded-xl"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}
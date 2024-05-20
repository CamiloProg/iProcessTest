import React from "react";

const Modal = ({ titulo, mensaje, onClose, onConfirm, confirmDisabled }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-4 rounded shadow-md'>
        <h2 className='text-lg font-bold mb-4'>{titulo}</h2>
        <p className='mb-4'>{mensaje}</p>
        <div className='flex justify-end space-x-2'>
          <button onClick={onClose} className='px-4 py-2 bg-gray-300 rounded'>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${
              confirmDisabled ? "bg-gray-300" : "bg-blue-500"
            } text-white rounded`}
            disabled={confirmDisabled}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

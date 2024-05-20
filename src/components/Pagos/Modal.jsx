import React, { useState } from "react";

const Modal = ({
  titulo,
  mensaje,
  onClose,
  onConfirm,
  confirmDisabled,
  paymentMethodOptions,
  onPaymentMethodChange,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setSelectedPaymentMethod(selectedMethod);
    onPaymentMethodChange(selectedMethod); // Llamada al evento onPaymentMethodChange
  };
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-4 rounded shadow-md'>
        <h2 className='text-lg font-bold mb-4'>{titulo}</h2>
        <p className='mb-4'>{mensaje}</p>
        <div className='flex flex-col mb-4'>
          <label htmlFor='paymentMethod' className='mb-1'>
            Método de Pago:
          </label>
          <select
            id='paymentMethod'
            value={selectedPaymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <option value=''>Seleccionar método de pago</option>
            {paymentMethodOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className='flex justify-end space-x-2'>
          <button onClick={onClose} className='px-4 py-2 bg-gray-300 rounded'>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${
              confirmDisabled ? "bg-gray-300" : "bg-blue-500"
            } text-white rounded`}
            disabled={confirmDisabled || !selectedPaymentMethod}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

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

  // Se necesita saber que pago fue el seleccionado para asi guardarlo, tambien
  // hay condiciones para que no deje pagar sin elegir el metodo de pago
  // y hay un modal diferente si esta intentando pagar un pago adelantado
  // es decir, que el anterior, no ha sido pagado y tiene que ser en orden
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setSelectedPaymentMethod(selectedMethod);
    onPaymentMethodChange(selectedMethod); 
  };
  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-4 rounded shadow-md flex flex-col items-start w-[40%]'>
        <h2 className='text-lg font-bold mb-4'>{titulo}</h2>
        <p className='mb-4'>{mensaje}</p>
        {!confirmDisabled ? (
          <div className='flex flex-col mb-4'>
            <label htmlFor='paymentMethod' className='mb-1 self-start'>
              Estado
            </label>
            <select
              className='border-[4px] rounded py-2 px-2'
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
        ) : (
          ""
        )}

        <div className='flex justify-end self-end space-x-2'>
          <button onClick={onClose} className='px-4 py-2 bg-gray-300 rounded'>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${
              confirmDisabled || !selectedPaymentMethod
                ? "bg-gray-300"
                : "bg-[#FC4024]"
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

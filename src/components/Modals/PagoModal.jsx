// components/PagoModal.js
import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement("#root");

const PagoModal = ({ isOpen, onRequestClose, pago, marcarComoPagado }) => {
  if (!pago) return null;

  return (
    <Modal style={customStyles} isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Pago seleccionado: {pago.titulo}</h2>
      <p>Monto: ${pago.monto}</p>
      <p>Porcentaje: {pago.porcentaje}%</p>
      <button
        onClick={() => {
          marcarComoPagado(pago.id);
          onRequestClose();
        }}
        className='mt-2 p-2 bg-green-500 text-white rounded'
      >
        Marcar como Pagado
      </button>
      <button
        onClick={onRequestClose}
        className='mt-2 p-2 bg-red-500 text-white rounded'
      >
        Cancelar
      </button>
    </Modal>
  );
};

export default PagoModal;

import React, { useContext } from "react";
import { EditContext } from "../../context/EditContext";

const PayCard = ({
  id,
  titulo,
  porcentaje,
  estado,
  fecha,
  monto,
  ajustarPorcentaje,
  handleFechaCambio,
  hoy,
  eliminarPago,
}) => {
  const formatMonto = (monto) => {
    const montoRedondeado =
      monto % 1 === 0 ? monto.toFixed(0) : monto.toFixed(1);
    return montoRedondeado;
  };

  const { editable } = useContext(EditContext);

  const handleClickEliminar = () => {
    eliminarPago(id); // Llamar a la función eliminarPago con el ID del pago
  };
  return (
    <div key={id} className='flex flex-col p-3 items-center '>
      <span
        onClick={handleClickEliminar} // Agregar evento onClick para eliminar el pago
        className={`border-[3px] cursor-pointer w-12 h-12 rounded-full 
        ${!editable ? "border-none bg-[#E2E8F0]" : "border-[#FC4024]"} `}
      ></span>
      <h2
        className={`text-xl font-bold w-full rounded-sm mt-2
            ${editable ? "border" : ""}`}
      >
        {titulo}
      </h2>
      <div
        className={` w-full rounded-sm mt-2 flex  px-2
      ${editable ? "border justify-between " : "gap-1"}`}
      >
        <h3 className='text-[#0F172A] font-semibold'>${formatMonto(monto)} </h3>
        <h3 className={` font-semibold ${editable ? "text-[#94A3B8]" : ""}`}>
          USD
        </h3>
        {!editable ? <p>({porcentaje.toFixed(0)}%)</p> : ""}
      </div>

      {editable ? (
        <div className='flex items-center justify-center mt-2 gap-3 w-full'>
          <button
            onClick={() => ajustarPorcentaje(id, -5)}
            className='w-7 h-7 text-[#FF7A66] border border-[#FF7A66] rounded-full'
            disabled={!editable}
          >
            <i className='fa-solid fa-minus'></i>
          </button>
          <p>{porcentaje.toFixed(0)}%</p>
          <button
            onClick={() => ajustarPorcentaje(id, 5)}
            className='w-7 h-7 text-[#FF7A66] border border-[#FF7A66] rounded-full'
            disabled={!editable}
          >
            <i className='fa-solid fa-plus '></i>
          </button>
        </div>
      ) : (
        <></>
      )}

      <p className='self-start mt-3 font-normal text-[#94A3B8]'>Vence</p>
      <input
        type='date'
        value={fecha}
        onChange={(e) => handleFechaCambio(id, e.target.value)}
        min={hoy}
        className=''
        disabled={!editable || estado === "pagado"}
      />
    </div>
  );
};

export default PayCard;

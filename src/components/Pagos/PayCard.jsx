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
  handleNombreCambio,
  hoy,
  eliminarPago,
  onSelectPago,
  puedePagar,
}) => {
  const formatMonto = (monto) => {
    const montoRedondeado =
      monto % 1 === 0 ? monto.toFixed(0) : monto.toFixed(1);
    return montoRedondeado;
  };

  const { editable } = useContext(EditContext);

  const handleClickEliminar = () => {
    if (editable) {
      eliminarPago(id);
    }
  };

  return (
    <div
      key={id}
      className={`flex flex-col p-3 items-center ${
        estado === "pagado" ? "bg-green-100" : ""
      }`}
      onClick={() =>
        !editable && estado !== "pagado" && onSelectPago(puedePagar)
      }
    >
      {editable && estado !== "pagado" ? (
        <span
          onClick={handleClickEliminar}
          className={`border-[3px] flex justify-center text-white items-center cursor-pointer hover:bg-[#FC4024] w-12 h-12 rounded-full ${
            !editable ? "border-none bg-[#E2E8F0]" : "border-[#FC4024]"
          }`}
        >
          <div>
            <i className={`fa-solid fa-x`}></i>
          </div>
        </span>
      ) : (
        <span
          className={`border-[3px] w-12 h-12 rounded-full ${
            estado === "pagado"
              ? "bg-green-500 text-white"
              : !editable
              ? "border-none bg-[#E2E8F0]"
              : "border-[#FC4024]"
          }`}
        ></span>
      )}

      <input
        type='text'
        className={`text-xl bg-transparent text-center pointer-events-none placeholder-black font-bold w-36 rounded-sm mt-2 ${
          editable && estado !== "pagado" ? "border pointer-events-auto " : ""
        }`}
        onChange={(e) => handleNombreCambio(id, e.target.value)}
        placeholder={titulo}
        disabled={!editable || estado === "pagado"}
      ></input>
      <div
        className={`w-full rounded-sm mt-2 flex px-2 ${
          editable && estado !== "pagado" ? "border justify-between" : "gap-1"
        }`}
      >
        <h3 className='text-[#0F172A] font-semibold'>${formatMonto(monto)}</h3>
        <h3
          className={`font-semibold ${
            editable && estado == "pagado"
              ? "text-black"
              : editable
              ? "text-[#94A3B8]"
              : ""
          }`}
        >
          USD
        </h3>
        {editable && estado == "pagado" ? (
          <p>({porcentaje.toFixed(0)}%)</p>
        ) : !editable ? (
          <p>({porcentaje.toFixed(0)}%)</p>
        ) : (
          ""
        )}
      </div>

      {editable && estado !== "pagado" ? (
        <div className='flex items-center justify-center mt-2 gap-3 w-full'>
          <button
            onClick={() => ajustarPorcentaje(id, -1)}
            className='w-7 h-7 text-[#FF7A66] border border-[#FF7A66] rounded-full'
            disabled={!editable}
          >
            <i className='fa-solid fa-minus'></i>
          </button>
          <p>{porcentaje.toFixed(0)}%</p>
          <button
            onClick={() => ajustarPorcentaje(id, 1)}
            className='w-7 h-7 text-[#FF7A66] border border-[#FF7A66] rounded-full'
            disabled={!editable}
          >
            <i className='fa-solid fa-plus'></i>
          </button>
        </div>
      ) : null}

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

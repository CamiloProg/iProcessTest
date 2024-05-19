import React from "react";

const PayCard = ({
  id,
  titulo,
  porcentaje,
  estado,
  fecha,
  monto,
  total,
  ajustarPorcentaje,
  handleFechaCambio,
  marcarComoPagado,
  hoy,
}) => {
  const formatMonto = (monto) => {
    return monto % 1 === 0 ? monto.toFixed(0) : monto.toFixed(1);
  };

  return (
    <div key={id} className='flex flex-col p-3  items-center '>
      <span className='border-[3px] border-[#FC4024] w-12 h-12 rounded-full'></span>
      <h2 className='text-xl font-bold border w-full rounded-sm mt-2'>
        {titulo}
      </h2>
      <div className='border w-full rounded-sm mt-2 flex justify-between px-2'>
        <h3 className='text-[#0F172A] font-semibold'>${formatMonto(monto)} </h3>
        <h3 className=' text-[#94A3B8] font-semibold'>USD</h3>
      </div>

      <div className='flex items-center justify-center mt-2 gap-3 w-full'>
        <button
          onClick={() => ajustarPorcentaje(id, -5)}
          className=' w-7 h-7 text-[#FF7A66] border border-[#FF7A66] rounded-full'
        >
          <i className='fa-solid fa-minus'></i>
        </button>
        <p>{porcentaje.toFixed(0)}%</p>
        <button
          onClick={() => ajustarPorcentaje(id, 5)}
          className='w-7 h-7 text-[#FF7A66] border border-[#FF7A66] rounded-full'
        >
          <i className='fa-solid fa-plus '></i>
        </button>
      </div>
      <p className='self-start mt-3  font-normal text-[#94A3B8]'>Vence</p>
      <input
        type='date'
        value={fecha}
        onChange={(e) => handleFechaCambio(id, e.target.value)}
        min={hoy}
        className=''
        disabled={estado === "pagado"}
      />
      {/* <button
        onClick={() => marcarComoPagado(id)}
        className='mt-2 p-1 bg-green-500 text-white rounded'
        disabled={estado === "pagado"}
      >
        Marcar como Pagado
      </button> */}
    </div>
  );
};

export default PayCard;

import React, { useContext } from "react";
import { EditContext } from "../../context/EditContext";
import iconPaid from "../../assets/iconPaid2.png";
const PayCard = ({
  id,
  titulo,
  porcentaje,
  estado,
  fecha,
  monto,
  paymentMethod,
  ajustarPorcentaje,
  handleFechaCambio,
  handleNombreCambio,
  hoy,
  eliminarPago,
  onSelectPago,
  puedePagar,
}) => {

  // Aqui el monto se le da un formato para que se redondee y no muestre muchas decimales
  const formatMonto = (monto) => {
    const montoRedondeado =
      monto % 1 === 0 ? monto.toFixed(0) : monto.toFixed(1);
    return montoRedondeado;
  };

  // Para poder tener la fecha seteada con los diferentes meses y no con el formato de dd/mm/yyyy
  const formatFecha = (fechaString) => {
    // Array de meses en español
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    // Obtener objeto Date a partir de la cadena de fecha
    const fecha = new Date(fechaString);

    // Obtener día, mes y año
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    // Construir la cadena formateada
    const fechaFormateada = `${dia} ${mes}, ${anio}`;

    return fechaFormateada;
  };
  // Contexto para saber si la pagina esta en modo editar o no, y asi
  // mostrar ciertos estilos y funcionalidades o no
  const { editable } = useContext(EditContext);

  const handleClickEliminar = () => {
    if (editable) {
      eliminarPago(id);
    }
  };

  return (
    <div key={id} className={`flex flex-col p-3 z-20 items-center }`}>
      {/* Realice muchas condiciones ya que es un componente el cual cambia
      segun el estado en el que se encuentre, si esta pagado tendra una vista,
      si esta en editar, otra y si esta sin editar ni pagado, tendra otra vista diferente */}
      {editable && estado !== "pagado" ? (
        <span
          onClick={handleClickEliminar}
          className={`border-[3px] flex justify-center bg-white  text-white items-center transition-all duration-500 cursor-pointer hover:bg-[#FC4024] w-12 h-12 rounded-full ${
            !editable ? "border-none bg-[#E2E8F0] " : "border-[#FC4024]"
          }`}
        >
          <i className={`fa-solid fa-x`}></i>
        </span>
      ) : (
        <span
          onClick={() =>
            !editable && estado !== "pagado" && onSelectPago(puedePagar)
          }
          className={`border-[3px] w-12 h-12 text-[#E2E8F0] transition-all duration-500 hover:text-[#FC4024] rounded-full flex justify-center items-center cursor-pointer hover:border-[#FC4024]  ${
            estado === "pagado"
              ? "bg-green-500 text-white border-none cursor-default flex justify-center items-center"
              : !editable
              ? " bg-[#E2E8F0]"
              : "border-[#FC4024] "
          }`}
        >
          {estado === "pagado" ? (
            <img src={iconPaid} alt='' />
          ) : (
            <i className='fa-solid  fa-pencil  '></i>
          )}
        </span>
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
        className={`w-full justify-center rounded-sm mt-2 flex px-2 ${
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

      {estado === "pagado" ? (
        <>
          <p className='mt-3 self-center font-normal text-[#059669]'>
            Pagado {formatFecha(new Date().toISOString())} <br /> con{" "}
            {paymentMethod}
          </p>
        </>
      ) : (
        <>
          {editable ? (
            <>
              <p className='self-start mt-3 font-normal text-[#94A3B8]'>
                Vence
              </p>
              <input
                type='date'
                value={fecha}
                onChange={(e) => handleFechaCambio(id, e.target.value)}
                min={hoy}
                className=''
                disabled={!editable || estado === "pagado"}
              />
            </>
          ) : (
            <p>{fecha ? formatFecha(fecha) : "mm/dd/yyyy"}</p>
          )}
        </>
      )}
    </div>
  );
};

export default PayCard;

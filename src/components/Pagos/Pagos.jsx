import React, { useState, useContext, useEffect } from "react";
import PayCard from "./PayCard";
import { EditContext } from "../../context/EditContext";
import Modal from "./Modal";

const Pagos = ({ total }) => {
  const { editableTrue } = useContext(EditContext);

  // -------------------------------------------------------------------------
  //Funcion para resetear todos los valores a default para poder iniciar el proceso de nuevo
  function reset() {
    setPagos([
      {
        id: 1,
        titulo: "Anticipo",
        porcentaje: 100,
        estado: "pendiente",
        fecha: "",
        monto: total,
      },
    ]);
  }

  // -------------------------------------------------------------------------
  // Se guardan los pagos en esta variable "pagos" use el localStorage para que
  // el usuario pueda salir o recargar la pagina sin temor a que se borren los datos
  // de las cuotas (el porcentaje, monto, cuantas son, etc).
  // Si no tiene nada en el local, simplemente se ponen los datos default

  //@todo: API GET para obtener los pagos de un usuario
  const [pagos, setPagos] = useState(() => {
    const storedPagos = localStorage.getItem("pagos");
    return storedPagos
      ? JSON.parse(storedPagos)
      : [
          {
            id: 1,
            titulo: "Anticipo",
            porcentaje: 100,
            estado: "pendiente",
            fecha: "",
            monto: total,
          },
        ];
  });

  // -------------------------------------------------------------------------
  // Estados que permiten pagar una cuota, hice estos 2, para poder identificar
  // que pago estan seleccionando y ademas validad con el "canPay" si es una
  // cuota que se pueda pagar, es decir, no puede pagarse si la anterior
  // a ella no se ha pagado
  const [selectedPago, setSelectedPago] = useState(null);
  const [canPay, setCanPay] = useState(false);

  useEffect(() => {
    localStorage.setItem("pagos", JSON.stringify(pagos));
  }, [pagos]);

  // -------------------------------------------------------------------------
  // Hice esta funciona ya que necesitaba recalcular los porcentajes de los pagos
  // pero solo los pendientes, ya que los pagados no son modificables
  // de esta forma cuando se agrega un nuevo pago, se equilibran entre todos los pendientes
  const recalcularPagosPendientes = (pagos, total) => {
    const pagosPendientes = pagos.filter((pago) => pago.estado === "pendiente");
    const pagosPagados = pagos.filter((pago) => pago.estado === "pagado");

    const totalPorcentajePagados = pagosPagados.reduce(
      (acc, pago) => acc + pago.porcentaje,
      0
    );
    const porcentajeRestante = 100 - totalPorcentajePagados;

    const nuevoPorcentajeBase = porcentajeRestante / pagosPendientes.length;

    return pagos.map((pago) => {
      if (pago.estado === "pendiente") {
        return {
          ...pago,
          porcentaje: nuevoPorcentajeBase,
          monto: (total * nuevoPorcentajeBase) / 100,
        };
      }
      return pago;
    });
  };

  // -------------------------------------------------------------------------
  // Se crea el nuevo pago con ciertas caracteristicas por default y se cambia
  // al modo editable para que puedan cambiar el nombre y el porcentaje a pagar
  // Use la funcion de recalcular para que se equilibren los porcentajes al crear

  // @todo: API POST para crear nuevo pago
  const crearNuevoPagoEnPosicion = (index) => {
    const nuevoPago = {
      id: pagos.length + 1,
      titulo: `Nuevo`,
      porcentaje: 0,
      estado: "pendiente",
      fecha: "",
      monto: 0,
      editable: true,
    };

    const nuevosPagos = [
      ...pagos.slice(0, index + 1),
      nuevoPago,
      ...pagos.slice(index + 1),
    ];
    const pagosRecalculados = recalcularPagosPendientes(nuevosPagos, total);
    setPagos(pagosRecalculados);
    editableTrue();
  };

  // -------------------------------------------------------------------------
  // Esta funcion fue interesante, ya que se necesita varias verificaciones para no
  // perder porcentaje final o el monto, asi que cuando se elimina un pago
  // decidi que el porcentaje que tuviera, se pasaria al pago pendiente mas cercano

  //@todo: API DELETE para eliminar un pago
  const eliminarPago = (id) => {
    const indexEliminado = pagos.findIndex((pago) => pago.id === id);
    if (indexEliminado === -1 || indexEliminado === 0) return; // No hacer nada si el pago no existe o es el primer pago

    const pagoAEliminar = pagos[indexEliminado];
    if (!pagoAEliminar) return;

    let indexTransferirPorcentaje = -1;
    let porcentajeEliminado = 0;

    // Encontrar el índice del pago pendiente más cercano para transferir el porcentaje
    for (let i = indexEliminado - 1; i >= 0; i--) {
      if (pagos[i].estado === "pendiente") {
        indexTransferirPorcentaje = i;
        break;
      }
    }

    // Si no hay pagos pendientes antes del eliminado, buscar después del eliminado
    if (indexTransferirPorcentaje === -1) {
      for (let i = indexEliminado + 1; i < pagos.length; i++) {
        if (pagos[i].estado === "pendiente") {
          indexTransferirPorcentaje = i;
          break;
        }
      }
    }

    // Transferir el porcentaje del pago eliminado al pago pendiente más cercano
    if (indexTransferirPorcentaje !== -1) {
      porcentajeEliminado = pagoAEliminar.porcentaje;
      pagos[indexTransferirPorcentaje].porcentaje += porcentajeEliminado;
      pagos[indexTransferirPorcentaje].monto =
        (total * pagos[indexTransferirPorcentaje].porcentaje) / 100;
    }

    // Eliminar el pago
    const nuevosPagos = pagos.filter((pago) => pago.id !== id);

    // Reorganizar IDs y títulos
    const pagosFinales = nuevosPagos.map((pago, index) => ({
      ...pago,
      id: index + 1,
      titulo: index === 0 ? "Anticipo" : pago.titulo,
    }));

    // Actualizar el estado de los pagos pendientes si el pago eliminado estaba pagado
    if (pagoAEliminar.estado === "pagado") {
      pagosFinales.forEach((pago) => {
        if (pago.estado === "pendiente") {
          pago.estado = "pagado";
        }
      });
    }

    setPagos(pagosFinales);
  };

  // -------------------------------------------------------------------------
  // Simplemente es necesario un valor para saber si esta pagado o pendiente
  // para distintas funcionalidades en el sistema

  //@todo: API POST para guardar pago como pagado
  const marcarComoPagado = (id) => {
    const nuevosPagos = pagos.map((pago) =>
      pago.id === id && pago.estado === "pendiente"
        ? { ...pago, estado: "pagado" }
        : pago
    );

    setPagos(nuevosPagos);
    setSelectedPago(null);
  };


  // -------------------------------------------------------------------------
  // Realice esta funcion para poder modificar los porcentajes de cada pago,
  // agarrando un poco del pago vecino y tambien la condicion para que nunca
  // se pase del 100% o menos del 0%
  const ajustarPorcentaje = (id, delta) => {
    const index = pagos.findIndex((pago) => pago.id === id);
    if (index === -1) return;

    const pagoActual = pagos[index];
    if (pagoActual.estado === "pagado") return;

    let vecinoIndex = index === 0 ? index + 1 : index - 1;
    const pagoVecino = pagos[vecinoIndex];
    if (!pagoVecino || pagoVecino.estado === "pagado") return;

    const nuevoPorcentajeActual = pagoActual.porcentaje + delta;
    const nuevoPorcentajeVecino = pagoVecino.porcentaje - delta;

    if (
      nuevoPorcentajeActual < 0 ||
      nuevoPorcentajeVecino < 0 ||
      nuevoPorcentajeActual > 100 ||
      nuevoPorcentajeVecino > 100
    )
      return;

    const nuevosPagos = [...pagos];
    nuevosPagos[index].porcentaje = nuevoPorcentajeActual;
    nuevosPagos[index].monto = (total * nuevoPorcentajeActual) / 100;
    nuevosPagos[vecinoIndex].porcentaje = nuevoPorcentajeVecino;
    nuevosPagos[vecinoIndex].monto = (total * nuevoPorcentajeVecino) / 100;

    setPagos(nuevosPagos);
  };

  // Las siguientes 4 funciones es para controlar los cambios
  // que hay en los pagos y agregarlos a la lista de pagos
  const handleFechaCambio = (id, fecha) => {
    const nuevosPagos = pagos.map((pago) =>
      pago.id === id ? { ...pago, fecha } : pago
    );

    setPagos(nuevosPagos);
  };
  const handleNombreCambio = (id, titulo) => {
    const nuevosPagos = pagos.map((pago) =>
      pago.id === id ? { ...pago, titulo: titulo } : pago
    );

    setPagos(nuevosPagos);
  };
  const handlePaymentMethodChange = (id, paymentMethod) => {
    const nuevosPagos = pagos.map((pago) =>
      pago.id === id ? { ...pago, paymentMethod } : pago
    );

    setPagos(nuevosPagos);
  };

  const handleSelectPago = (pago, puedePagar) => {
    setCanPay(puedePagar);
    setSelectedPago(pago);
  };
  
  // -------------------------------------------------------------------------
  // Es necesario para cuando paguen, se coloque el dia en el que se oprimio el boton
  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className='container flex flex-col  justify-center items-center  p-4'>
      <div className='mt-4 flex  overflow-x-auto  md:w-[720px] w-full  '>
        {/* Hice este map para mostrar todos los pagos con sus respectivas caracteristicas 
        y con ciertas condiciones para mostrar la linea del tiempo, dependiendo si esta pagado, o si es el primero
        o si es el ultimo, cada uno, tiene una diferente vista */}
        {pagos.map((pago, index) => (
          <React.Fragment key={pago.id}>
            {/* Para hacerlo mas sencillo, elabore un componente y le pase todas las props */}
            <PayCard
              id={pago.id}
              titulo={pago.titulo}
              porcentaje={pago.porcentaje}
              estado={pago.estado}
              fecha={pago.fecha}
              monto={pago.monto}
              total={total}
              ajustarPorcentaje={ajustarPorcentaje}
              handleFechaCambio={handleFechaCambio}
              handleNombreCambio={handleNombreCambio}
              marcarComoPagado={marcarComoPagado}
              paymentMethod={pago.paymentMethod} // Pasar el método de pago como propiedad
              hoy={hoy}
              eliminarPago={eliminarPago}
              puedePagar={index === 0 || pagos[index - 1].estado === "pagado"}
              onSelectPago={(puedePagar) => handleSelectPago(pago, puedePagar)}
            />
            {/* Esta logica condicional la hice para la linea del tiempo */}
            {pagos.length === 1 ? (
              <div className='relative -z-20-'>
                <hr className='border-[#E2E8F0] border-2 w-[130px] absolute top-9 -right-16' />

                <button
                  onClick={() => crearNuevoPagoEnPosicion(index)}
                  className='mx-2 p-2 h-10  absolute left-8 mt-4 w-10 rounded-full bg-[#E2E8F0] z-30  text-[#FC4024] transition-all duration-500'
                >
                  <i className='fa-solid fa-plus'></i>
                </button>
              </div>
            ) : index + 1 === pagos.length ? null : index < pagos.length - 2 &&
              pago.estado === "pagado" &&
              pagos[index + 1].estado === "pagado" ? (
              <div className='relative -z-20-'>
                <hr className='border-green-500 border-2 w-[130px] absolute top-9 -right-16' />
              </div>
            ) : (
              <div className='relative -z-20-'>
                <hr className='border-[#E2E8F0] border-2 w-[130px] absolute top-9 -right-16' />
                <button
                  onClick={() => crearNuevoPagoEnPosicion(index)}
                  className='mx-2 p-2 h-10 bg-transparent text-transparent absolute -left-8 mt-4 w-10 rounded-full hover:bg-[#E2E8F0] z-30  hover:text-[#FC4024] transition-all duration-500'
                >
                  <i className='fa-solid fa-plus'></i>
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Modal para hacer el pago */}
      {selectedPago && (
        <Modal
          titulo={canPay ? "Pagar" : "No se puede pagar fuera de orden"}
          mensaje={
            canPay
              ? "Selecciona metodo de pago."
              : "Debe pagar los pagos anteriores antes de realizar este pago."
          }
          onClose={() => setSelectedPago(null)}
          onConfirm={() =>
            canPay &&
            marcarComoPagado(pagos.find((p) => p.id === selectedPago.id).id)
          }
          confirmDisabled={!canPay}
          paymentMethodOptions={["Efectivo", "Tarjeta"]}
          onPaymentMethodChange={(paymentMethod) =>
            handlePaymentMethodChange(selectedPago.id, paymentMethod)
          }
        />
      )}
      {/* Reset para dejar todo por default */}
      <button className='bg-red-400 w-80 mt-10' onClick={() => reset()}>
        reset
      </button>
    </div>
  );
};

export default Pagos;

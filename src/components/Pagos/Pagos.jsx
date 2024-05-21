import React, { useState, useContext, useEffect } from "react";
import PayCard from "./PayCard";
import { EditContext } from "../../context/EditContext";
import Modal from "./Modal";

const Pagos = ({ total }) => {
  const { editableTrue } = useContext(EditContext);
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

  const [selectedPago, setSelectedPago] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [canPay, setCanPay] = useState(false);

  useEffect(() => {
    localStorage.setItem("pagos", JSON.stringify(pagos));
  }, [pagos]);

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

  const crearNuevoPagoEnPosicion = (index) => {
    const nuevoPago = {
      id: pagos.length + 1,
      titulo: `Nuevo`,
      porcentaje: 0, // Porcentaje inicial de 0
      estado: "pendiente",
      fecha: "",
      monto: 0, // Monto inicial de 0
      editable: true,
    };

    const nuevosPagos = [
      ...pagos.slice(0, index + 1),
      nuevoPago,
      ...pagos.slice(index + 1),
    ];

    setPagos(nuevosPagos); // Establecer los pagos sin recalcular inicialmente
    editableTrue();
  };

  const eliminarPago = (id) => {
    const indiceEliminado = pagos.findIndex((pago) => pago.id === id);
    if (indiceEliminado === -1) return;
    const pagoAEliminar = pagos.find((pago) => pago.id === id);
    if (
      !pagoAEliminar ||
      (pagoAEliminar.titulo === "Anticipo" && pagos.length === 1)
    ) {
      // No se puede eliminar el anticipo o la última deuda pendiente
      return;
    }

    const pagoEliminado = pagos[indiceEliminado];
    const nuevosPagos = pagos.filter((pago) => pago.id !== id);

    // Reorganizar IDs y títulos
    const pagosFinales = nuevosPagos.map((pago, index) => ({
      ...pago,
      id: index + 1,
      titulo: index === 0 ? "Anticipo" : pago.titulo,
    }));

    // Calcular el total de los porcentajes de los pagos pendientes
    const totalPorcentajePendiente = pagosFinales.reduce((acc, pago) => {
      return pago.estado === "pendiente" ? acc + pago.porcentaje : acc;
    }, 0);

    // Redistribuir porcentajes y montos solo para los pagos pendientes
    pagosFinales.forEach((pago) => {
      if (pago.estado === "pendiente") {
        // Recalcular el porcentaje del pago pendiente con base en el total de porcentajes pendientes
        pago.porcentaje =
          (pago.porcentaje / totalPorcentajePendiente) *
          (100 -
            pagos
              .filter((p) => p.estado === "pagado")
              .reduce((acc, p) => acc + p.porcentaje, 0));
        pago.monto = (total * pago.porcentaje) / 100;
      }
    });

    setPagos(pagosFinales);
  };

  const marcarComoPagado = (id) => {
    const nuevosPagos = pagos.map((pago) =>
      pago.id === id && pago.estado === "pendiente"
        ? { ...pago, estado: "pagado" }
        : pago
    );

    const pagosRecalculados = recalcularPagosPendientes(nuevosPagos, total);

    setPagos(pagosRecalculados);
    setSelectedPago(null);
  };

  const ajustarPorcentaje = (id, delta) => {
    const index = pagos.findIndex((pago) => pago.id === id);
    if (index === -1) return;

    const pagoActual = pagos[index];
    if (pagoActual.estado === "pagado") return;

    const vecinoIndex = index === 0 ? index + 1 : index - 1;
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
    console.log(paymentMethod);
    setPagos(nuevosPagos);
  };

  const handleSelectPago = (pago, puedePagar) => {
    setCanPay(puedePagar);
    setSelectedPago(pago);
  };

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className='container mx-auto p-4'>
      <div className='mt-4 flex overflow-x-auto'>
        {pagos.map((pago, index) => (
          <React.Fragment key={pago.id}>
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
              pagos[index + 1].estado === "pagado" ? null : (
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
      <button className='bg-red-400 w-80 mt-10' onClick={() => reset()}>
        reset
      </button>
    </div>
  );
};

export default Pagos;

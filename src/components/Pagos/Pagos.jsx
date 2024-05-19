import React, { useState } from "react";
import PayCard from "./PayCard";

// Constantes
const MONEDA = "USD";
const PRECISION = 1;

const Pagos = ({ total }) => {
  const [pagos, setPagos] = useState([
    {
      id: 1,
      titulo: "Anticipo",
      porcentaje: 100,
      estado: "pendiente",
      fecha: "",
      monto: total,
    },
  ]);

  const crearNuevoPago = () => {
    const index = pagos.findIndex((pago) => pago.estado === "pendiente");
    if (index === -1) return;

    const pagoSeleccionado = pagos[index];
    const nuevoPorcentaje = Math.floor(pagoSeleccionado.porcentaje / 2 / 5) * 5;

    const nuevoPago = {
      id: pagos.length + 1,
      titulo: `Pago ${pagos.length}`,
      porcentaje: nuevoPorcentaje,
      estado: "pendiente",
      fecha: "",
      monto: (total * nuevoPorcentaje) / 100,
    };

    const nuevosPagos = [...pagos];

    // Calcular el porcentaje a restar de cada pago existente
    const porcentajeRestar = nuevoPorcentaje / pagos.length;

    // Reducir el porcentaje de todos los pagos existentes
    nuevosPagos.forEach((pago) => {
      pago.porcentaje = Math.max(
        0,
        Math.floor((pago.porcentaje - porcentajeRestar) / 5) * 5
      );
      pago.monto = (total * pago.porcentaje) / 100;
    });

    // Insertar el nuevo pago
    nuevosPagos.push(nuevoPago);

    setPagos(nuevosPagos);
  };

  const marcarComoPagado = (id) => {
    const nuevosPagos = pagos.map((pago) =>
      pago.id === id && pago.estado === "pendiente"
        ? { ...pago, estado: "pagado" }
        : pago
    );

    setPagos(nuevosPagos);
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

    // Verificar que los porcentajes no sean negativos y sean múltiplos de 5
    if (
      nuevoPorcentajeActual < 0 ||
      nuevoPorcentajeVecino < 0 ||
      nuevoPorcentajeActual > 100 ||
      nuevoPorcentajeVecino > 100 ||
      nuevoPorcentajeActual % 5 !== 0 ||
      nuevoPorcentajeVecino % 5 !== 0
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

  const hoy = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato YYYY-MM-DD

  return (
    <div className='container mx-auto p-4'>
      <button
        onClick={crearNuevoPago}
        className='mt-4 p-2 bg-blue-500 text-white rounded'
      >
        Crear Nuevo Pago
      </button>
      <div className='mt-4 flex overflow-x-auto'>
        {pagos.map((pago) => (
          <PayCard
            key={pago.id}
            id={pago.id}
            titulo={pago.titulo}
            porcentaje={pago.porcentaje}
            estado={pago.estado}
            fecha={pago.fecha}
            monto={pago.monto}
            total={total}
            ajustarPorcentaje={ajustarPorcentaje}
            handleFechaCambio={handleFechaCambio}
            marcarComoPagado={marcarComoPagado}
            hoy={hoy}
          />
        ))}
      </div>
    </div>
  );
};

export default Pagos;

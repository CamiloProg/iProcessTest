// components/Pagos.js
import React, { useState, useContext, useEffect } from "react";
import PayCard from "./PayCard";

const Pagos = ({ total }) => {
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
  useEffect(() => {
    localStorage.setItem("pagos", JSON.stringify(pagos));
  }, [pagos]);

  const crearNuevoPago = () => {
    const cantidadPagos = pagos.length;
    const nuevoPorcentajeBase = 100 / (cantidadPagos + 1); // Se agrega 1 por el nuevo pago
    const nuevoPago = {
      id: pagos.length + 1,
      titulo: `Pago ${pagos.length}`,
      porcentaje: nuevoPorcentajeBase,
      estado: "pendiente",
      fecha: "",
      monto: (total * nuevoPorcentajeBase) / 100,
    };

    const nuevosPagos = [...pagos, nuevoPago];

    // Ajustar porcentajes de los pagos existentes
    nuevosPagos.forEach((pago) => {
      pago.porcentaje = nuevoPorcentajeBase;
      pago.monto = (total * nuevoPorcentajeBase) / 100;
    });

    setPagos(nuevosPagos);
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
      titulo: index === 0 ? "Anticipo" : `Pago ${index}`,
    }));

    // Sumar el monto del pago eliminado al siguiente pago
    if (indiceEliminado > 0 && pagoEliminado.estado === "pendiente") {
      const pagoAnterior = pagosFinales[indiceEliminado - 1];
      const nuevoMonto = pagoAnterior.monto + pagoEliminado.monto;
      pagosFinales[indiceEliminado - 1] = {
        ...pagoAnterior,
        monto: nuevoMonto,
      };
    }

    // Recalcular porcentajes y montos
    const totalPorcentaje = pagosFinales.reduce(
      (acc, pago) => acc + pago.porcentaje,
      0
    );
    const factorRedistribucion = total / (total - pagoEliminado.monto);

    pagosFinales.forEach((pago) => {
      pago.porcentaje = (pago.porcentaje / totalPorcentaje) * 100;
      pago.monto = (total * pago.porcentaje) / 100;
    });

    setPagos(pagosFinales);
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

  const hoy = new Date().toISOString().split("T")[0];

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
            eliminarPago={eliminarPago}
          />
        ))}
      </div>
    </div>
  );
};

export default Pagos;

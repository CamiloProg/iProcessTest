import React from "react";

export default function Debt() {
  const pagoTotal = 182;

  return (
    <div className='flex gap-2 items-center '>
      <h2 className='text-[#94A3B8]'>Por cobrar</h2>
      <h2 className='text-[#0F172A] font-semibold'>{pagoTotal} USD</h2>
    </div>
  );
}

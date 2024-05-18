import React from "react";
import EditButton from "./EditButton";
import OptionsButton from "./OptionsButton";
import Debt from "./Debt";

export default function NavBar() {
  return (
    <div className='flex border-b-#F1F5F9] border-b w-full items-center justify-between p-3 '>
      <OptionsButton />
      <div className='flex gap-3 items-center'>
        <EditButton />
        <Debt />
      </div>
    </div>
  );
}

import React, { useContext } from "react";
import { EditContext } from "../../context/EditContext"; // Asegúrate de importar EditContext correctamente

const EditButton = () => {
  const { editable, toggleEditable } = useContext(EditContext);

  return (
    <div
      className={`flex items-center cursor-pointer gap-1 font-semibold ${
        editable ? "text-green-500" : "text-[#FF7A66]"
      }`}
      onClick={toggleEditable}
    >
      <h3
        className={`${
          editable
            ? "bg-[#FC4024] hover:scale-105 px-5 py-2 flex justify-center items-center rounded-md text-white"
            : "text-lg"
        }`}
      >
        {editable ? "Guardar" : "Editar"}
      </h3>
      <i className={`fa-solid ${editable ? "" : "fa-pencil"}`}></i>
    </div>
  );
};

export default EditButton;

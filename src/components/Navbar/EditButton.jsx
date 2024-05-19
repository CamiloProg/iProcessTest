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
      <h3>{editable ? "Guardar" : "Editar"}</h3>
      <i className={`fa-solid ${editable ? "fa-save" : "fa-pencil"}`}></i>
    </div>
  );
};

export default EditButton;

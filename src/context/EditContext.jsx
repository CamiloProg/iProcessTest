import React, { createContext, useState } from "react";

const EditContext = createContext();

const EditProvider = ({ children }) => {
  const [editable, setEditable] = useState(false);

  const toggleEditable = () => {
    setEditable(!editable);
  };
  const editableTrue = () => {
    setEditable(true);
  };

  return (
    <EditContext.Provider value={{ editable, toggleEditable, editableTrue }}>
      {children}
    </EditContext.Provider>
  );
};

export { EditContext, EditProvider };

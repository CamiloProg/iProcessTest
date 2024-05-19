import React, { createContext, useState } from "react";

const EditContext = createContext();

const EditProvider = ({ children }) => {
  const [editable, setEditable] = useState(false);

  const toggleEditable = () => {
    setEditable(!editable);
  };

  return (
    <EditContext.Provider value={{ editable, toggleEditable }}>
      {children}
    </EditContext.Provider>
  );
};

export { EditContext, EditProvider };

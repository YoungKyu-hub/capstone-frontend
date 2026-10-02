import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [point, setPoint] = useState(2000);
  const [ownedItems, setOwnedItems] = useState([]);

  const [equipped, setEquipped] = useState({
    profile: null,
    hat: null,
    face: null,
    clothes: null,
    background: null,
    accessory: null,
  });

  return (
    <UserContext.Provider
      value={{
        point,
        setPoint,
        ownedItems,
        setOwnedItems,
        equipped,
        setEquipped,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
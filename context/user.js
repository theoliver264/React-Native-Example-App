import React, { createContext, useState } from "react";

const defaultUser = {
  id: "",
  username: "",
  name: "",
  email: "",
};

export const UserContext = createContext({
  currentUser: defaultUser,
  setCurrentUser() {},
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(defaultUser);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

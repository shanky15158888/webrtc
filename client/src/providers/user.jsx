import React from "react";

const userContext = React.createContext(null);

export const useUserDetails = () => {
  return React.useContext(userContext);
};

export const UserProvider = (props) => {
  const setUser = (id, userDetails) => {
    localStorage.setItem(
      "user-details",
      JSON.stringify({
        ...getUser(),
        [id]: { ...getUserById(id), ...userDetails },
      })
    );
  };

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem("user-details")) ?? {};
    return user;
  };

  const getUserById = (id) => {
    const user = JSON.parse(localStorage.getItem("user-details"))?.[id] ?? {};
    return user;
  };

  return (
    <userContext.Provider value={{ getUser, setUser, getUserById }}>
      {props.children}
    </userContext.Provider>
  );
};

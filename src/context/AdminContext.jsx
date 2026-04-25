import React, { createContext, useReducer, useEffect } from "react";

export const AdminContext = createContext();

const initialState = {
  adminUser: JSON.parse(localStorage.getItem("adminUser")) || null,
  flights: [],
  loading: false,
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, adminUser: action.payload };
    case "LOGOUT":
      return { ...state, adminUser: null, flights: [] };
    case "SET_FLIGHTS":
      return { ...state, flights: action.payload };
    case "ADD_FLIGHT":
      return { ...state, flights: [action.payload, ...state.flights] };
    case "DELETE_FLIGHT":
      return {
        ...state,
        flights: state.flights.filter((f) => f._id !== action.payload),
      };
    case "UPDATE_STATUS":
      return {
        ...state,
        flights: state.flights.map((f) =>
          f._id === action.payload.id
            ? { ...f, status: action.payload.status }
            : f,
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Save admin session
  useEffect(() => {
    if (state.adminUser)
      localStorage.setItem("adminUser", JSON.stringify(state.adminUser));
    else localStorage.removeItem("adminUser");
  }, [state.adminUser]);

  return (
    <AdminContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
};

import React from "react";
import { UserContext } from "../context/user";
import { useContext } from "react";

export const useUser = () => useContext(UserContext);

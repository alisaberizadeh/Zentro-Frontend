import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const savedUser = Cookies.get("user");
  const parsedUser = savedUser ? JSON.parse(savedUser) : null;
  const [user, setUser] = useState(parsedUser);
  const [token, setToken] = useState(Cookies.get("token") || null);

  const { data: dataUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["userShow", parsedUser?.id , token],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.zentroapp.ir/api/user/${parsedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    enabled: !!parsedUser?.id && !!token,
    staleTime: 60000,
  });

  useEffect(() => {
    if (dataUser?.data?.user) {
      setUser(dataUser.data.user);
      Cookies.set("user", JSON.stringify(dataUser.data.user), { expires: 7 });
    }
  }, [dataUser]);

  // Sign up
  const signUp = async (data) => {
    try {
      const response = await axios.post("https://api.zentroapp.ir/api/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (response.data.status) {
        const userData = response.data.data.user;
        const userToken = response.data.data.token;
        setToken(userToken);
        setUser(userData);

        Cookies.set("user", JSON.stringify(userData), { expires: 7 });
        Cookies.set("token", userToken, { expires: 7 });

        navigate("/");

        toast.success(`Welcome "${userData.name}". You are logged in.`, {
          position: "bottom-left",
          autoClose: 5000,
          style: {
            width: "auto",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            paddingRight: "50px",
          },
        });
      }
    } catch (error) {
      console.error("error system :", error);
    }
  };

  // Sign in
  const signIn = async (data) => {
    try {
      const response = await axios.post("https://api.zentroapp.ir/api/login", {
        username: data.username,
        password: data.password,
      });

      if (response.data.status) {
        const userData = response.data.data.user;
        const userToken = response.data.data.token;
        setToken(userToken);
        setUser(userData);

        Cookies.set("user", JSON.stringify(userData), { expires: 7 });
        Cookies.set("token", userToken, { expires: 7 });

        navigate("/");

        toast.success(`Welcome "${userData.name}". You are logged in.`, {
          position: "bottom-left",
          autoClose: 5000,
          style: {
            width: "auto",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            paddingRight: "50px",
          },
        });
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("error system :", error);
    }
  };

  // logout
  const logout = async () => {
    const token = Cookies.get("token");

    try {
      const response = await axios.post(
        "https://api.zentroapp.ir/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status) {
        Cookies.remove("user");
        Cookies.remove("token");

        setUser(null);
        setToken(null);

        navigate("/login");

        toast.success(`You are logged out.`, {
          position: "bottom-left",
          autoClose: 5000,
          style: {
            width: "auto",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            paddingRight: "50px",
          },
        });
      }
    } catch (error) {
      console.error("error system :", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, logout, signIn ,token }}>
      {children}
    </AuthContext.Provider>
  );
};

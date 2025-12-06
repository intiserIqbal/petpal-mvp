import axios from "axios";
import { setAuthToken } from "./api";

const API = "http://localhost:5000/api/auth"; 
// Change port if your teammate uses a different one

// Login
export async function login(email: string, password: string) {
  const response = await axios.post(`${API}/login`, {
    email,
    password,
  });

  return response.data; // should return { token, user }
}

// Register
export async function register(name: string, email: string, password: string) {
  const response = await axios.post(`${API}/register`, {
    name,
    email,
    password,
  });

  return response.data; // should return { token, user }
}

export function logout() {
  localStorage.removeItem("token");
  setAuthToken(); // clear Authorization header
  window.dispatchEvent(new Event("storage"));
}

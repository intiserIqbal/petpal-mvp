import axios from "axios";

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

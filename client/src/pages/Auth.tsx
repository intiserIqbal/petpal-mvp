// client/src/pages/Auth.tsx
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import type { User } from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup success");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login success");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <h1 className="text-3xl font-bold">PetPal Auth</h1>
      <input
        className="border p-2 w-64 rounded"
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-64 rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={signup}>Sign Up</button>
        <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={login}>Log In</button>
        {user && <button className="bg-gray-400 px-3 py-1 rounded" onClick={logout}>Logout</button>}
      </div>
      {user && <p className="mt-2">Logged in as <b>{user.email}</b></p>}
    </div>
  );
}

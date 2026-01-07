import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/pair");
  };

  const register = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
    navigate("/pair");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <input className="border p-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="border p-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-green-500 text-white px-4 py-2" onClick={login}>Login</button>
      <button className="bg-blue-500 text-white px-4 py-2" onClick={register}>Register</button>
    </div>
  );
}

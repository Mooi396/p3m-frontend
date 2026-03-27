import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Head from "./head";
import { LoginUser, reset } from "../features/authSlice";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
 
export default function LoginPage() {
const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan/menyembunyikan password
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
     <div>
      {/* head start   */}
      <Head title={"E-Caku | Masuk"} />
      {/* head end  */}

      {/* navbar start  */}
      {/* navbar end  */}

      {/* content start  */}
      <div
        className="hero min-h-screen min-w-screen"
      >
        <div className="hero-content block">
          <div className="card shrink-0 w-full shadow-md bg-base-100 mt-8">
            <div className="card-body">
              {/* {isError && (
                // <FormAlert>
                //   <span>{message}</span>
                // </FormAlert>
              )} */}
              <form onSubmit={Auth}>
                <h1 className="text-5xl font-semibold text-center">Masuk</h1>
                <p className="text-xl text-center">
                  hei, masukkan detail Anda untuk masuk ke akun Anda
                </p>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
                      className="input input-bordered w-full"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-eye"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="#000000"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-eye-closed"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="#000000"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" />
                          <path d="M3 15l2.5 -3.8" />
                          <path d="M21 14.976l-2.492 -3.776" />
                          <path d="M9 17l.5 -4" />
                          <path d="M15 17l-.5 -4" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-purple">
                    {isLoading ? "Loading..." : "Masuk"}
                  </button>
                </div>
                <p className="text-center">
                  belum punya akun?{" "}
                  <a href="/daftar" className="link link-primary">
                    Daftar
                  </a>
                </p>
              </form>
            </div>
          </div>
          <footer>
            <p className="text-center pt-8 mt-6">
              © Copyright E-Caku. All Rights Reserved
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
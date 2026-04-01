import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Head from "./head";
import { LoginUser, reset } from "../features/authSlice";
import {
  Card,
  Input,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
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

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Head title={"Masuk"} />
      
      <Card color="transparent" shadow={false} className="w-full max-w-[400px] bg-white p-8 border border-blue-gray-50 shadow-xl shadow-blue-gray-900/5">
        <Typography variant="h4" color="blue-gray" className="text-center">
          Masuk
        </Typography>
        <Typography color="gray" className="mt-1 font-normal text-center mb-8">
          Masukkan detail Anda untuk masuk ke akun Anda.
        </Typography>

        <form onSubmit={Auth} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <Typography variant="small" color="blue-gray" className="font-medium">
              Email Anda
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="small" color="blue-gray" className="font-medium">
              Kata Sandi
            </Typography>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                placeholder="********"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <IconButton
                variant="text"
                size="sm"
                className="!absolute right-1 top-1 rounded"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </IconButton>
            </div>
          </div>
          {isError && (
            <Typography variant="small" color="red" className="text-center font-medium">
              {message}
            </Typography>
          )}

          <Button type="submit" size="lg" fullWidth color="gray" loading={isLoading}>
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>

          <Typography color="gray" className="mt-4 text-center font-normal">
            Belum punya akun?{" "}
            <Link to="/daftar" className="font-medium text-gray-900">
              Daftar
            </Link>
          </Typography>
        </form>
      </Card>

      <footer className="mt-auto py-8">
        <Typography variant="small" color="gray" className="text-center font-normal">
          © {new Date().getFullYear()} Forum Kepala P3M Politeknik Se-Indonesia. All Rights Reserved
        </Typography>
      </footer>
    </div>
  );
}
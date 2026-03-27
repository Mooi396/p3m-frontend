import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import DaftarBeritaAdmin from '../components/admin/daftarBerita'
import Head from "../components/head";

const Daftarberita = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(GetMe());
  }, [dispatch]);
  useEffect(() => {
    if (isError) {
      navigate("/masuk");
    }
  }, [isError, navigate]);
  return (
    <div>
        <Head title={"Daftar Berita"} />
        <DaftarBeritaAdmin/>
    </div>
  )
}

export default Daftarberita
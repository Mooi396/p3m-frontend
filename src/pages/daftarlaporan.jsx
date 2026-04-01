import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import DaftarLaporanAdmin from '../components/admin/daftarLaporan'
import Head from "../components/head";

const Daftarlaporan = () => {
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
        <Head title={"Daftar Laporan"} />
        <DaftarLaporanAdmin/>
    </div>
  )
}

export default Daftarlaporan
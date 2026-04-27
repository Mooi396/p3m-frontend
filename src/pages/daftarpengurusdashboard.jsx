import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import DaftarPengurusComponent from "../components/admin-ketua_forum/pengurus/daftarPengurus";
import Head from "../components/head";

const DaftarPengurus = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(GetMe());
  }, [dispatch]);
  
  useEffect(() => {
          if(isError) {
              navigate('/masuk');
              return;
          }
          if(user && user.role !== 'admin' && user.role !== 'ketua_forum') {
              navigate(-1)
          }
      },[isError, user, navigate]);
  
  return (
    <div>
        <Head title={"Daftar Pengurus"} />
        <DaftarPengurusComponent/>
    </div>
  )
}

export default DaftarPengurus
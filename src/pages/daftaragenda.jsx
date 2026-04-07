import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import DaftarAgendaAdmin from "../components/admin/agenda/daftarAgenda";
import Head from "../components/head";

const DaftarAgenda = () => {
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
            if(user && user.role !== 'admin') {
                navigate(-1)
            }
        },[isError, user, navigate]);
  return (
    <div>
        <Head title={"Daftar Agenda"} />
        <DaftarAgendaAdmin/>
    </div>
  )
}

export default DaftarAgenda
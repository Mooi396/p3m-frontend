import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import Head from "../components/head";
import EditBerita from "../components/admin-humas/berita/editBerita";

const EditberitaPage = () => {
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
                if(user && user.role !== 'admin' && user.role !== 'humas') {
                    navigate(-1)
                }
            },[isError, user, navigate]);
  return (
    <div>
        <Head title="Edit Berita" />
        <EditBerita /></div>
  )
}

export default EditberitaPage
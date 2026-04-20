import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import Head from "../components/head";
import DetailBerita from '../components/admin-humas/berita/detailBerita'

const DetailBeritaDashboardPage = () => {
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
      <DetailBerita /></div>
  )
}

export default DetailBeritaDashboardPage
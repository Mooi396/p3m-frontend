import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import Head from "../components/head";
import ProfilOrganisasiComponent from "../components/admin-humas/profil/profilP3M";

const ProfilOrganisasiDashboardPage = () => {
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
        <Head title={"Profil Organisasi"} />
        <ProfilOrganisasiComponent/>
    </div>
  )
}

export default ProfilOrganisasiDashboardPage
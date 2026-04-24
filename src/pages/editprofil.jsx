import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import Head from "../components/head";
import EditProfil from "../components/editProfil";

const EditProfilUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(GetMe());
  }, [dispatch]);
  
  useEffect(() => {
    if (!isLoading) {
      if (isError) {
        navigate('/masuk');
        return;
      }

      if (user && user.status !== "verified") {
        navigate("/dashboard/profil");
      }
    }
  }, [isError, user, navigate, isLoading]);
  if (isLoading) return <div className="h-screen flex justify-center items-center">Authenticating...</div>;
  if (!user || user.status !== "verified") {
    return navigate("/dashboard/profil"); 
  }
  
  return (
    <div>
      <Head title={"Edit Profil Admin"} />
      <EditProfil />
    </div>
  );
};

export default EditProfilUserPage;
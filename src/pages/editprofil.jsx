import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import Head from "../components/head";
import EditProfil from "../components/admin/editProfil";

const EditProfilUserPage = () => {
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
      },[isError, user, navigate]);
  
  return (
    <div>
        <Head title={"Edit Profil Admin"} />
        <EditProfil/>
    </div>
  )
}

export default EditProfilUserPage
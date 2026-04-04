import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import Head from "../components/head";
import DetailProfile from "../components/detailProfile";

const DetailProfilUserPage = () => {
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
        <Head title={"Detail Profil Admin"} />
        <DetailProfile/>
    </div>
  )
}

export default DetailProfilUserPage
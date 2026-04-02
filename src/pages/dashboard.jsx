import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import DashboardAdmin from "../components/admin/dashboardAdmin";
import Head from "../components/head";
import DashboardAnggota from "../components/anggota/dashboardAnggota";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
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
      <Head title={"Dashboard"} />
        {user && user.role === "admin" && (
        <DashboardAdmin/>
        )}
        {user && user.role === "anggota" && (
          <DashboardAnggota/>
        )}
    </div>
  )
}

export default Dashboard
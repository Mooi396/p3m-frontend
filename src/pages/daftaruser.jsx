import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetMe } from "../features/authSlice";
import DaftarUser from '../components/admin/daftarUser'

const Dashboard = () => {
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
        <DaftarUser/>
    </div>
  )
}

export default DaftarUser
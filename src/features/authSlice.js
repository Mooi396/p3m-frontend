import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Helper untuk mengambil token dari localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const LoginUser = createAsyncThunk(
  "user/LoginUser",
  async (user, thunkAPI) => {
    try {
      // 1. Tembak API Login untuk verifikasi email & password
      const response = await axios.post("http://localhost:5000/login", {
        email: user.email,
        password: user.password,
      });
      
      // 2. Simpan token ke localStorage
      let token = null;
      if (response.data.accessToken) {
        token = response.data.accessToken;
        localStorage.setItem("token", token);
      }
      
      // 3. --- SOLUSI GAMBAR PROFIL ---
      // Daripada mereturn data login yang tidak lengkap, kita langsung ambil 
      // data full user (termasuk relasi 'anggotas' dan URL foto) dari endpoint /me
      const meResponse = await axios.get("http://localhost:5000/me", {
        // Gunakan token yang baru saja didapat
        headers: token ? { Authorization: `Bearer ${token}` } : getAuthHeader(), 
        withCredentials: true
      });
      
      // 4. Return data lengkap ke state Redux
      return meResponse.data; 
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

export const GetMe = createAsyncThunk("user/GetMe", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:5000/me", {
      headers: getAuthHeader(), // KIRIM TOKEN DI HEADER
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
  }
});

export const LogOut = createAsyncThunk("user/LogOut", async () => {
  await axios.delete("http://localhost:5000/logout", {
    headers: getAuthHeader(), 
    withCredentials: true
  });
  // HAPUS TOKEN DARI LOCALSTORAGE SAAT LOGOUT
  localStorage.removeItem("token");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // Login User
    builder.addCase(LoginUser.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.message = "";
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      // Sekarang payload ini berisi data LENGKAP (termasuk foto profil)
      state.user = action.payload; 
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    // Get User Login (GetMe)
    builder.addCase(GetMe.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.message = "";
    });
    builder.addCase(GetMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.user = action.payload;
    });
    builder.addCase(GetMe.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    // Logout
    builder.addCase(LogOut.fulfilled, (state) => {
      state.user = null;
      state.isSuccess = true;
      state.isError = false;
      state.message = "";
    });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api"; 

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
      // 2. Ganti 'axios.post("http://localhost:5000...")' menjadi 'api.post'
      const response = await api.post("/login", {
        email: user.email,
        password: user.password,
      });
      
      // Simpan token ke localStorage
      let token = null;
      if (response.data.accessToken) {
        token = response.data.accessToken;
        localStorage.setItem("token", token);
      }
      
      // 3. Ganti 'axios.get("http://localhost:5000...")' menjadi 'api.get'
      const meResponse = await api.get("/me", {
        headers: token ? { Authorization: `Bearer ${token}` } : getAuthHeader(), 
        withCredentials: true
      });
      
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
    // 4. Ganti ke 'api.get' tanpa prefix localhost
    const response = await api.get("/me", {
      headers: getAuthHeader(), 
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
  // 5. Ganti ke 'api.delete'
  await api.delete("/logout", {
    headers: getAuthHeader(), 
    withCredentials: true
  });
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

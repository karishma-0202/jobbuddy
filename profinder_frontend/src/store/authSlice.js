// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isAuthenticated: false,
//   isRecruiter: false,
//   userData: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login: (state, action) => {
//       state.isAuthenticated = true;
//       state.isRecruiter = action.payload.isRecruiter;
//       state.userData = action.payload.userData;
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.isRecruiter = null;
//       state.userData = null;
//     },
//     addJobIdToRecruiter: (state, action) => {
//       if (state.isRecruiter) {
//         state.userData?.jobIds?.push(action.payload.jobId);
//       }
//     },
//   },
// });

// export const { login, logout, addJobIdToRecruiter } = authSlice.actions;

// export default authSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isRecruiter: false,
  userData: null,
  token: null, // ✅ store JWT token
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.isRecruiter = action.payload.isRecruiter;

      // ✅ sanitize userData (no password)
      state.userData = action.payload.userData;
      
      // ✅ store JWT token
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isRecruiter = false;
      state.userData = null;
      state.token = null;
    },
    addJobIdToRecruiter: (state, action) => {
      if (state.isRecruiter) {
        state.userData?.jobIds?.push(action.payload.jobId);
      }
    },
  },
});

export const { login, logout, addJobIdToRecruiter } = authSlice.actions;

export default authSlice.reducer;


'use client';

import { Provider } from "react-redux";
import store from "../redux/store/store";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId =
  "346913891380-jc6ue1tk6jb1urt1r7sv6rg65eucjot5.apps.googleusercontent.com";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick
        position={"top-right"}
        transition={Bounce}
      />
      <GoogleOAuthProvider clientId={clientId}>
        {children}
      </GoogleOAuthProvider>
    </Provider>
  );
}

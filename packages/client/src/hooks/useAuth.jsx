import { useContext } from "react";
import { AuthProvider } from "../provider/auth";

const useAuth = () => useContext(AuthProvider)

export default useAuth;
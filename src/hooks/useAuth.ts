import { useContext } from 'react';
import { AuthContext } from "../contexts/Auth/AuthContext";

export function useAuth() {
    const value = useContext(AuthContext);
    return value;
}
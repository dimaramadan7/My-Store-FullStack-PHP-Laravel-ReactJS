import { Outlet } from "react-router-dom";
import AppBar from "./AppBar";
import Footer from "./Footer";
import styles from './layout.module.scss'
import { createContext, useContext, useState } from 'react';
import { AuthContext } from "../MyApp";
import Side from "./Side";

export const AppContext = createContext({});

export default function Layout() {
    const authContext = useContext(AuthContext)
    const [appState, setAppState] = useState({
        popup: {
            show: false,
            message: '',
        },
        search: '',
        category: null,
        user: null,
        token: null, // cookie
        cart: [{ id: 1, qty: 2 }] // cookie
    })
    const closePopup = () => setAppState({ ...appState, popup: { show: false } });
    const showPopup = (msg) => setAppState({ ...appState, popup: { message: msg, show: true } });
    const setSearch = (newText) => setAppState({ ...appState, search: newText })
    const setCategory = (newCategory) => setAppState({ ...appState, category: newCategory })
    // const setToken = (token) => setAppState({ ...appState, token })
    // const setUser = (user) => setAppState({ ...appState, user })
    const login = (token, user) => {
        authContext.setAuthState(true)
        setAppState({ ...appState, token, user })
    }
    const logout = () => {
        authContext.setAuthState(false)
        setAppState({ ...appState, token: null, user: null })
    }
    return <AppContext.Provider value={{
        appState,
        setAppState,
        closePopup,
        showPopup,
        setSearch,
        setCategory,
        login,
        logout,
    }}>
            <div className={styles.layout}>
                <AppBar />
                <div className={styles.page}>
                   <Side />  
                   <div><Outlet /></div>
                </div>
                <Footer />
            </div>
    </AppContext.Provider>
}
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types"
import { useLocation, useNavigate } from "react-router-dom";
export const AuthProvider = createContext(
    {
        user: null,
        loading: true,
        setLoading: () => { },
        login: () => { },
        logout: () => { }
    }
)




export default function Auth({ children }) {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const rout = useNavigate()
    const loc = useLocation()
    async function login({ username, password }, cbError) {
        try {
            const fet = await fetch("/api/user/login", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            })
            const json = await fet.json()
            if (fet.ok === false) {
                return cbError(json.message)
            }
            const user = json.data.user
            console.log(user)
            const searchParams = new URLSearchParams(loc.search);
            const redirect = searchParams.get('redirect');
            rout(redirect != null ? redirect : "/")
            setUser(user)
            setLoading(false)
        }
        catch (err) {
            console.error(err)
            return cbError("Error")
        }
    }
    async function logout() {
        setLoading(true)
        await fetch("/api/user/logout")
        setUser(null)
        rout("/login")
        setLoading(false)
    }
    async function auth() {
        try {
            setLoading(true)
            const auth = await fetch("/api/user/auth")
            console.log(auth.status)
            if (!auth.ok) {
                if (loc.pathname == "/" || loc.pathname == "/login") {
                    rout("/login")
                } else {
                    rout("/login?redirect=" + encodeURIComponent(loc.pathname))
                }
                return
            }
            const user = await auth.json()
            setUser(user.data)
            if (loc.pathname == "/login") {
                const searchParams = new URLSearchParams(loc.search);
                const redirect = searchParams.get('redirect');
                rout(redirect != null ? redirect : "/")
            }
            setLoading(false)
            // if (user.username != defaultUser.username || user.password != defaultUser.password) {
            //     localStorage.removeItem('user')

            // } else {

            // }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        auth()
    }, [])

    const value = {
        user,
        login,
        loading,
        setLoading,
        logout
    }
    return (
        <>
            <AuthProvider.Provider value={value} >
                {children}
            </AuthProvider.Provider>
        </>
    )
}

Auth.propTypes = {
    children: PropTypes.node
}
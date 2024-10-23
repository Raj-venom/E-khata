import { useState, useEffect, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


export default function AuthLayout({ children, authentication = true }: { children: ReactNode, authentication?: boolean }) {

    const navigate = useNavigate();
    const authStatus = useSelector((state: any) => state.auth.status)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        if (authentication && authStatus !== authentication) {
            navigate("/login")
        } else if (!authentication && authStatus !== authentication) {
            navigate("/")
        }
        setLoading(false)
    }, [authStatus, navigate, authentication])


    return loading ? <h1>Loading...</h1> : <>{children}</>


}
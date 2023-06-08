import { useEffect } from "react"
import {useNavigate} from "react-router-dom"
// eslint-disable-next-line react/prop-types
export default function Navigator({to}) {
    const rout = useNavigate()
    useEffect(() => {
        rout(to)
    }, [])
    return <>
    </>
}
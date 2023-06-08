import { useEffect, useState } from "react";

export default function useFetch(url) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setError] = useState(false)
    useEffect(() => {
        const control = new AbortController()
        const signal = control.signal
        fetching(signal)
        return () => {
            control.abort()
        }
    }, [])
    async function fetching(signal) {
        try {
            console.log(url)
            setIsLoading(true)
            const fet = await fetch(url, {signal})
            const json = await fet.json()
            console.log(json)
            if(!fet.ok) { 
                setIsLoading(false)
                setError(true)
                return
            }
            setData(json.data)
            setIsLoading(false)
            setError(false)
        }catch(err) {
            console.log(err)
            setIsLoading(false)
            setError(true)
        }
    }

    return {
        data,
        refetch : fetching,
        isLoading,
        isError
    }

}
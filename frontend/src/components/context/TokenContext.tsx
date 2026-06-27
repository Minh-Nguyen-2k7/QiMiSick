import { useState, useContext, createContext } from "react";
interface TokenContextType {
    refreshToken: string
    setAccessToken: (token: string) => void
    accessToken: string
    setRefreshToken: (token: string) => void
}

const TokenContext = createContext<TokenContextType | undefined>(undefined)

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken") || "")
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || "")
    const handleSetAccessToken = (token: string) => {
        setAccessToken(token)
        localStorage.setItem("accessToken", token)
    }
    const handleSetRefreshToken = (token: string) => {
        setRefreshToken(token)
        localStorage.setItem("refreshToken", token)
    }
    return <TokenContext.Provider value={{ accessToken, setAccessToken: handleSetAccessToken, refreshToken, setRefreshToken: handleSetRefreshToken }}>
        {children}
    </TokenContext.Provider>
}

export const useToken = () => {
    const context = useContext(TokenContext)
    if (!context) {
        throw new Error("Component use useFilter must be wrapped in TokenProvider")
    }
    return context
}
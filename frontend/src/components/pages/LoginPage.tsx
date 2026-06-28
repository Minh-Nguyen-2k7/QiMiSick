import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import axios from "axios";
import { useToken } from "../context/TokenContext"
import { toast } from "sonner"
import api from "../../lib/axios"
const LoginPage = () => {
    const { setAccessToken, setRefreshToken } = useToken()
    const nagivate = useNavigate()
    const [name, setName] = useState("")
    const [isNamed, setIsNamed] = useState(true)
    const [password, setPassword] = useState("")
    const [isPw, setIsPw] = useState(true)
    const handleSubmit = async () => {
        const nameValid = !!name
        const pwValid = !!password

        setIsNamed(nameValid)
        setIsPw(pwValid)

        if (nameValid && pwValid) {
            try {
                const response = await api.post("/auth/login", {
                    username: name,
                    password: password
                })
                const { accessToken, refreshToken } = response.data
                setAccessToken(accessToken)
                setRefreshToken(refreshToken)
                // Go into the main page
                toast.success(`Welcome User ${name.toUpperCase()}!`)
                nagivate("/app")
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.error(error.response.data)
                }
                else {
                    toast.error("Something went wrong.")
                }
            }

        }
    }
    return (
        <div >
            <Button onClick={() => nagivate("/register")}>Create Account</Button>
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-sm border shadow-md">
                    <CardHeader className="text-center">
                        <CardTitle>Welcome Back</CardTitle>
                        <CardDescription>Sign in to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="name"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    {isNamed ? "" : <p>Missing Name</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
                                    {isPw ? "" : <p>Missing Password</p>}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" onClick={handleSubmit}>
                            Login Account
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage
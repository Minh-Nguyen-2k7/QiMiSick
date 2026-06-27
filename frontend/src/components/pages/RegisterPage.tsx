import { useState } from "react"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import axios from "axios";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import api from "../../lib/axios"
const RegisterPage = () => {
    const [name, setName] = useState<string>("")
    const [isNamed, setIsNamed] = useState(true)
    const [password, setPassword] = useState<string>("")
    const [isPw, setIsPw] = useState(true)
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [isConfirmPw, setIsConfirmPw] = useState(true)
    const [samePw, setSamePw] = useState(true)
    const handleSubmit = async () => {
        const nameValid = !!name
        const pwValid = !!password
        const confirmValid = !!confirmPassword
        const sameValid = password === confirmPassword

        setIsNamed(nameValid)
        setIsPw(pwValid)
        setIsConfirmPw(confirmValid)
        setSamePw(sameValid)

        if (nameValid && pwValid && confirmValid && sameValid) {
            try {
                await api.post("/auth/register", {
                    username: name,
                    password: password
                })
                toast.success("Account Created")
                setName("")
                setPassword("")
                setConfirmPassword("")
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 400) {
                        toast.error("Username already exists");
                    } else {
                        toast.error("Something went wrong. Please try again.")
                    }
                }
            }
        }
    }
    const nagivate = useNavigate()
    return (
        <div>
            <Button onClick={() => nagivate("/login")}>Back to login</Button>
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-sm border shadow-md">
                    <CardHeader className="text-center">
                        <CardTitle>Register</CardTitle>
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
                                        value={name}
                                        required
                                    />
                                    {isNamed ? "" : <p>Missing Name</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    {isPw ? "" : <p>Missing Password</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Confirm Password</Label>
                                    <Input id="password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    {isConfirmPw ? "" : <p>Missing field</p>}
                                    {(isConfirmPw && !samePw) ? <p>Confirm Password is not the same</p> : ""}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full" onClick={handleSubmit}>
                            Create Account
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
export default RegisterPage
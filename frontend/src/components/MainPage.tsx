import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"

const MainPage = () => {
    const navigate = useNavigate()
    return (
        <div>
            <Button onClick={() => navigate("/register")}>Register</Button>
            <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
    )
}

export default MainPage
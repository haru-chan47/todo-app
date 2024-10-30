import { useContext } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);
    const handleLogout = () => {
        setToken(null);
        navigate("/");
    };

    return (
        <nav className="nav">
            <Link to="/todolist" className="site-title">
                ₊✩‧₊˚౨ৎ˚₊✩‧₊ Haru&apos;s Notes ₊✩‧₊˚౨ৎ˚₊✩‧₊
            </Link>
            <ul>
                <CustomLink to="/todolist">Home</CustomLink>
                <CustomLink to="/calculator">Calculator</CustomLink>
                <CustomLink to="/" onClick={handleLogout} className="logout-btn">Logout</CustomLink>
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}
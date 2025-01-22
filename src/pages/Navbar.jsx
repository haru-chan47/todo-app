import { useContext, useEffect } from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { AuthContext } from "../contexts/AuthProvider";

export default function Navbar() {
    const auth = getAuth();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate("/");
        }).catch((error) => {
            console.error("Error signing out:", error);
        });
    }

    return (
        <nav className="nav">
            <Link to="/todolist" className="site-title">
                ₊✩‧₊˚౨ৎ˚₊✩‧₊ Paimon ₊✩‧₊˚౨ৎ˚₊✩‧₊
            </Link>
            <ul>
                <CustomLink to="/todolist">Home</CustomLink>
                <CustomLink to="/calculator">Calculator</CustomLink>
                <CustomLink to="/farming-routes">Farming Routes</CustomLink>
                <CustomLink to="/" onClick={handleLogout} className="logout-btn">Logout</CustomLink>
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}

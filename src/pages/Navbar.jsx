
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";


export default function Navbar() {
    const auth = getAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/");  // Navigate to the homepage after logout
        } catch (error) {
            console.error("Error signing out: ", error.message);
        }
    }

    return (
        <nav className="nav">
            <Link to="/todolist" className="site-title">
                ₊✩‧₊˚౨ৎ˚₊✩‧₊ Paimon ₊✩‧₊˚౨ৎ˚₊✩‧₊
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
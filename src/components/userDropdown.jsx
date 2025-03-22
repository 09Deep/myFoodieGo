import React, {useState, useRef, useEffect} from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping} from '@fortawesome/free-solid-svg-icons';
import '../styles/navbar.css';

const UserDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
      
    // Toggle dropdown
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    
    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);   

    return (  
        <div className="user-menu" ref={dropdownRef}>
            <FontAwesomeIcon
            style={{ cursor: "pointer" }}
            onClick={toggleDropdown}
            className="mx-4 my-3 user-icon"
            icon={faUser}
            />
            {dropdownOpen && (
            <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                <li>
                <Link to="/account" className="dropdown-item">
                    Account
                </Link>
                </li>
                <li>
                <Link to="/order-history" className="dropdown-item">
                    Order History
                </Link>
                </li>
                <li>
                <button className="dropdown-item" onClick={() => console.log("Logout logic here")}>
                    Logout
                </button>
                </li>
            </ul>
            )}
        </div>
    );
}
 
export default UserDropdown;

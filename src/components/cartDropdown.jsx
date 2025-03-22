import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "../styles/cartDropdown.css"; // Create this file for styling
import api from "../api";
import { useNavigate } from "react-router-dom";

const CartDropdown = ({ currentCustomerId }) => {
    const [activeCart, setActiveCart] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Toggle dropdown on cart icon click
    const toggleDropdown = () => {
        console.log("Cart icon clicked, isOpen:", isOpen);
        setIsOpen((isOpen) => !isOpen);
    };
    useEffect(() => {
        console.log("CartDropdown mounted, setting isOpen to false");
        setIsOpen(false); // Ensure it's closed on mount
    }, []);

    // Fetch active cart data when dropdown opens or currentCustomerId changes
    useEffect(() => {
        const fetchCart = async () => {
            try {
                console.log("Fetching active cart for:", currentCustomerId);
                const response = await api.get(`/customers/${currentCustomerId}/cart`);
                setActiveCart(response.data.activeCart);

                console.log("This is the cart fetched for CartDropDown ",response.data.activeCart);
            } catch (error) {
                console.error("Error fetching active cart:", error);
            }
        };
    
        if (currentCustomerId && isOpen) {
            fetchCart();
        }
    }, [currentCustomerId, isOpen]); 

    useEffect(() => {
        setIsOpen(false); // Explicitly close dropdown when component mounts
    }, []);

    // Close dropdown if clicking outside of it
    useEffect(() => {

        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        return () => setIsOpen(false);
    }, []);

    const navigate = useNavigate();

    const handleCheckout = (e) => {
        e.preventDefault(); 
        setIsOpen(false); // Close the cart dropdown first
        
        setTimeout(() => {
            navigate("/checkout");
        }, 100); // Small delay ensures state update before navigation
    };

    useEffect(() => {
        console.log("Dropdown isOpen changed:", isOpen);
    }, [isOpen]);

    return (
        
        <div className="acart-dropdown" ref={dropdownRef}>
            <div className="acart-icon" onClick={toggleDropdown} style={{ cursor: "pointer" }}>
            
                <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    className="mx-4 my-3"
                    icon={faCartShopping}
                />
            </div>
        {isOpen && (
            <div className="acart-dropdown-menu">
            {activeCart && activeCart.length > 0 ? (
                <>
                {activeCart.map((restaurant, restaurantIndex) => (
                    <div key={restaurant._id} className="restaurant-cart">
                        <h3>{restaurant.restaurantName}</h3> {/* Restaurant Name */}
                        
                        {restaurant.items.map((cartItem, itemIndex) => ( // Looping through items inside the restaurant
                            <div key={cartItem._id} className="acart-item">
                                <div className="acitem-details">
                                    <p className="acitem-name">{cartItem.itemName}</p>
                                    <div className="acitem-controls">
                                        
                                        <span className="acitem-quantity">{cartItem.quantity}</span>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                
                <button className="accheckout-button" onClick={handleCheckout} >
                    Continue to checkout
                </button>
                </>
            ) : (
                <p className="acempty-cart">Your cart is empty.</p>
            )}
            </div>
        )}
        
                
        </div>
    );
};

export default CartDropdown;



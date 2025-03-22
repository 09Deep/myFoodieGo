import React, { createContext, useState, useContext } from "react";

// Create Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider Component
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Function to add or update an item in the cart
    const addToCart = (restaurantId, restaurantName, itemId, itemName) => {
        setCart(prevCart => {
            const updatedCart = [...prevCart];
            const restaurantIndex = updatedCart.findIndex(r => r.restaurantId === restaurantId);

            if (restaurantIndex > -1) {
                // Restaurant exists
                const itemIndex = updatedCart[restaurantIndex].items.findIndex(i => i.itemId === itemId);
                if (itemIndex > -1) {
                    // Item exists, increase quantity
                    updatedCart[restaurantIndex].items[itemIndex].quantity += 1;
                } else {
                    // Add new item
                    updatedCart[restaurantIndex].items.push({ itemId, itemName, quantity: 1 });
                }
            } else {
                // Add new restaurant with the item
                updatedCart.push({ restaurantId, restaurantName, items: [{ itemId, itemName, quantity: 1 }] });
            }

            return updatedCart;
        });
    };

    // Function to increase quantity
    const handlePlus = (restaurantId, itemId) => {
        setCart(prevCart => prevCart.map(restaurant => 
            restaurant.restaurantId === restaurantId
                ? { ...restaurant, items: restaurant.items.map(item => 
                    item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
                  )
                }
                : restaurant
        ));
    };

    // Function to decrease quantity or remove item
    const handleMinus = (restaurantId, itemId) => {
        setCart(prevCart => prevCart.map(restaurant => 
            restaurant.restaurantId === restaurantId
                ? { 
                    ...restaurant, 
                    items: restaurant.items
                        .map(item => item.itemId === itemId 
                            ? { ...item, quantity: item.quantity - 1 } 
                            : item
                        )
                        .filter(item => item.quantity > 0) // Remove items with 0 quantity
                  }
                : restaurant
        ).filter(restaurant => restaurant.items.length > 0)); // Remove empty restaurants
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, handlePlus, handleMinus }}>
            {children}
        </CartContext.Provider>
    );
};


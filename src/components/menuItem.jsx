import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import api from "../api";


const MenuItem = ({ itemName, description, price, image, currentCustomerId, restaurantId, restaurantName, itemId }) => {
    const [isExpanded, setIsExpanded] = useState(false); // Track expanded state
    const [quantity, setQuantity] = useState(null); // Counter for quantity
    const timerRef = useRef(null); // Ref for the timeout

    // Fetch initial quantity from backend when the component mounts
    useEffect(() => {
        const fetchQuantity = async () => {
          try {

            const response = await api.get(`/customers/${currentCustomerId}/cart`);

            const activeCart = response.data.activeCart;
            
            // Find the quantity for this item
            const restaurantCart = activeCart.find(cart => cart.restaurantId === Number(restaurantId));

            const item = restaurantCart ? restaurantCart.items.find(i => i.itemId === itemId) : null;

    
            setQuantity(item ? item.quantity : 0); // If item exists, set quantity; otherwise, set 0
          } catch (error) {
            console.error("Error fetching cart data:", error);
          }
        };
    
        fetchQuantity();
      }, [currentCustomerId, restaurantId, itemId]);

    const handleExpand = () => {
        setIsExpanded(true);

        // Clear existing timer if any
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Set timer to collapse after 3 seconds
        timerRef.current = setTimeout(() => {
            setIsExpanded(false);
        }, 3000);
    };


    const handlePlus = async () => {

        try{
            
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            
            
            console.log("From FRONT-END calling API ");
            await api.post(`/customers/${currentCustomerId}/cart`,{
                restaurantId, restaurantName, itemId, itemName, newQuantity, price
            });
            
           
            handleExpand(); // Restart timer
        }
        catch (error) {
            console.error("Error adding item to cart:", error);
        }
        
    };


    const handleMinus = async () => {

        try {           
            const newQuantity = quantity - 1;
            
            // If quantity is 2 then newQuantity is 1 (>0) ---> reduce
            // If quantity is 1 then newQuantity is 0 (=0) ---> remove

            if (newQuantity > 0) {
                setQuantity(newQuantity);  // COUNTER REDUCED
       
                await api.patch(`/customers/${currentCustomerId}/cart/${restaurantId}/${itemId}/decrease`);
                   
            } else {
                setQuantity(0);
                await api.delete(`/customers/${currentCustomerId}/cart/${restaurantId}/${itemId}`);
            }
    
            handleExpand(); // Restart timer

        } catch (error) {
            console.error("Error removing item from cart:", error);
        }

    };

    return (
        <div
            className="d-flex align-items-center border rounded p-3 mb-4"
            style={{ width: '100%', maxWidth: '600px' }}
        >
            <div className="flex-grow-1">
                <h5 className="mb-2">{itemName}</h5>
                <p className="mb-2">{description}</p>
                <p className="mb-0">
                    <strong>{price}</strong>
                </p>
            </div>
            {image && (
                <div
                    className="image-container"
                    style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                >
                    <img
                        src={image}
                        alt={itemName}
                        className="ms-3 rounded"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    {isExpanded ? (
                        <div
                            className="expanded-controls"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                position: 'absolute',
                                bottom: '5px',
                                right: '5px',
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '5px 10px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faMinus}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    color: 'black',
                                }}
                                onClick={handleMinus}
                            />
                            <span
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    minWidth: '20px',
                                    textAlign: 'center',
                                }}
                            >
                                {quantity}
                            </span>
                            <FontAwesomeIcon
                                icon={faPlus}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    color: 'black',
                                }}
                                onClick={handlePlus}
                            />
                        </div>
                    ) : (
                        <span   
                            style={{
                                position: "absolute",
                                bottom: "5px",
                                right: "5px",
                                color: "black", 
                                fontSize: "16px",
                                backgroundColor: "white",
                                borderRadius: "16px",
                                cursor: "pointer",
                                padding: "3px 10px",
                                fontWeight: "bold",
                                textAlign: "center",
                                minWidth: "30px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                            }}
                            onClick={handleExpand}
                        >
                        {quantity > 0 ? quantity : <FontAwesomeIcon icon={faPlus} />}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default MenuItem;




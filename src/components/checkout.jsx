import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import api from '../api';
import "../styles/checkout.css";
import DeliveryToggle from './deliveryToggle';
import PaymentModal from './paymentModal';
import AddressModal from "./addressModal";

const Checkout = ({ currentCustomerId }) => {
    const [activeCart, setActiveCart] = useState([]);
    
    const [addresses, setAddresses] = useState([]); // Stores customer's addresses
    const [selectedAddress, setSelectedAddress] = useState(null); // Stores selected address (start with null or an empty object)
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentCards, setPaymentCards] = useState([]); // Stores fetched cards

    const [deliveryMethod, setDeliveryMethod] = useState("Standard");

    //'api/customers/:customerId/cards' - to fetch the payment method
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                console.log(" customer ID is ",currentCustomerId);
                const response = await api.get(`/customers/${currentCustomerId}/credit-cards`);

                console.log(" This is the response for fetch card ", response);
                const cards = response.data.paymentMethod || [];
                setPaymentCards(cards);
                setSelectedCard(cards.length > 0 ? cards[0] : null); // Default to first card
            } catch (error) {
                console.error("Error fetching payment methods:", error);
            }
        };

        if (currentCustomerId) {
            fetchPaymentMethods();
        }
    }, [currentCustomerId]);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                console.log("Fetching addresses and cart for:", currentCustomerId);
                const cartResponse = await api.get(`/customers/${currentCustomerId}/cart`);
                setActiveCart(cartResponse.data.activeCart);
                
                const addressResponse = await api.get(`/customers/${currentCustomerId}/addresses`);
                console.log("THIS IS THE CUSTOMER'S ADDRESS ", addressResponse);
                
                const addresses = addressResponse.data.addresses || [];
                setAddresses(addresses);
                
                setSelectedAddress(addresses[0] || null); // Set to null if no address found
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        };
    
        if (currentCustomerId) fetchCustomerData();
    }, [currentCustomerId]);

    const handleSaveAddress = (newAddress) => {
        setSelectedAddress(newAddress);
        setIsAddressModalOpen(false);
    };

    const paymentMethodDisplay = selectedCard
        ? `**** **** **** ${selectedCard.slice(-4)}`
        : "No card added yet!";


    // await api.post(`/customers/${currentCustomerId}/cart`,{
    //     restaurantId, restaurantName, itemId, itemName, newQuantity
    // });  -------------------------------------------------------------------TO ADD OR INCREASE QUANTITY
    const handlePlus = async (restaurantId, restaurantName, itemId, itemName, quantity) => {

        try{
            
            const newQuantity = quantity + 1;
            
            console.log(" Current Item ID In HANDLE PLUS is ",itemId);
            console.log(" Current Quantity In HANDLE PLUS is ",quantity);
            
            console.log("From FRONT-END calling API ");
            await api.post(`/customers/${currentCustomerId}/cart`,{
                restaurantId, restaurantName, itemId, itemName, newQuantity
            });
            
            const response = await api.get(`/customers/${currentCustomerId}/cart`);
            setActiveCart(response.data.activeCart); // Update state with new cart
           
            //handleExpand(); // Restart timer
        }
        catch (error) {
            console.error("Error adding item to cart:", error);
        }
        
    };

    const handleMinus = async (restaurantId, itemId, quantity) => {

        try {           
            const newQuantity = quantity - 1;
            
            // If quantity is 2 then newQuantity is 1 (>0) ---> reduce
            // If quantity is 1 then newQuantity is 0 (=0) ---> remove

            console.log("Original quantity received is ",quantity);
            console.log("New quantity is ",newQuantity)

            if (newQuantity > 0) {
                //setQuantity(newQuantity);  // COUNTER REDUCED
                
                console.log(`PATCH  api/customers/currentCustomerId/cart/restaurantId/itemId/decrease`);
                await api.patch(`/customers/${currentCustomerId}/cart/${restaurantId}/${itemId}/decrease`);
                
                   
            } else {
                //setQuantity(0);

                console.log(`DELETE  api/customers/currentCustomerId/cart/restaurantId/itemId`);
                await api.delete(`/customers/${currentCustomerId}/cart/${restaurantId}/${itemId}`);
            }
            
            const response = await api.get(`/customers/${currentCustomerId}/cart`);
            setActiveCart(response.data.activeCart); // Update state with new cart
            //handleExpand(); // Restart timer

        } catch (error) {
            console.error("Error removing item from cart:", error);
        }

    };

    const removeItem = async (restaurantId, itemId) => {
        try {
            await api.delete(`/customers/${currentCustomerId}/cart/${restaurantId}/${itemId}`);
            console.log("Item removed from cart");
    
            // Fetch updated cart after removal
            const response = await api.get(`/customers/${currentCustomerId}/cart`);
            setActiveCart(response.data.activeCart);
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };    

    // Fetch active cart data when dropdown opens or currentCustomerId changes
    useEffect(() => {
        const fetchCart = async () => {
        try {
            console.log("------------------CHECKOUT-----------------");
            console.log("PRINTING THE CUSTOMERID HERE ",currentCustomerId);
            console.log("TYPE OF THE CUSTOMERID IS ",typeof currentCustomerId);
            const response = await api.get(`/customers/${currentCustomerId}/cart`);
            console.log("THIS IS THE REPSONSE FOR CHECKOUT", response);
            console.log("PRINTING THE DATA",response.data.activeCart);
            setActiveCart(response.data.activeCart);
            //activeCart.map((restaurant, restaurantIndex) =>)
        } catch (error) {
            console.error("Error fetching active cart:", error);
        }
        };

        //if (currentCustomerId) {
            fetchCart();
        //}
    },[currentCustomerId]);

    const subtotal = activeCart.reduce(
        (total, restaurant) =>
            total +
            restaurant.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        0
    );

    const gst = subtotal * 0.05; // 5% GST
    const pst = subtotal * 0.07; // 7% PST
    const deliveryFee = deliveryMethod === "Priority" ? 8.0 : 5.0;
    const total = subtotal + gst + pst + deliveryFee;    

    return ( 
        <div className='checkout-container '>
            
            <div className="checkout-left">
                <h2>Delivery Details</h2>
                
                      
                <div className='address-row'>

                    <span className="address-lable" >   
                        <strong>Address:</strong> {selectedAddress?.addressLine1}, {selectedAddress?.city}, {selectedAddress?.province}
                    </span>
                
                    <span className="address-value">
                        <button className="ms-3 w-20 h-9 bg-[#28a745] text-white rounded-full cursor-pointer"
                                 onClick={() => setIsAddressModalOpen(true)}
                        >
                            Edit 
                        </button>
                    </span>                   
                    
                </div>                
                

                <div className='p-6'>
                    <DeliveryToggle  onDeliveryChange={setDeliveryMethod}/>
                </div>

                <div className='address-row'>

                    <span className="address-lable" >   
                        <strong>Payment Method:</strong> {paymentMethodDisplay} 
                    </span>

                    <span className="address-value">
                        <button className="ms-3 w-20 h-9 bg-[#28a745] text-white rounded-full cursor-pointer"
                                 onClick={() => setIsModalOpen(true)}
                        >
                        Edit 
                        </button>
                    </span>                   

                </div>
                {isModalOpen && (
                    <PaymentModal
                        paymentCards={paymentCards}
                        currentCustomerId={currentCustomerId}
                        selectedCard={selectedCard}
                        setSelectedCard={setSelectedCard}
                        setPaymentCards={setPaymentCards}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}    

                {isAddressModalOpen && (
                     
                    <AddressModal
                        addressList={addresses || []}
                        currentCustomerId={currentCustomerId}
                        selectedAddress={selectedAddress || {}}
                        setSelectedAddress={setSelectedAddress}
                        setAddressList={setAddresses}
                        onClose={() => setIsAddressModalOpen(false)}
                    />

                )}
            
            </div>

            <div className="checkout-right">
                <h2>Order Summary</h2>

                {activeCart.map((restaurant, restaurantIndex) => (

                    <div key={restaurant.restaurantId} className="checkout-restaurant">
                        <h3>{restaurant.restaurantName}</h3>

                        {restaurant.items.map((item, itemIndex) => (

                            <div key={item.itemId} className="checkout-item">

                                <span>{item.itemName} (${item.price} /ea) </span>
                                <div className="checkout-controls">

                                    <span className='me-4'>x{item.quantity}</span>
                                    <span className='mx-2'>{item.quantity*item.price}</span>
                                    <button className='mx-2' onClick={() => handleMinus(restaurant.restaurantId, item.itemId, item.quantity)}>-</button>                                    
                                    <button className='mx-2'  onClick={() => handlePlus(restaurant.restaurantId, restaurant.restaurantName, item.itemId, item.itemName, item.quantity)}>+</button>
                                    <FontAwesomeIcon
                                        style={{ cursor: "pointer" }}
                                        className='ms-2 me-4'
                                        icon={faTrash}
                                        onClick={() => removeItem(restaurant.restaurantId,item.itemId)}
                                    />

                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="checkout-totals">
                    <div className="totals-row">
                        <span className="totals-label">subTotal:</span>
                        <span className="totals-value">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="totals-row">
                        <span className="totals-label">GST:</span>
                        <span className="totals-value">${gst.toFixed(2)}</span>
                    </div>
                    <div className="totals-row">
                        <span className="totals-label">PST:</span>
                        <span className="totals-value">${pst.toFixed(2)}</span>
                    </div>
                    <div className="totals-row">
                        <span className="totals-label">Delivery Fee:</span>
                        <span className="totals-value">${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="totals-row total-bold">
                        <span className="totals-label">Total:</span>
                        <span className="totals-value">${total.toFixed(2)}</span>
                    </div>



                </div>                
                    <div className='checkout-right-order'>

                        <button className="order-btn" >
                            Order Now
                        </button>
                    </div>

            </div>
            
        </div>     
    );
}
 
export default Checkout;



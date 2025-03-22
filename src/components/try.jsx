import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import api from "../api";
import "../styles/checkout.css";
import DeliveryToggle from "./deliveryToggle";
import PaymentModal from "./paymentModal";
import AddressModal from "./addressModal"; // Import AddressModal

const Checkout = ({ currentCustomerId }) => {
    const [activeCart, setActiveCart] = useState([]);

    const [addresses, setAddresses] = useState([]); // Stores customer's addresses

    const [selectedAddress, setSelectedAddress] = useState(null); // Stores selected address (start with null or an empty object)

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentCards, setPaymentCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);


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

    return (
        <div className="checkout-container">
            <div className="checkout-left">
                <h2>Delivery Details</h2>

                <div className="address-row">
                    <span className="address-label">
                        
                        <strong>Address:</strong> {selectedAddress?.addressLine1}, {selectedAddress?.city}, {selectedAddress?.province}

                    </span>
                    <span className="address-value">
                        <button
                            className="ms-3 w-20 h-9 bg-[#28a745] text-white rounded-full cursor-pointer"
                            onClick={() => setIsAddressModalOpen(true)}
                        >
                            Edit
                        </button>
                    </span>
                </div>

                <div className="p-6">
                    <DeliveryToggle />
                </div>

                <div className="address-row">
                    <span className="address-label">
                        <strong>Payment Method:</strong> {paymentMethodDisplay}
                    </span>
                    <span className="address-value">
                        <button
                            className="ms-3 w-20 h-9 bg-[#28a745] text-white rounded-full cursor-pointer"
                            onClick={() => setIsPaymentModalOpen(true)}
                        >
                            Edit
                        </button>
                    </span>
                </div>

                {isPaymentModalOpen && (
                    <PaymentModal
                        paymentCards={paymentCards}
                        currentCustomerId={currentCustomerId}
                        selectedCard={selectedCard}
                        setSelectedCard={setSelectedCard}
                        setPaymentCards={setPaymentCards}
                        onClose={() => setIsPaymentModalOpen(false)}
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

                {activeCart.map((restaurant) => (
                    <div key={restaurant.restaurantId} className="checkout-restaurant">
                        <h3>{restaurant.restaurantName}</h3>
                        {restaurant.items.map((item) => (
                            <div key={item.itemId} className="checkout-item">
                                <span>
                                    {item.itemName} (${item.price} /ea)
                                </span>
                                <div className="checkout-controls">
                                    <span className="me-4">x{item.quantity}</span>
                                    <span className="mx-2">${item.quantity * item.price}</span>
                                    <FontAwesomeIcon
                                        style={{ cursor: "pointer" }}
                                        className="ms-2 me-4"
                                        icon={faTrash}
                                        onClick={() => console.log("Remove item")}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="checkout-totals">
                    <div className="totals-row">
                        <span className="totals-label">Subtotal:</span>
                        <span className="totals-value">$0.00</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Checkout;
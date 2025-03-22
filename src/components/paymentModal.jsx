import React, { useState } from "react";
import api from "../api";
import "../styles/paymentModal.css";

const PaymentModal = ({ paymentCards, currentCustomerId, selectedCard, setSelectedCard, setPaymentCards, onClose }) => {
    const [newCardNumber, setNewCardNumber] = useState("");


    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCard, setNewCard] = useState({
        cardHolder: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const handleSave = async () => {
        console.log("Selected card saved:", selectedCard);
        onClose();
    };

    // api/customers/:customerId/credit-cards
    const handleAddCard = async () => {
        const trimmedCardNumber = newCard.cardNumber.trim(); // Remove spaces
    
        if (trimmedCardNumber.length === 16 && /^\d+$/.test(trimmedCardNumber)) {
            try {
                console.log("Sending Request to POST Card Info.");
                await api.post(`/customers/${currentCustomerId}/credit-cards`, newCard); // Send full card details
                setPaymentCards([...paymentCards, trimmedCardNumber]); // Only store card number in UI
                setNewCard({ cardHolder: "", cardNumber: "", expiryDate: "", cvv: "" }); // Clear form
                setIsAddingCard(false); // Go back to "Choose Payment" screen
            } catch (error) {
                console.error("Error adding card:", error);
            }
        } else {
            alert("Enter a valid 16-digit card number.");
        }
    };
    
    
    return (
        <div className="modal-overlay">
            <div className="modal-big">
                
                <div className="modal-header">
                    <button className="close-btn" onClick={onClose}>✖</button>
                </div>

                <h2>{isAddingCard ? "Add Payment Method" : "Select Payment Method"}</h2>
                <div className="modal-content">

                    {isAddingCard ? (
                        <>
                            <label className="payment-input-label">Cardholder's Name</label>
                            <input
                                type="text"
                                placeholder="Cardholder Name"
                                className="payment-input-field"
                                value={newCard.cardHolder}
                                onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                            />

                            <label className="payment-input-label">Card Number</label>
                            <input
                                type="text"
                                placeholder="Card Number"
                                className="payment-input-field"
                                maxLength="16"
                                value={newCard.cardNumber}
                                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                            />
                            <div className="card-details">
                                <div className="payment-input-group">

                                    <label className="payment-input-label">Expiry Date</label>
                                    <input
                                        type="text"
                                        className="payment-input-field"
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        value={newCard.expiryDate}
                                        onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                                    />
                                </div>

                                <div className="payment-input-group">
                                    <label className="payment-input-label">CVV</label>
                                    <input
                                        type="text"
                                        className="payment-input-field"
                                        placeholder="CVV"
                                        maxLength="3"
                                        value={newCard.cvv}
                                        onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        paymentCards.length === 0 ? (
                            <p>No cards added yet.</p>
                        ) : (
                            paymentCards.map((card, index) => (
                                <label key={index} className="card-option">
                                    <input
                                        type="radio"
                                        name="selectedCard"
                                        checked={selectedCard === card}
                                        onChange={() => setSelectedCard(card)}
                                    />
                                    **** **** **** {card.slice(-4)}
                                </label>
                            ))
                        )
                    )}

                </div>

                <div className="modal-footer">
                    
                    {isAddingCard ? (
                        <>
                            <button className="back-btn" onClick={() => setIsAddingCard(false)}>
                                Back
                            </button>
                            <button className="save-btn" onClick={handleAddCard}>
                                Add
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsAddingCard(true)} className="add-card-btn">
                                + Add More Card
                            </button>
                            <button className="save-btn" onClick={handleSave}>
                                Save
                            </button>
                        </>
                    )}
                </div>   
                
            </div>
        </div>
    );
};

export default PaymentModal;



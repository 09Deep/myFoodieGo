import React, { useState } from "react";
import api from "../api";
import "../styles/addressModal.css";

const AddressModal = ({ 
    addressList = [], 
    currentCustomerId, 
    selectedAddress, 
    setSelectedAddress, 
    setAddressList, 
    onClose 
}) => {
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        province: "",
        country: "",
        postalCode: "",
    });

    // Save selected address and close modal
    const handleSave = () => {
        console.log("Selected address saved:", selectedAddress);
        onClose();
    };

    // Add a new address
    const handleAddAddress = async () => {
        try {
            console.log("Sending Request to POST Address Info.");
            await api.post(`/customers/${currentCustomerId}/addresses`, newAddress);
            setAddressList([...addressList, newAddress]); // Update the address list
            setNewAddress({ addressLine1: "", addressLine2: "", city: "", province: "", country: "", postalCode: "" }); // Clear form
            setIsAddingAddress(false); // Switch back to the choose address screen
        } catch (error) {
            console.error("Error adding address:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-big">

                <div className="modal-header">
                    <button className="close-btn" onClick={onClose}>✖</button>
                </div>

                <h2>{isAddingAddress ? "Add New Address" : "Select Address"}</h2>
                
                <div className="modal-content">
                    {isAddingAddress ? (
                        <>
                            <label className="address-input-label">Address Line 1</label>
                            <input
                                type="text"
                                placeholder="Street Address"
                                className="address-input-field"
                                value={newAddress.addressLine1}
                                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                            />

                            <label className="address-input-label">Address Line 2</label>
                            <input
                                type="text"
                                placeholder="Apartment, Suite, etc. (Optional)"
                                className="address-input-field"
                                value={newAddress.addressLine2}
                                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                            />

                            <label className="address-input-label">City</label>
                            <input
                                type="text"
                                placeholder="City"
                                className="address-input-field"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            />

                            <label className="address-input-label">Province</label>
                            <input
                                type="text"
                                placeholder="Province"
                                className="address-input-field"
                                value={newAddress.province}
                                onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                            />

                            <label className="address-input-label">Country</label>
                            <input
                                type="text"
                                placeholder="Country"
                                className="address-input-field"
                                value={newAddress.country}
                                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                            />

                            <label className="address-input-label">Postal Code</label>
                            <input
                                type="text"
                                placeholder="Postal Code"
                                className="address-input-field"
                                value={newAddress.postalCode}
                                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                            />
                        </>
                    ) : (
                        (Array.isArray(addressList) && addressList.length === 0) ? (
                            <p>No addresses added yet.</p>
                        ) : (
                            addressList.map((address, index) => (
                                <label key={index} className="address-option">
                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        checked={selectedAddress?._id === address?._id}
                                        onChange={() => setSelectedAddress(address)}
                                    />
                                    {`${address.addressLine1}, ${address.city}, ${address.province}`}
                                </label>
                            ))
                        )
                    )}
                </div>

                <div className="modal-footer">
                    {isAddingAddress ? (
                        <>
                            <button className="back-btn" onClick={() => setIsAddingAddress(false)}>Back</button>
                            <button className="save-btn" onClick={handleAddAddress}>Add</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsAddingAddress(true)} className="add-address-btn">
                                + Add New Address
                            </button>
                            <button className="save-btn" onClick={handleSave}>Save</button>
                        </>
                    )}
                </div>   

            </div>
        </div>
    );
};

export default AddressModal;

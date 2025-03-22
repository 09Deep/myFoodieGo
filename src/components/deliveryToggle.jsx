import { useState } from "react";

const DeliveryToggle = ({ onDeliveryChange }) => {
    const options = ["Priority", "Standard", "Schedule"];
    const [selectedIndex, setSelectedIndex] = useState(1); // Default: Standard

    const handleSwitch = (index) => {
        setSelectedIndex(index);
        onDeliveryChange(options[index]);
    };

    // Messages for each delivery option
    const messages = [
        <span>   <strong>Priority delivery : </strong>  Your order will be delivered in 10 - 15 minutes with <strong>+ 3.00$ additional fees</strong>. </span> ,
        <span>   <strong>Standard delivery : </strong> Your order will be delivered within 15 - 25 minutes. </span>,
        <span>   <strong>Schedule delivery : </strong> Choose a specific time for your order to be delivered. </span>
        
    ];

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-semibold">Choose Delivery Option</h2>

            {/* Toggle Container */}
            <div className="relative w-72 h-12 bg-gray-300 rounded-full flex items-center p-1 shadow-md cursor-pointer">
                
                {/* Sliding Capsule (Button) */}
                <div
                    className="absolute top-1 bottom-1 w-1/3 bg-[#28a745] rounded-full transition-all duration-300"
                    style={{ left: `${selectedIndex * 33.33}%` }}
                ></div>

                {/* Clickable Options */}
                {options.map((option, index) => (
                    <div
                        key={index}
                        className="relative z-10 text-center font-semibold transition-all px-4 min-w-[80px]"
                        onClick={() => handleSwitch(index)}
                    >
                        <span className={`transition-colors duration-300 ${selectedIndex === index ? "text-white" : "text-gray-700"}`}>
                            {option}
                        </span>
                    </div>
                ))}
            </div>

            {/* Time Picker for Schedule Option */}
            {selectedIndex === 2 && (
                <input
                    type="time"
                    className="border border-gray-400 p-2 rounded-lg mt-2"
                />
            )}

            {/* Message Box */}
            <div className="w-72 mt-4 p-4 border border-gray-400 rounded-lg bg-gray-50 text-gray-700">
                <p>{messages[selectedIndex]}</p>
            </div>
        </div>
    );
};

export default DeliveryToggle;

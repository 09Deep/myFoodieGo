import React, { useEffect, useState } from "react";
import api from "../api";
import MenuItem from "./menuItem";
import { useParams } from "react-router-dom";

const Menu = ({ currentCustomerId }) => {
  const { id } = useParams(); // Restaurant ID from the URL
  const [menu, setMenu] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");

  // GET /api/menu/:restaurantId  
  // Fetch menu and restaurant name on component load
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        console.log('Type of RestID in menu.jsx',typeof id);

        const menuResponse = await api.get(`/menu/${id}`);
        setMenu(menuResponse.data.menu);
        console.log("Inside the menu printing menu",menuResponse);


        const restaurantResponse = await api.get(`/restaurants/${id}`);
        console.log("This is the rest Response", restaurantResponse);
        setRestaurantName(restaurantResponse.data.name);
        console.log("Inside the menu printing restaurantName",restaurantResponse.data.name);
      } catch (error) {
        console.error("Error fetching menu or restaurant:", error);
      }
    };

    fetchMenu();
  }, [id]);

  return (
    <div className="d-flex flex-column align-items-center mt-5 pt-5">
      {menu.map((item) => (
        <MenuItem
          key={item.id}
          itemName={item.name}
          description={item.description}
          price={item.price}
          image={item.image}
          currentCustomerId={currentCustomerId}
          restaurantId={id}
          restaurantName={restaurantName}
          itemId={item.id}
        />
      ))}
    </div>
  );
};

export default Menu;

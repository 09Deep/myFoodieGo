
import React, { Component } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/restaurant.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as filledHeart } from "@fortawesome/free-solid-svg-icons";

class Restaurant extends Component {
  state = {
    restaurants: [],
    likedRestaurants: [], // From customerData
  };

  async componentDidMount() {
    const { currentCustomerId } = this.props;

    try {
      // Fetch restaurants
      const restaurantResponse = await api.get("/restaurants");
      console.log("This is Restaurantlist - in restaurant.jsx",restaurantResponse.data);

      this.setState({ restaurants: restaurantResponse.data });

      this.state.restaurants.map(restaurant => 
        console.log(typeof(restaurant.id)));
      // console.log("Restaurant IDs:", restaurantIds);
      // console.log("Type of restID all --",typeof(restaurantIds));

      // Fetch liked restaurants for the current customer
      console.log("Frontend fetching liked restaurants for customer", currentCustomerId);
      console.log("GET ",`api/customers/${currentCustomerId}/liked-restaurants`);

      const customerResponse = await api.get(`/customers/${currentCustomerId}/liked-restaurants`);

      console.log("This is the list of liked restaurants....", customerResponse.data.likedRestaurants);
      this.setState({ likedRestaurants: customerResponse.data.likedRestaurants.map(Number) });
      console.log("Printing state - likedRestaurants", this.state.likedRestaurants);
      

    } catch (error) {
      console.error("Error fetching restaurants or liked data:", error);
    }
  }

  handleLikeToggle = async (restaurantId) => {
    const { currentCustomerId } = this.props;
    const { likedRestaurants } = this.state;

    
    const isLiked = likedRestaurants.includes(restaurantId);

    console.log("Type of the restaurantID is", typeof(restaurantId));
    try {
      if (isLiked) {
        // Unlike the restaurant
        console.log("Custometr wants to dislike this restaurant",restaurantId  );
        console.log("DELETE",`/customers/${currentCustomerId}/liked-restaurants/${restaurantId}`);
        await api.delete(`/customers/${currentCustomerId}/liked-restaurants/${restaurantId}`);
      } else {
        // Like the restaurant
        console.log("Custometr wants to like this restaurant",restaurantId  );
        console.log("POST ",`/customers/${currentCustomerId}/liked-restaurants`);
        await api.post(`/customers/${currentCustomerId}/liked-restaurants`, { restaurantId });
      }

      // Update liked restaurants in state
      this.setState((prevState) => ({
        likedRestaurants: isLiked
          ? prevState.likedRestaurants.filter((id) => id !== restaurantId)
          : [...prevState.likedRestaurants, restaurantId],
      }));
    } catch (error) {
      console.error("Error toggling like for restaurant:", error);
    }
  };

  render() {
    const { restaurants, likedRestaurants } = this.state;

    // console.log("Checking if likedRestaurants includes restaurant.id:");
    // console.log("likedRestaurants:", likedRestaurants);
    // console.log("restaurant.id:", restaurants.id, "Type:", typeof restaurants.id);

    return (
      <div className="container">
        <div className="row mt-4 pt-4">
          {restaurants.map((restaurant) => (
            <div className="col-md-4 mt-4 pt-4" key={restaurant.id}>
              <Link to={`/menu/${restaurant.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card h-100 position-relative" style={{ cursor: "pointer" }}>
                  <img src={restaurant.image} alt={`${restaurant.name} food`} className="card-img-top" />
                  <FontAwesomeIcon
                    icon={likedRestaurants.includes(restaurant.id) ? filledHeart : emptyHeart}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      color: "black",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "5px",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation when clicking the heart icon
                      this.handleLikeToggle(restaurant.id);
                    }}
                  />
                  
                  <div className="card-body">
                    <h5 className="card-title">{restaurant.name}</h5>
                    <p className="card-text">
                      <strong>Avg Order Time:</strong> {restaurant.deliveryTime}
                    </p>
                    <p className="card-text">
                      <strong>Delivery Fee:</strong> {restaurant.deliveryFee}
                    </p>
                    <p className="card-text">
                      <strong>Rating:</strong> {restaurant.rating} ⭐
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Restaurant;

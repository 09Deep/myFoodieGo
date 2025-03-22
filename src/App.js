
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/authForm";
import Menu from "./components/menu";
import Layout from "./components/layout";
import Restaurant from "./components/restaurant";
import { getRestaurants } from "./data/restaurants";
import Checkout from "./components/checkout";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null); // Dynamic customer ID
  const [restaurants] = useState(getRestaurants()); // Restaurants data

  // Simulate login and set customer ID
  const handleLogin = (customerId) => {
    setIsAuthenticated(true);
    setCurrentCustomerId(customerId);
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AuthForm onLogin={handleLogin} />} />

        {/* Protected Routes with Navbar */}
        <Route element={<Layout currentCustomerId={currentCustomerId} isAuthenticated={isAuthenticated} />}>
            <Route
                path="/restaurants"
                element={
                    <Restaurant
                      currentCustomerId={currentCustomerId}
                      restaurants={restaurants}
                    />
                }
            />

            <Route 
                path="/menu/:id" 
                element={
                    <Menu 
                        currentCustomerId={currentCustomerId}
                    />
                } 
            />

            <Route
                path="/checkout"
                element={
                  <Checkout
                      currentCustomerId={currentCustomerId}
                  />
                }
            />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;



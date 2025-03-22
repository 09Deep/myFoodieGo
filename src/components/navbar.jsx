import React, {useState, useRef, useEffect} from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping} from '@fortawesome/free-solid-svg-icons';
import '../styles/navbar.css';
import UserDropdown from './userDropdown';
import CartDropdown from './cartDropdown';
import DeliverySwitch from './deliveryToggle';

const Navbar = ({currentCustomerId}) => {
  console.log("Current Customer ID in Navbar:", currentCustomerId);
    return (
      <nav className="navbar bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand">MyFoodieGo</a>
          <form className="d-flex" role="search">
            <input
              className="form-control m-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success m-2" type="submit">
              Search
            </button>

            <UserDropdown/>
  
            <CartDropdown currentCustomerId={currentCustomerId}/>


          </form>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
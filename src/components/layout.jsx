import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from './navbar'

const Layout = ({ isAuthenticated, currentCustomerId }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  return (
    <>
      <Navbar currentCustomerId={currentCustomerId}/>
      <main>
        <Outlet /> {/* Render nested routes here */}
      </main>
    </>
  );
};

export default Layout;


////////////////////////////////////////////////////////////////////////////////////////////////// AFATER THE BACKEND UPGRADE.............


// import React, { Component } from "react";
// import Navbar from "./navbar";
// import { AuthProvider } from "../contexts/authContext";
// import api from "../api";

// class Layout extends Component {
//   state = {
//     currentCustomerId: null, // Stores current customer's ID
//     isAuthenticated: false,  // Holds authentication status
//   };

//   async componentDidMount() {
//     try {
//       // Assume we fetch user data (or check if authenticated) from an API endpoint.
//       const response = await api.get("/auth/check");

//       if (response.status === 200) {
//         this.setState({
//           currentCustomerId: response.data.customerId,
//           isAuthenticated: true,
//         });
//       } else {
//         this.setState({ isAuthenticated: false });
//       }
//     } catch (error) {
//       console.error("Error checking authentication:", error);
//       this.setState({ isAuthenticated: false });
//     }
//   }

//   render() {
//     const { currentCustomerId, isAuthenticated } = this.state;

//     return (
//       <AuthProvider>
//         <div>
//           <Navbar currentCustomerId={currentCustomerId} />
//           <div className="container">
//             {this.props.children}
//           </div>
//         </div>
//       </AuthProvider>
//     );
//   }
// }

// export default Layout;


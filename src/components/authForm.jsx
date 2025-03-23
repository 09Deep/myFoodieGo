
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/authForm.css";


const AuthForm = ({ onLogin }) => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError(""); // Reset errors before making a request

		try {
			const response = await fetch("https://serverfoodiego.onrender.com/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			console.log("Response from server:", response); // Log the full response

			// ✅ Check if response body is used
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}


			const data = await response.json(); // ✅ Try parsing JSON

			console.log("Parsed data:", data); // Log parsed response
			console.log("Data.customerID is ...",data.customerID);

			onLogin(data.customerID); // Store user data (customer ID, email, etc.)
			localStorage.setItem("user", JSON.stringify(data.user)); // Store in local storage
			navigate("/restaurants"); // Redirect to RestaurantsPage
		} 
		
		catch (err) {
			console.error("Fetch error:", err); // Log the error
			setError("Error connecting to server");
		}
	};

	return (
		<div className="f-container">
			<div className="form-container">
				<div className="form-toggle">

					<button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
						Login
					</button>
					<button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
						Sign Up
					</button>

				</div>

				{isLogin ? (
				// Login Form Section
					<form className="form" onSubmit={handleLogin}>
						<h1>Login Form</h1>

						<input
							type="email"
							placeholder="Email ID"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						{error && <p className="error">{error}</p>}
						<a href="#">Forgot Password?</a>
						<button type="submit">Login</button>
						<p>
						Not a member?{" "}
						<a href="#" onClick={() => setIsLogin(false)}>
							Sign Up Now
						</a>
						</p>
					</form>
				) : (
				//Sign-Up Form Section
					<div className="form">
						<h1>Sign Up Form</h1>
						<input type="email" placeholder="Email ID" />
						<input type="password" placeholder="Password" />
						<input type="password" placeholder="Confirm password" />
						<button>Sign Up</button>
					</div>
				)}

			</div>		

		</div>
	);
};

export default AuthForm;

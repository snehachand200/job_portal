
// import { useState } from "react";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const response = await fetch("/login/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email,
//           password: password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("username", data.username);
//         localStorage.setItem("user_id", data.user_id);

//         setMessage("Login successful! Welcome, " + data.username);
//       } else {
//         setMessage(
//           data.error || "Login failed. Please check your details."
//         );
//       }
//     } catch (error) {
//       setMessage("Unable to connect to the server. Please check Django.");
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Login to Job Portal</h2>

//       <form onSubmit={handleLogin}>
//         <label>Email</label>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <label>Password</label>
//         <input
//           type="password"
//           placeholder="Enter your password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit">Login</button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default Login;






import { useState } from "react";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("user_id", data.user_id);

        // Redirect to JobList page after successful login
        onLoginSuccess();
      } else {
        setMessage(
          data.error || "Login failed. Please check your details."
        );
      }
    } catch (error) {
      setMessage("Unable to connect to the server. Please check Django.");
    }
  };

  return (
    <div className="form-container">
      <h2>Login to Job Portal</h2>

      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;

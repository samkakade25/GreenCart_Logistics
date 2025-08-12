import { Box, Button, Heading, Text, TextInput } from "grommet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box direction="row" height="100vh">
      {/* Left side form */}
      <Box flex align="center" justify="center" background="light-1" pad="large">
        <Box width="medium" gap="medium">
          <Heading level={2} textAlign="center">Login</Heading>
          <TextInput
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button label="Login" primary onClick={handleLogin} />
        </Box>
      </Box>

      {/* Right side info */}
      <Box flex align="center" justify="center" background="brand" pad="large">
        <Heading color="white">Welcome Back!</Heading>
        <Text color="light-1" size="large">
          Access your logistics dashboard and manage operations efficiently.
        </Text>
      </Box>
    </Box>
  );
}

import { Box, Button, Heading, Text, TextInput } from "grommet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        alert("Registered successfully! Please login.");
        navigate("/login");
      } else {
        alert("Registration failed");
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
          <Heading level={2} textAlign="center">Register</Heading>
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
          <Button label="Register" primary onClick={handleRegister} />
        </Box>
      </Box>

      {/* Right side info */}
      <Box flex align="center" justify="center" background="brand" pad="large">
        <Heading color="white">Join GreenCart</Heading>
        <Text color="light-1" size="large">
          Create an account to run simulations and track performance.
        </Text>
      </Box>
    </Box>
  );
}

import React from "react";
import Header from "./components/Header";
import {HashRouter as Router,Routes,Route} from 'react-router-dom'
import HomeScreen from "./components/screens/HomeScreen";
import SignupScreen from "./components/screens/SignupScreen";
import LoginScreen from "./components/screens/LoginScreen";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen/>}></Route>
        <Route path="/login" element={<LoginScreen/>}></Route>
        <Route path="/signup" element={<SignupScreen/>}></Route>
      </Routes>
    </Router>
  );
}

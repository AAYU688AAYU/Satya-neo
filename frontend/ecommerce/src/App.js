import React from "react";
import Header from "./components/layout/Header";
import {HashRouter as Router,Routes,Route} from 'react-router-dom'
import HomeScreen from "./components/screens/HomeScreen";
import SignupScreen from "./components/screens/SignupScreen";
import LoginScreen from "./components/screens/LoginScreen";
import DashboardScreen from "./components/screens/DashboardScreen";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen/>}></Route>
        <Route path="/login" element={<LoginScreen/>}></Route>
        <Route path="/signup" element={<SignupScreen/>}></Route>
        <Route path="/dashboard" element={<DashboardScreen/>}></Route>
      </Routes>
    </Router>
  );
}

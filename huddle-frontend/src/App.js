import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AddItem from './pages/AddItem';
import MyItems from './pages/MyItems';
import UserProfile from './pages/UserProfile';
import ItemDetail from './pages/ItemDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add-item" element={<AddItem />} />
              <Route path="/my-items" element={<MyItems />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/item/:id" element={<ItemDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
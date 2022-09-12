import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import NewProduct from './NewProduct';
import SellerInventory from './SellerInventory';
import Signup from './Signup';
import Store from './Store';

const App = () => {
  let user_token = sessionStorage.getItem('user_token');

  const handleLogout = () => {
    sessionStorage.removeItem('user_token');
    window.location.reload();
  };

  React.useEffect(() => {
    user_token = sessionStorage.getItem('user_token');
  }, []);

  return (
    <div>
      {user_token && (
        <div>
          <button type="button" onClick={() => handleLogout()}>
            logout
          </button>
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="store" element={<Store />} />
          <Route path="dashboard" element={<SellerInventory />} />
          <Route path="create-product" element={<NewProduct />} />
          <Route path="edit-product/:id" element={<NewProduct />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

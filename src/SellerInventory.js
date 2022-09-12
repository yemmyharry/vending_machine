import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

const SellerInventory = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const url = process.env.REACT_APP_BASEAPI_URL;

  const user_token = sessionStorage.getItem('user_token');
  const getProducts = async () => {
    try {
      const response = await axios.get(`${url}/auth/get_products`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user_token}`,
        },
      });
      console.log(response);
      setItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${url}/auth/delete_product/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user_token}`,
        },
      });
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let role_id = null;
    if (user_token) {
      role_id = decodeToken(user_token).role_id;
    }
    if (!user_token) {
      navigate('/login');
    }

    if (role_id === 1) {
      navigate('/store');
    }
    getProducts();
  }, []);

  return (
    <div className="px-8 pt-12">
      <div className="flex justify-between">
        <h3>Inventory</h3>
        <Link to="/create-product">
          <button
            className="rounded-sm bg-blue-600 p-2 text-white"
            type="button"
          >
            Add new Product
          </button>
        </Link>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.product_id} className="my-4 flex justify-between">
            <div>
              <p className="text-lg">{item.product_name}</p>
              <div className="flex gap-2 text-xs">
                <p>cost: ${item.cost}</p>
                <p>units left: {item.amount_available}</p>
              </div>
            </div>
            <div>
              <Link to={`/edit-product/${item.product_id}`}>
                <button
                  type="button"
                  className="w-[100px] bg-blue-600 py-2 text-white"
                >
                  edit
                </button>
              </Link>
              <button
                type="button"
                className="ml-2 w-[100px] bg-red-600 py-2 text-white"
                onClick={() => handleDelete(item.product_id)}
              >
                delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerInventory;

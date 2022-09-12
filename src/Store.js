import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { decodeToken } from 'react-jwt';
import { useNavigate } from 'react-router-dom';

const Store = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [buy, setBuy] = useState({
    product: {
      id: null,
      name: null,
      costt: null,
      amount: null,
    },
    buying: false,
  });
  const [count, setCount] = useState(1);
  const [depositAmount, setDepositAmount] = useState(50);

  const url = process.env.REACT_APP_BASEAPI_URL;

  const getProducts = async () => {
    const user_token = sessionStorage.getItem('user_token');
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

  const handleCount = (type) => {
    console.log('hey');
    if (type === 'minus' && count > 1) {
      console.log('decrement');
      setCount(count - 1);
    } else if (type === 'plus' && count < buy.product.amount) {
      console.log('decrement');
      setCount(count + 1);
    }
  };

  const user_token = sessionStorage.getItem('user_token');
  const handlePurchase = async () => {
    try {
      const response = await axios.post(
        `${url}/auth/buy_product`,
        {
          product_id: buy.product.id,
          quantity: count,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user_token}`,
          },
        }
      );

      if (response.status === 400) {
        alert('Not enough money please deposit');
      }
      if (response.status === 200) {
        alert(`
        Purchase successfull\nTotal purchase: ${response.data.total_price}\nQuantity: ${response.data.quantity}\nBalance: ${response.data.change}`);
        setCount(1);
        setBuy((prevState) => ({
          ...prevState,
          buying: false,
        }));
      }
      console.log(response.status);
    } catch (error) {
      console.log('er', error.response.data.error);
      alert(error.response.data.error);
    }
  };

  const handleCurrentProduct = (id) => {
    const itemHolder = items.filter((item) => item.product_id === id);
    setBuy((prevState) => ({
      ...prevState,
      product: {
        id,
        name: itemHolder[0].product_name,
        cost: itemHolder[0].cost,
        amount: itemHolder[0].amount_available,
      },
    }));
  };

  const handleDeposit = async () => {
    try {
      const response = await axios.patch(
        `${url}/auth/deposit_money`,
        {
          amount: depositAmount,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user_token}`,
          },
        }
      );
      if (response.status === 200) {
        alert('Deposit successfull');
        setShowDeposit(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.patch(
        `${url}/auth/reset_deposit`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user_token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(buy);
  useEffect(() => {
    let role_id = null;
    if (user_token) {
      role_id = decodeToken(user_token).role_id;
    }
    if (!user_token) {
      navigate('/login');
    }

    if (role_id === 2) {
      navigate('/dashboard');
    }
    getProducts();
  }, []);

  return (
    <div className="relative px-8 pt-12">
      <div className="flex justify-between">
        <h2>Products</h2>
        <div className="relative">
          <button
            type="button"
            className="bg-blue-300 text-white"
            onClick={() => setShowDeposit(true)}
          >
            Deposit Options
          </button>
          <div
            className={`${
              showDeposit ? 'block' : 'hidden'
            } absolute left-[-200px] bg-white p-8 shadow-lg`}
          >
            <button type="button" onClick={() => setShowDeposit(false)}>
              X
            </button>
            <div>
              <label htmlFor="amount" className="sm:block md:inline">
                Amount ($):
              </label>
              <input
                type="number"
                id="amount"
                value={depositAmount}
                name="amount"
                onChange={(e) => setDepositAmount(e.target.value)}
                className="md:ml-2"
              />
              <button type="button" onClick={() => handleDeposit()}>
                deposit
              </button>
            </div>
            <button type="button" onClick={() => handleReset()}>
              reset deposit
            </button>
          </div>
        </div>
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
              <p className="text-sm">Sold by: {item.seller_id}</p>
            </div>
            <div>
              <button
                type="button"
                className="w-[100px] bg-green-600 py-2 text-white"
                onClick={() => {
                  setBuy((prevState) => ({
                    ...prevState,
                    buying: true,
                  }));
                  handleCurrentProduct(item.product_id);
                }}
              >
                buy
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div
        className={`${
          buy.buying ? 'block' : 'hidden'
        } absolute top-[40vh] left-[20vw] w-[300px] bg-slate-300 p-2 shadow`}
      >
        <p>Buy {buy.product.name}</p>
        <div className="mx-auto flex w-10/12 items-center gap-4">
          <button
            type="button"
            onClick={() => handleCount('minus')}
            className="bg-blue-300 px-4 py-2"
          >
            -
          </button>
          <p>{count}</p>
          <button
            type="button"
            onClick={() => handleCount('plus')}
            className="my-4 bg-blue-300 px-4 py-2"
          >
            +
          </button>
        </div>
        <p>Total: ${count * buy.product.cost}</p>
        <button
          type="button"
          className="ml-4 bg-green-300 text-white"
          onClick={() => handlePurchase()}
        >
          purchase
        </button>
        <button
          type="button"
          className="ml-4 bg-red-300 text-white"
          onClick={() => {
            setBuy((prevState) => ({
              ...prevState,
              buying: false,
            }));
            setCount(1);
          }}
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default Store;

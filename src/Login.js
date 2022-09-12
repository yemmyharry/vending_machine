import { decodeToken } from 'react-jwt';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const url = process.env.REACT_APP_BASEAPI_URL;
  const navigate = useNavigate();
  const signInRequest = async (userData) => {
    try {
      const response = await axios.post(
        `${url}/api/v1/login`,
        {
          username: userData.username,
          password: userData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.token) {
        sessionStorage.setItem('user_token', response.data.token);
        const role = decodeToken(response.data.token).role_id;
        navigate(`${role === 1 ? '/store' : '/dashboard'}`);
      }
      return response.status;
    } catch (error) {
      return error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.username === '') {
      alert('Please type a username');
      return;
    }

    if (user.password === '') {
      alert('Please type a password');
      return;
    }

    await signInRequest(user);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
      <div className="mx-auto md:max-w-md">
        <h3 className="my-4 ml-4 text-2xl">Login</h3>
        <form
          className="mx-auto flex w-[80%] max-w-md flex-col gap-8"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="">
            <label htmlFor="username" className="sm:block md:inline">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={user.username}
              name="username"
              onChange={(e) => handleChange(e)}
              className="md:ml-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="sm:block md:inline">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={user.password}
              name="password"
              onChange={(e) => handleChange(e)}
              className="md:ml-2"
            />
          </div>
          <button
            type="submit"
            className="w-[80px] bg-green-600 py-2 text-white"
          >
            login
          </button>
        </form>
        <div className="ml-4 mt-4">
          <p>
            Don&apos;t have an account? <Link to="/signup">sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

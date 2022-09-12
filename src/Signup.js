import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
    role: '1',
  });
  const [reqStatus, setReqStatus] = useState(undefined);
  const url = process.env.REACT_APP_BASEAPI_URL;

  const signupRequest = async (userData) => {
    console.log(userData);
    try {
      const response = await axios.post(
        `${url}/api/v1/register`,
        {
          username: userData.username,
          password: userData.password,
          role_id: parseInt(userData.role, 10),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('my res', response);
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

  const handleRole = (e) => {
    setUser((prevState) => ({
      ...prevState,
      role: e.target.value,
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

    const result = await signupRequest(user);
    if (result === 200) {
      setReqStatus(true);
      setTimeout(() => {
        setReqStatus(undefined);
      }, 5000);
    } else {
      setReqStatus(false);
      setTimeout(() => {
        setReqStatus(undefined);
      }, 5000);
    }
    console.log('result', result);
    console.log('req', reqStatus);
  };
  console.log(reqStatus);

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
      <div className="mx-auto md:max-w-md">
        <h3 className="my-4 ml-4 text-2xl">Sign Up</h3>
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
          <div>
            <p>Pick a role:</p>
            <label>
              <input
                type="radio"
                value="1"
                checked={user.role === '1'}
                onChange={(e) => handleRole(e)}
                className="mr-2"
              />
              Buyer
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="2"
                checked={user.role === '2'}
                onChange={(e) => handleRole(e)}
                className="mr-2"
              />
              Seller
            </label>
          </div>
          <button
            type="submit"
            className="w-[80px] bg-blue-600 py-2 text-white"
          >
            Sign up
          </button>
          {reqStatus !== undefined && (
            <div
              className={`rounded-sm p-4 text-${
                reqStatus === true ? 'green' : 'red'
              }-600 bg-${reqStatus === true ? 'green' : 'red'}-300`}
            >
              <p className={`text-${reqStatus ? 'green' : 'red'}-300`}>
                {reqStatus
                  ? 'Account Created successfully'
                  : 'Account creation failed, please try again'}
              </p>
            </div>
          )}
        </form>
        <div className="ml-4 mt-4">
          <p>
            Already have an account? <Link to="/login">login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

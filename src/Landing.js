import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
    <div className="mx-auto w-[90%] md:max-w-md">
      <h1>Welcome to my Vending Machine</h1>
      <div className="mt-6 flex justify-between">
        <Link to="/signup">
          <button
            type="button"
            className="w-[100px] max-w-[100px] bg-blue-600 py-2 text-white"
          >
            Sign up
          </button>
        </Link>
        <Link to="/login">
          <button
            type="button"
            className="w-[100px] max-w-[100px] bg-green-600 py-2 text-white"
          >
            Login
          </button>
        </Link>
      </div>
    </div>
  </div>
);

export default Landing;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const NewProduct = () => {
  const [product, setProduct] = useState({
    product_name: '',
    cost: 0,
    amount_available: 0,
  });
  const { id } = useParams();
  const [reqStatus, setReqStatus] = useState(undefined);
  const url = process.env.REACT_APP_BASEAPI_URL;
  const successString = id
    ? 'Update successfull'
    : 'Product added successfully';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const user_token = sessionStorage.getItem('user_token');
  const addProductRequest = async (userData) => {
    try {
      const response = await axios.post(
        `${url}/auth/create_product`,
        {
          product_name: userData.product_name,
          cost: parseInt(userData.cost, 10),
          amount_available: parseInt(userData.amount_available, 10),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user_token}`,
          },
        }
      );
      return response.status;
    } catch (error) {
      return error;
    }
  };

  const updateProductRequest = async (userData) => {
    try {
      const response = await axios.put(
        `${url}/auth/update_product/${id}`,
        {
          product_name: userData.product_name,
          cost: parseInt(userData.cost, 10),
          amount_available: parseInt(userData.amount_available, 10),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user_token}`,
          },
        }
      );
      return response.status;
    } catch (error) {
      return error;
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${url}/auth/get_product/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user_token}`,
        },
      });
      setProduct({
        product_name: response.data.product_name,
        cost: response.data.cost,
        amount_available: response.data.amount_available,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product.product_name === '') {
      alert('Please type a product name');
      return;
    }

    if (product.cost <= 0 || product.cost % 5 !== 0) {
      alert('Invalid product cost');
      return;
    }

    if (product.amount_available <= 0) {
      alert('Invalid product amount');
      return;
    }

    const result = await (id
      ? updateProductRequest(product)
      : addProductRequest(product));
    if (result === 200) {
      setReqStatus(true);
      setTimeout(() => {
        setReqStatus(undefined);
        window.location.reload();
      }, 5000);
    } else {
      setReqStatus(false);
      setTimeout(() => {
        setReqStatus(undefined);
      }, 5000);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  return (
    <div className="mt-48">
      <h3 className="mx-auto mb-6 w-[80%] max-w-[800px] text-xl">
        {id ? 'Edit Product' : 'Add a new Product'}
      </h3>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="mx-auto flex w-[80%] max-w-md flex-col gap-8"
      >
        <div className="flex flex-col justify-between md:flex-row">
          <label htmlFor="name" className="basis-full md:basis-4/12">
            Product Name:
          </label>
          <input
            type="text"
            id="name"
            value={product.product_name}
            name="product_name"
            className="basis-6/12"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="flex flex-col justify-between md:flex-row">
          <label htmlFor="cost" className="basis-full md:basis-4/12">
            Cost:
          </label>
          <input
            type="number"
            id="cost"
            value={product.cost}
            name="cost"
            className="basis-6/12"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="flex flex-col justify-between md:flex-row">
          <label htmlFor="amount" className="basis-full md:basis-4/12">
            Number of units:
          </label>
          <input
            type="number"
            id="amount"
            value={product.amount_available}
            name="amount_available"
            className="basis-6/12"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <button type="submit" className="w-[150px] bg-blue-600 py-2 text-white">
          {id ? 'update product' : 'add product'}
        </button>
        {reqStatus !== undefined && (
          <div
            className={`rounded-sm p-4 text-${
              reqStatus === true ? 'green' : 'red'
            }-600 bg-${reqStatus === true ? 'green' : 'red'}-300`}
          >
            <p className={`text-${reqStatus ? 'green' : 'red'}-300`}>
              {reqStatus
                ? successString
                : 'Failed to add product, please try again'}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewProduct;

'use client'

import React, { useState } from 'react';

import { FancyButton } from "../../(components)/FancyButton"
import Link from 'next/link';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Send request to API
  };

  return (
    <><h2 className="text-2xl font-bold mb-6 text-center">
          Logging In
      </h2><form onSubmit={handleSubmit}>
              <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">
                      Mail
                  </label>
                  <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required />
              </div>
              <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700">
                      Password
                  </label>
                  <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required />
              </div>
              <div className="flex flex-row w-full items-center justify-center mb-3">
                    <FancyButton type="submit" className="">
                        Log In
                    </FancyButton>
              </div>
              <div className="flex flex-row w-full items-center justify-center">
                <p className='mr-2'>No account ?</p>
                <Link href="/user/signup" className='text-blue-600'>Sign Up</Link>
              </div>
          </form></>
  );
};

export default Register;

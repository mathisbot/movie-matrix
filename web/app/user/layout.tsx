'use client'

import React, { useState } from 'react';

const UserPage = ({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    return (
      <div className="flex items-center justify-center bg-white mt-7">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            {children}
          </div>
      </div>
  );
};

export default UserPage;

import React from 'react';
import Link from 'next/link';

const MovieLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default MovieLayout;

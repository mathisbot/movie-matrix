import React from 'react';
import Link from 'next/link';

const MovieLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <header className="bg-white p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          MovieMatrix
        </Link>
        <nav>
          <Link href="/movies" className="ml-4">Movies</Link>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-white p-4 text-center">
        &copy; 2024 MatrixMovie. ViaRézo.
      </footer>
    </div>
  );
};

export default MovieLayout;

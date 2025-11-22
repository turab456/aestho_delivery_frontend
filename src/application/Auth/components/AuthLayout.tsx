import React from "react";
import GridShape from "../../../components/common/GridShape";
import { Link } from "react-router";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="relative p-6 z-1 sm:p-0"
      style={{
        backgroundColor: '#ffffff',
        fontFamily: 'Outfit, sans-serif'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
      `}</style>
      <div 
        className="relative flex flex-col justify-center w-full h-screen lg:flex-row sm:p-0"
        style={{ backgroundColor: '#ffffff' }}
      >
        {children}
        <div 
          className="items-center hidden w-full h-full lg:w-1/2 lg:grid"
          style={{ backgroundColor: '#000000' }}
        >
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/logo.svg"
                  alt="Logo"
                />
              </Link>
              <p 
                className="text-center"
                style={{ color: '#9ca3af' }}
              >
                Hoodie Store Order Management System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

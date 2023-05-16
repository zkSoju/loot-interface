"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <div className="fixed z-50 w-full px-48">
      <div className="flex w-full items-center justify-center border-b border-white/5 px-8 py-4">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;

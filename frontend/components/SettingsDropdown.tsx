'use client';

import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

interface SettingsDropdownProps {
  setShowLogin: (show: boolean) => void;
  session: Session | null;
}

export default function SettingsDropdown({ setShowLogin, session }: SettingsDropdownProps): React.ReactElement {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/auth/get-username');
          const data = await response.json();
          if (data.status === 'success') {
            setUsername(data.username);
          } else {
            console.error('Failed to fetch username:', data.message);
            setUsername('Error'); // Indicate error fetching username
          }
        } catch (error) {
          console.error('Error fetching username:', error);
          setUsername('Error'); // Indicate error fetching username
        }
      } else {
        setUsername(null); // Clear username if session doesn't exist
      }
    };

    fetchUsername();
  }, [session]);

  return (
    <div className="absolute top-8 right-8 z-20">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
              <Settings className="h-7 w-7" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-[#1A1A1A] border-[#2A2A2A] p-2">
          {session ? (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-white font-semibold text-lg mb-2">{username || 'Loading...'}</span>
              <DropdownMenuItem 
                className="text-white hover:bg-[#2A2A2A] cursor-pointer text-center font-bold w-full justify-center"
                onClick={() => signOut()}
              >
                Sign Out
              </DropdownMenuItem>
            </div>
          ) : (
            <>
              <DropdownMenuItem 
                className="text-white hover:bg-[#2A2A2A] cursor-pointer text-center font-bold"
                onClick={() => setShowLogin(true)}
              >
                Login
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-[#2A2A2A] cursor-pointer text-center font-bold"
                onClick={() => setShowLogin(true)}
              >
                Register
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 
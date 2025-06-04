'use client';

import SparklesEmoji from "@souhaildev/reactemojis/src/components/sparkles";
import Typewriter from "./animations/Typewriter";
import AnimatedStars from "./animations/AnimatedStars";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useState } from "react";
import { LoginDialog } from "./auth/LoginDialog";
import { useSession } from "next-auth/react";

export default function Home({connect}: {connect: () => void}): React.ReactElement {
  const [showLogin, setShowLogin] = useState(false);
  const { data: session } = useSession();

  const handleStartCall = () => {
    if (session) {
      // If user is already logged in, connect immediately
      connect();
    } else {
      // If not logged in, show login dialog
      setShowLogin(true);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white p-4 md:p-8 font-[family-name:var(--font-geist-sans)]">
      {/* Settings dropdown */}
      <div className="absolute top-4 right-4 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Settings className="h-7 w-7" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-28 bg-[#1A1A1A] border-[#2A2A2A] ">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Animated stars background */}
      <AnimatedStars />

      {/* Main content above stars */}
      <div className="relative z-10 w-full max-w-md p-8 bg-[#1A1A1A] rounded-2xl shadow-2xl backdrop-blur-sm border border-[#2A2A2A]">
        {/* Typewriter component */}
        <Typewriter className="mb-14 text-center" />

        <div className="flex flex-col gap-4">
          <button
            onClick={handleStartCall}
            className="w-full bg-[#A855F7] text-white px-3.5 py-4 rounded-xl font-semibold hover:cursor-pointer hover:bg-[#9333EA] transition-all duration-200 shadow-lg shadow-[#A855F7]/20 flex items-center justify-center gap-2"
          >
            <span>Start Random Call</span>
            <SparklesEmoji style={{width: 24, height: 24}} />
          </button>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog 
        open={showLogin} 
        onOpenChange={setShowLogin}
        onSuccess={() => {
          // After successful login/registration, connect
          connect();
        }}
      />
    </div>
  )
}
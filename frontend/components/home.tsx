import SparklesEmoji from "@souhaildev/reactemojis/src/components/sparkles";
import Typewriter from "./Typewriter";
import AnimatedStars from "./AnimatedStars";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export default function Home({connect}: {connect: () => void}): React.ReactElement {
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
            <DropdownMenuItem className="text-white hover:bg-[#2A2A2A] cursor-pointer text-center font-bold">
              Login
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#2A2A2A] cursor-pointer text-center font-bold">
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
            onClick={connect}
            className="w-full bg-[#A855F7] text-white px-3.5 py-4 rounded-xl font-semibold hover:cursor-pointer hover:bg-[#9333EA] transition-all duration-200 shadow-lg shadow-[#A855F7]/20 flex items-center justify-center gap-2"
          >
            <span>Start Random Call</span>
            <SparklesEmoji style={{width: 24, height: 24}} />
          </button>
        </div>
      </div>
    </div>
  )
}
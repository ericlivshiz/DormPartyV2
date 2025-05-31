"use client";
import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

function randomID(len: number) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

// Remove the custom getUrlParams function
// export function getUrlParams(url?: string) {
//   const urlStr = (url || window.location.href).split("?")[1];
//   return new URLSearchParams(urlStr);
// }

export default function App() {
  // --- Move Hook calls to the top ---
  // Use the useSearchParams hook to get URL parameters
  const searchParams = useSearchParams();

  // Create a ref for the container div
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasJoined, setHasJoined] = React.useState(false); // State to prevent re-joining

  // Move the Zego SDK initialization and join logic into a useEffect
  React.useEffect(() => {
    // Only run this effect if roomID is available and we haven't joined yet
    // Access searchParams inside useEffect if needed, or pass roomID as a dependency
    const roomID = searchParams.get("roomID"); // Get roomID inside useEffect

    if (!roomID || hasJoined) {
      return;
    }

    const appID: number = Number(process.env.NEXT_PUBLIC_APP_ID);
    const serverSecret: string = String(process.env.NEXT_PUBLIC_SERVER_SECRET);
    console.log(`APP ID: ${appID}`);
    console.log(`SERVER SECRET: ${serverSecret}`);
    if (!appID || !serverSecret) {
      alert("App ID or Server Secret is missing!");
      return;
    }
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID, // Use the roomID from the URL
      randomID(5),
      randomID(5)
    );
    if (!kitToken) {
      alert("Kit token is invalid!");
      return;
    }
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    if (!zp) {
      alert("ZegoUIKitPrebuilt.create returned undefined!");
      return;
    }

    // Ensure the container ref is available before joining
    if (containerRef.current) {
      zp.joinRoom({
        container: containerRef.current, // Use the ref here
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        // Add this option to disable the pre-join view
        showPreJoinView: false,
        // You can add other configurations here if needed
        // For example, to hide the top bar:
        // showRoomDetailsButton: false,
        // showLeavingView: false, // To prevent showing a leaving confirmation
      });
      setHasJoined(true); // Mark as joined to prevent re-initialization
    }

    // Clean up the Zego instance when the component unmounts
    return () => {
      if (zp) {
        zp.destroy();
      }
    };

  }, [searchParams, hasJoined]); // Depend on searchParams and hasJoined
  // --- End Hook calls ---

  // Now, the early return comes after the Hook calls
  const roomID = searchParams.get("roomID"); // Get roomID again for the render logic

  console.log(`Attempting to get roomID from URL: ${roomID}`); // Add log here

  // Add a check: if roomID is missing, show an error or redirect
  if (!roomID) {
    // You might want to redirect back or show an error message
    // For example:
    // const router = useRouter(); // Need to import useRouter from 'next/navigation'
    // React.useEffect(() => { router.push('/'); }, [router]);
    return <div>Error: Room ID is missing. Please try matching again.</div>;
  }


  // The component will render this div, and the useEffect will attach the Zego UI to it
  return (
    <div
      className="myCallContainer"
      ref={containerRef} // Assign the ref to the div
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}

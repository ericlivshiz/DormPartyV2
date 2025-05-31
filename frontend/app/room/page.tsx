"use client";
import * as React from "react";
// Remove this import:
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

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
  // Use the useSearchParams hook to get URL parameters
  const searchParams = useSearchParams();
  const roomID = searchParams.get("roomID");

  console.log(`Attempting to get roomID from URL: ${roomID}`); // Add log here

  // Add a check: if roomID is missing, show an error or redirect
  if (!roomID) {
    // You might want to redirect back or show an error message
    // For example:
    // const router = useRouter(); // Need to import useRouter from 'next/navigation'
    // React.useEffect(() => { router.push('/'); }, [router]);
    return <div>Error: Room ID is missing. Please try matching again.</div>;
  }

  // Create a ref for the container div
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasJoined, setHasJoined] = React.useState(false); // State to prevent re-joining

  // Move the Zego SDK initialization and join logic into a useEffect
  React.useEffect(() => {
    // Only run this effect if roomID is available and we haven't joined yet
    if (!roomID || hasJoined) {
      return;
    }

    // Dynamically import ZegoUIKitPrebuilt on the client side
    import("@zegocloud/zego-uikit-prebuilt").then(({ ZegoUIKitPrebuilt }) => {
      const appID: number = Number(process.env.NEXT_PUBLIC_APP_ID);
      const serverSecret: string = String(
        process.env.NEXT_PUBLIC_SERVER_SECRET
      );
      console.log(`APP ID: ${appID}`);
      console.log(`SERVER SECRET: ${serverSecret}`);
      if (!appID || !serverSecret) {
        alert("App ID or Server Secret is missing!");
        return;
      }
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
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

      if (containerRef.current) {
        zp.joinRoom({
          container: containerRef.current,
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
          showPreJoinView: false,
          // You can add other configurations here if needed
          // For example, to hide the top bar:
          // showRoomDetailsButton: false,
          // showLeavingView: false, // To prevent showing a leaving confirmation
        });
        setHasJoined(true);
      }

      // Clean up the Zego instance when the component unmounts
      return () => {
        if (zp) {
          zp.destroy();
        }
      };
    });
  }, [roomID, hasJoined]);

  // The component will render this div, and the useEffect will attach the Zego UI to it
  return (
    <div
      className="myCallContainer"
      ref={containerRef} // Assign the ref to the div
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}

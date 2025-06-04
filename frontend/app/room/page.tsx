"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

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

export default function App() {
  // Hooks must be called unconditionally
  const searchParams = useSearchParams();
  const roomID = searchParams.get("roomID");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasJoined, setHasJoined] = React.useState(false);

  React.useEffect(() => {
    if (!roomID || hasJoined) {
      return;
    }

    import("@zegocloud/zego-uikit-prebuilt").then(({ ZegoUIKitPrebuilt }) => {
      const appID: number = Number(process.env.NEXT_PUBLIC_APP_ID);
      const serverSecret: string = String(
        process.env.NEXT_PUBLIC_SERVER_SECRET
      );
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
          // For example, to hide the top bar:
          // showRoomDetailsButton: false,
          // showLeavingView: false,
        });
        setHasJoined(true);
      }

      return () => {
        if (zp) {
          zp.destroy();
        }
      };
    });
  }, [roomID, hasJoined]);

  // Always render the container, but show an error if roomID is missing
  if (!roomID) {
    return <div>Error: Room ID is missing. Please try matching again.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        style={{ width: "100vw", height: "100vh", position: 'relative' }} // Add position: 'relative' to the container
      >
        <div
          className="myCallContainer"
          ref={containerRef}
          style={{ width: "100%", height: "100%" }} // Adjust Zego container style
        ></div>
        {/* Add the Skip button */}
        <button
          style={{
            position: 'absolute', // Position the button absolutely
            bottom: '20px', // 20px from the bottom
            left: '60%', // Center horizontally
            transform: 'translateX(-50%)', // Adjust for button width
            zIndex: 10, // Ensure button is above the video container
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Skip
        </button>
      </div>
    </Suspense>
  );
}

"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";

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

export default function RoomClient() {
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

  if (!roomID) {
    return <div>Error: Room ID is missing. Please try matching again.</div>;
  }

  return (
    <div
      style={{ width: "100vw", height: "100vh", position: 'relative' }}
    >
      <div
        className="myCallContainer"
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
      ></div>
      <button
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '60%',
          transform: 'translateX(-50%)',
          zIndex: 10,
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
  );
}
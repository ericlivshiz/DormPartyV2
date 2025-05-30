"use client";
import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

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

export function getUrlParams(url?: string) {
  const urlStr = (url || window.location.href).split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function App() {
  const roomID = getUrlParams().get("roomID") || randomID(5);
  let myMeeting: any = async (element: any) => {
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
    zp.joinRoom({
      container: element,
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
        mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}

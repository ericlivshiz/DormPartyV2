"use client";
import * as React from "react";
import { Suspense } from "react";
import RoomClient from "./RoomClient";

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomClient />
    </Suspense>
  );
}
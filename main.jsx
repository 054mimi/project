import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";

// stop any service worker during dev so cached requests don't break HMR
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
  // also clear the default cache to avoid stale responses
  if (caches) caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
}

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { statsAPI } from "./services/apiService";
import "./styles/index.css";

function Root() {
  useEffect(() => {
    // Per session (tab) visit – increments every time a new tab loads
    const sessionKey = 'site:visit:session'
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1')
      statsAPI.incrementVisit().catch(() => {})
    }

    // Per-day unique device tracking (does not affect the visible counter)
    const key = 'site:visit:day'
    const now = Date.now()
    const last = Number(localStorage.getItem(key) || 0)
    const DAY_MS = 24 * 60 * 60 * 1000
    if (now - last >= DAY_MS) {
      localStorage.setItem(key, String(now))
      let deviceId = localStorage.getItem('pv:deviceId')
      if (!deviceId) {
        deviceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
        localStorage.setItem('pv:deviceId', deviceId)
      }
      statsAPI.trackDailyVisit(deviceId).catch(() => {})
    }
  }, [])
  return (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);

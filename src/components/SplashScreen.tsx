import React from "react"
import LogoIcon from "../icons/Logo.svg"

// Matches the mobile apps' native splash (logo on white)
export default function SplashScreen() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 9999,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={LogoIcon} alt="mindLAMP" width={69} height={109} />
    </div>
  )
}

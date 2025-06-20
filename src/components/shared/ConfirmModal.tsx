// ConfirmModal.tsx
import React from "react"

const ConfirmModal = ({ confirm, title, text, confirmText, cancelText, handleConfirm, onCancel, onClose }) => {
  if (!confirm) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>{title}</h2>
        <p style={{ marginBottom: "1.5rem" }}>{text}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button onClick={onCancel} style={{ padding: "0.5rem 1rem" }}>
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: "0.5rem 1rem",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {confirmText}
          </button>
        </div>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.75rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "#666",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default ConfirmModal

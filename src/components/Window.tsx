import type { FC } from "react"
import { UrlDisplay } from "./UrlDisplay"

interface WindowProps {
  url: string
}

export const Window: FC<WindowProps> = ({ url }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}>
      <UrlDisplay url={url} />
    </div>
  )
}
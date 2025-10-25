import { UrlDisplay } from "UrlDisplay" // Note the import path


export const Window: () => FC = () => {
 return (<div
      style={{
        // This style creates a floating box on the page
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}>
      {/* We can reuse your existing UrlDisplay component! */}
      <UrlDisplay url={currentUrl} />
</div> ) 
}
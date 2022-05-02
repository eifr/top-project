import React from "react";
import "./card.css";

// card component
export const Card: React.FC<{
  style: React.CSSProperties;
  children: React.ReactNode;
}> = ({ style, children }) => {
  return (
    <div style={style} className="card">
      {children}
    </div>
  );
};

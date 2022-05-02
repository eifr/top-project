import { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import "./notification.css";

const rootOverlay = document.getElementById("root-overlay");

export const useToastNotification = () => {
  const [message, setMessage] = useState("");
  const messageNotification = <div className="notification">{message}</div>;

  const [opened, setOpened] = useState(false);

  const open = useCallback((message: string, timeout = 3_000) => {
    setMessage(message);
    setOpened(true);
    setTimeout(() => {
      setOpened(false);
    }, timeout);
  }, []);

  const Notification = useCallback(
    () => (
      <>
        {rootOverlay &&
          opened &&
          ReactDOM.createPortal(messageNotification, rootOverlay)}
      </>
    ),
    [opened, messageNotification]
  );
  return { open, Notification };
};

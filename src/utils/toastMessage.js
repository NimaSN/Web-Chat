import { toast } from "react-hot-toast";

// PopUp Empty Question Message
export const toastMessage = (text) =>
  toast(text, {
    position: "bottom-left",
    icon: "🙂",
    reverseOrder: false,
    style: {
      borderRadius: "100px",
      background: "#111827",
      color: "#ffffff",
    },
  });

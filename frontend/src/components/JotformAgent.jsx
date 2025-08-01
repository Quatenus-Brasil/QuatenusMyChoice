import { useEffect } from "react";

const JotformAgent = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${import.meta.env.VITE_JOTFORM_LINK}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default JotformAgent;
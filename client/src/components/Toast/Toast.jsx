import React, {useRef, useEffect} from "react";
import "./toast.scss";
const Toast = ({message}) => {
    const toast = useRef(null)
    useEffect(() => {
        const timer = setTimeout(() => {
          toast.current.style.animation = "hide_slide 1s ease forwards";
        }, 4000);
        return () => clearTimeout(timer);
      }, [message]);
  return (
        <div>
            <button  ref={toast} className={`snackbar alert-toast-message`}>{message}</button>
         </div>
  );
};

export default Toast;

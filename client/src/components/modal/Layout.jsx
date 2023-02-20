import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const bodyElement = document.body;

function Layout({ children }) {
    const refModal = useRef(document.createElement("div"));

    useEffect(() => {
        bodyElement.append(refModal.current);
        return () => {
            bodyElement.removeChild(refModal.current);
        };
    }, []);
    return createPortal(children, refModal.current);
}

export default Layout;

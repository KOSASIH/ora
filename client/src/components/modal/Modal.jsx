import React from "react";
import { useModalContext } from "./ModalContext";
import Layout from "./Layout";

function Modal() {
    const { children, isVisibleModal, destroyModal, propsModal } = useModalContext();

    if (!isVisibleModal) return <></>;
    if (children) {
        window.scrollTo(0, 0);
        window.document.body.style.overflow = "hidden";
    }
    return (
        <Layout>
            <div
                // className="absolute inset-0 z-10 h-screen bg-gray-300"
                style={{
                    position: "absolute",
                    inset: "0",
                    backgroundColor: "rgb(102 100 100 / 80%)",
                    zIndex: 9999,
                    height: "100vh",
                }}
                onClick={(e) => {
                    // console.log({ e });
                    propsModal.closeMask && destroyModal();
                }}
            ></div>
            <div
                // className="absolute top-1/2 left-1/2 z-20 grid place-content-center"
                style={{
                    transform: "translate(-50%,-50%)",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    zIndex: 99999,
                    display: "grid",
                    placeContent: "center",
                }}
            >
                <div
                    style={{
                        maxWidth: "300px",
                        minHeight: "120px",
                        borderRadius: "5px",
                        border: "1px solid #fff",
                        padding: "10px",

                        display: "grid",
                        placeContent: "center",
                        backgroundColor: "white",
                    }}
                >
                    {children}
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 6,
                        right: 10,
                        cursor: "pointer",
                        padding: 4,
                    }}
                    onClick={() => {
                        window.document.body.style.overflow = "unset";
                        destroyModal();
                    }}
                >
                    x
                </div>
            </div>
        </Layout>
    );
}

export default Modal;

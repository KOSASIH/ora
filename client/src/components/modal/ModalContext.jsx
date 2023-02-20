import { createContext, ReactNode, useCallback, useContext, useState } from "react";

export const ModalContext = createContext(null);
ModalContext.displayName = "ModalContext";

export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("Please add Provider ModalContext!!!");
    }

    return context;
};

export const ModalProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [propsModal, setPropsModal] = useState({
        closeMask: false,
    });

    const [modal, setModal] = useState();

    const openModal = useCallback((modal, props) => {
        setModal(modal);
        setIsVisible(true);

        if (props) {
            setPropsModal(props);
        }
    }, []);

    const destroyModal = useCallback(() => {
        setIsVisible(false);
    }, []);

    return (
        <ModalContext.Provider
            value={{
                openModal,
                destroyModal,
                isVisibleModal: isVisible,
                children: modal,
                propsModal,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};

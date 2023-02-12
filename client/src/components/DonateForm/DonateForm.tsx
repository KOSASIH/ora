import React, { CSSProperties } from "react";

interface Props {
    onDonate: () => void;
    onModalClose: () => void;
}
let s;
const modalStyle: CSSProperties = {
    background: "white",
    position: "absolute",
    left: "15vw",
    top: "40%",
    width: "70vw",
    height: "25vh",
    border: "1px solid black",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
};

export default function donateForm(props: Props) {
    return (
        <div style={modalStyle}>
            <p style={{ fontWeight: "bold" }}>Nhập số Pi muốn Donate</p>
            <div>
                <input type="text" value={s} />
                <button onClick={props.onDonate} style={{ marginRight: "1em" }}>
                    Ô Kê
                </button>
                <button onClick={props.onModalClose}>Close</button>
            </div>
        </div>
    );
}

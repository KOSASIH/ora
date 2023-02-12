import React from "react";
import "./App.scss";
import "./assets/boxicons-2.1.1/boxicons-2.1.1/css/boxicons.min.css";
import { BrowserRouter } from "react-router-dom";
import Header from "./pages/Header/Header";
import Footer from "./pages/Footer/Footer";
import Gototop from "./pages/Gototop/Gototop";
import RoutesConfig from "./config/RoutesConfig";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Header />
                <RoutesConfig />
                <Gototop />
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;

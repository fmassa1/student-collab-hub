import { useContext } from "react";

import './error.css';


function ErrorPage({code}) {
    const messages = {
        404: "Page Not Found",
        401: "Unauthorized Access",
        403: "Forbidden",
        500: "Internal Server Error",
        503: "Service Unavailable",
    };

    return (
         <div className="error-page">
            <div className="error-container">
                <h1 className="error-code">{code}</h1>
                <p className="error-message">{messages[code] || "Something went wrong"}</p>
                <a href="/" className="btn-primary">Go Home</a>
            </div>
        </div>
    );
}

export default ErrorPage;
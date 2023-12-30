const isLocalhost = window.location.hostname === "localhost";

const Logger = {
    log: (...messages) => {
        if (isLocalhost) {
            console.log(...messages);
        }
    },
    error: (...messages) => {
        if (isLocalhost) {
            console.error(...messages);
        }
    },
    // Add more methods as needed
};

export default Logger;

function ErrorMessage({ message }) {
    if (!message) {
        return null;
    }

    return (
        <div className="error-message">
            <strong>Error:</strong> {message}
        </div>
    );
}

export default ErrorMessage;
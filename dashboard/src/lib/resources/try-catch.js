const tryCatch = (callback) => {
    try {
        return callback();
    } catch {
        return;
    }
};

export default tryCatch;
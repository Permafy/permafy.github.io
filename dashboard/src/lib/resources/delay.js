/**
 * Resolves after the specified time
 * @param {number} ms Milliseconds to wait
 * @returns {number} The amount of milliseconds that actually passed
 */
const delay = (ms) => {
    const startTime = Date.now();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Date.now() - startTime);
        }, ms);
    });
};

export default delay;

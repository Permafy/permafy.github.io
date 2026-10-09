/**
 * Binds the enter key to onsubmit
 * @returns {import('svelte/attachments').Attachment}
 */
function enterSubmit() {
    return (node) => {
        node.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
                node.dispatchEvent(submitEvent);
            }
        });
        return;
    };
}

export default enterSubmit;
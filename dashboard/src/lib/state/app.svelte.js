const StateApplication = $state({
    /** Whether or not to show the navbar */
    // TODO: UNIMPORTANT: This doesnt actually seem to control anything. Luckily we dont hide the navbar for any reason right now.
    navigationBar: false,
    /** Whether or not loggedIn has been processed (always access before accessing loggedIn) */
    loggedInProcessed: false,
    /** Whether or not the PenguinActionIndicator is enabled. */
    penguinActionIndicator: true,
    /** Which Lottie is displaying on the PenguinActionIndicator right now. */
    penguinActionIndicatorLottie: "",
});

export default StateApplication;
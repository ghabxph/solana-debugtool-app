
/**
 *  This error is thrown when App.instance() is tried to be called without calling the `init` method first.
 */
export class AppNotYetInitialized extends Error {};
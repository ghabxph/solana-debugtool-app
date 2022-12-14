import { Connection } from "@solana/web3.js";
import { AppNotYetInitialized } from "./error";

export class App {

    private static self: App;

    private constructor(

        /**
         * Solana connection instance
         */
        readonly connection: Connection
    ) {};

    /**
     * Initialize the app's required configuration for it to run
     *
     * @param endpoint Solana network RPC URL
     */
    static init(endpoint: string) {

        // New app instance will be created if the app is not yet initialized
        if (App.self === undefined) {

            // Connection instance
            const connection = new Connection(endpoint, "confirmed");

            // Create the application instance
            App.self = new App(connection);
        } else {

            // Notify that the app is already been initialized and there's no any effect on re-calling this method.
            console.warn('The app instance has already been initialized. Calling this method has no effect.');
        }
    }

    /**
     * Get the app's singleton instance. The app must be initialized first by calling `init` method for the first time.
     */
    static get instance() {

        // Will throw error when the app has not been initialized for the first time.
        if (App.self === undefined) throw new AppNotYetInitialized();

        // Returns the singleton instance
        return App.self;
    }
}
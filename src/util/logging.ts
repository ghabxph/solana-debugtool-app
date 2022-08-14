
export function _enableLogging() {
    const log = console.log;

    /**
     * Enable / disable logging
     * 
     * @enable Set to false to disable logging. Default is true
     */
    return function(enable: boolean = true) {
        console.log = enable ? log : () => {};
    }
}
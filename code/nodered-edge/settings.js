/**
 * This is the default settings file provided by Node-RED.
 *
 * It can contain any valid JavaScript code that will get run when Node-RED
 * is started.
 *
 * Lines that start with // are commented out.
 * Each entry should be separated from the entries above and below by a comma ','
 *
 * For more information about individual settings, refer to the documentation:
 *    https://nodered.org/docs/user-guide/runtime/configuration
 *
 * The settings are split into the following sections:
 *  - Flow File and User Directory Settings
 *  - Security
 *  - Server Settings
 *  - Runtime Settings
 *  - Editor Settings
 *  - Node Settings
 *
 **/

module.exports = {

/*******************************************************************************
 * Flow File and User Directory Settings
 *  - flowFile
 *  - credentialSecret
 *  - flowFilePretty
 *  - userDir
 *  - nodesDir
 ******************************************************************************/

    /** The file containing the flows. If not set, defaults to flows_<hostname>.json **/
    flowFile: 'flows.json',

    /** By default, credentials are encrypted in storage using a generated key. To
     * specify your own secret, set the following property.
     * If you want to disable encryption of credentials, set this property to false.
     * Note: once you set this property, do not change it - doing so will prevent
     * node-red from being able to decrypt your existing credentials and they will be
     * lost.
     */
    //credentialSecret: "a-secret-key",

    /** By default, the flow JSON will be formatted over multiple lines making
     * it easier to compare changes when using version control.
     * To disable pretty-printing of the JSON set the following property to false.
     */
    flowFilePretty: true,

    /** By default, all user data is stored in a directory called `.node-red` under
     * the user's home directory. To use a different location, the following
     * property can be used
     */
    //userDir: '/home/nol/.node-red/',

    /** Node-RED scans the `nodes` directory in the userDir to find local node files.
     * The following property can be used to specify an additional directory to scan.
     */
    //nodesDir: '/home/nol/.node-red/nodes',

/*******************************************************************************
 * Security
 *  - adminAuth
 *  - https
 *  - httpsRefreshInterval
 *  - requireHttps
 *  - httpNodeAuth
 *  - httpStaticAuth
 ******************************************************************************/

    /** To password protect the Node-RED editor and admin API, the following
     * property can be used. See https://nodered.org/docs/security.html for details.
     */
    //adminAuth: {
    //   type: "credentials",
    //   users: [{
    //       username: "admin",
    //       password: "$2y$08$2Niz06DcKQZwUE1c1UFbK.3eov/97t/iN71qUAJJf8aN9LJGVtbpW",
    //       permissions: "*"
    //   }]
    //},

    /** The following property can be used to enable HTTPS
     * This property can be either an object, containing both a (private) key
     * and a (public) certificate, or a function that returns such an object.
     * See http://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
     * for details of its contents.
     */

    /** Option 1: static object */
    //https: {
    //  key: require("fs").readFileSync('privkey.pem'),
    //  cert: require("fs").readFileSync('cert.pem')
    //},

    /** Option 2: function that returns the HTTP configuration object */
    // https: function() {
    //     // This function should return the options object, or a Promise
    //     // that resolves to the options object
    //     return {
    //         key: require("fs").readFileSync('privkey.pem'),
    //         cert: require("fs").readFileSync('cert.pem')
    //     }
    // },

    /** If the `https` setting is a function, the following setting can be used
     * to set how often, in hours, the function will be called. That can be used
     * to refresh any certificates.
     */
    //httpsRefreshInterval : 12,

    /** The following property can be used to cause insecure HTTP connections to
     * be redirected to HTTPS.
     */
    //requireHttps: true,

    /** To password protect the node-defined HTTP endpoints (httpNodeRoot),
     * including node-red-dashboard, or the static content (httpStatic), the
     * following properties can be used.
     * The `pass` field is a bcrypt hash of the password.
     * See https://nodered.org/docs/security.html#generating-the-password-hash
     */
    //httpNodeAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},
    //httpStaticAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},

/*******************************************************************************
 * Server Settings
 *  - uiPort
 *  - uiHost
 *  - apiMaxLength
 *  - httpServerOptions
 *  - httpAdminRoot
 *  - httpAdminMiddleware
 *  - httpAdminCookieOptions
 *  - httpNodeRoot
 *  - httpNodeCors
 *  - httpNodeMiddleware
 *  - httpStatic
 *  - httpStaticRoot
 *  - httpStaticCors
 ******************************************************************************/

    /** the tcp port that the Node-RED web server is listening on */
    uiPort: process.env.PORT || 1880,

    /** By default, the Node-RED UI accepts connections on all IPv4 interfaces.
     * To listen on all IPv6 addresses, set uiHost to "::",
     * The following property can be used to listen on a specific interface. For
     * example, the following would only allow connections from the local machine.
     */
    //uiHost: "127.0.0.1",

    /** The maximum size of HTTP request that will be accepted by the runtime api.
     * Default: 5mb
     */
    //apiMaxLength: '5mb',

    /** The following property can be used to pass custom options to the Express.js
     * server used by Node-RED. For a full list of available options, refer
     * to http://expressjs.com/en/api.html#app.settings.table
     */
    //httpServerOptions: { },

    /** By default, the Node-RED UI is available at http://localhost:1880/
     * The following property can be used to specify a different root path.
     * If set to false, this is disabled.
     */
    //httpAdminRoot: '/admin',

    /** The following property can be used to add a custom middleware function
     * in front of all admin http routes. For example, to set custom http
     * headers. It can be a single function or an array of middleware functions.
     */
    // httpAdminMiddleware: function(req,res,next) {
    //    // Set the X-Frame-Options header to limit where the editor
    //    // can be embedded
    //    //res.set('X-Frame-Options', 'sameorigin');
    //    next();
    // },

    /** The following property can be used to set addition options on the session
     * cookie used as part of adminAuth authentication system
     * Available options are documented here: https://www.npmjs.com/package/express-session#cookie
     */
    // httpAdminCookieOptions: { },

    /** Some nodes, such as HTTP In, can be used to listen for incoming http requests.
     * By default, these are served relative to '/'. The following property
     * can be used to specify a different root path. If set to false, this is
     * disabled.
     */
    //httpNodeRoot: '/red-nodes',

    /** The following property can be used to configure cross-origin resource sharing
     * in the HTTP nodes.
     * See https://github.com/troygoode/node-cors#configuration-options for
     * details on its contents. The following is a basic permissive set of options:
     */
    //httpNodeCors: {
    //    origin: "*",
    //    methods: "GET,PUT,POST,DELETE"
    //},

    /** If you need to set an http proxy please set an environment variable
     * called http_proxy (or HTTP_PROXY) outside of Node-RED in the operating system.
     * For example - http_proxy=http://myproxy.com:8080
     * (Setting it here will have no effect)
     * You may also specify no_proxy (or NO_PROXY) to supply a comma separated
     * list of domains to not proxy, eg - no_proxy=.acme.co,.acme.co.uk
     */

    /** The following property can be used to add a custom middleware function
     * in front of all http in nodes. This allows custom authentication to be
     * applied to all http in nodes, or any other sort of common request processing.
     * It can be a single function or an array of middleware functions.
     */
    //httpNodeMiddleware: function(req,res,next) {
    //    // Handle/reject the request, or pass it on to the http in node by calling next();
    //    // Optionally skip our rawBodyParser by setting this to true;
    //    //req.skipRawBodyParser = true;
    //    next();
    //},

    /** When httpAdminRoot is used to move the UI to a different root path, the
     * following property can be used to identify a directory of static content
     * that should be served at http://localhost:1880/.
     * When httpStaticRoot is set differently to httpAdminRoot, there is no need
     * to move httpAdminRoot
     */
    //httpStatic: '/home/nol/node-red-static/', //single static source
    /**
     *  OR multiple static sources can be created using an array of objects...
     *  Each object can also contain an options object for further configuration.
     *  See https://expressjs.com/en/api.html#express.static for available options.
     *  They can also contain an option `cors` object to set specific Cross-Origin
     *  Resource Sharing rules for the source. `httpStaticCors` can be used to
     *  set a default cors policy across all static routes.
     */
    //httpStatic: [
    //    {path: '/home/nol/pics/',    root: "/img/"},
    //    {path: '/home/nol/reports/', root: "/doc/"},
    //    {path: '/home/nol/videos/',  root: "/vid/", options: {maxAge: '1d'}}
    //],

    /**
     * All static routes will be appended to httpStaticRoot
     * e.g. if httpStatic = "/home/nol/docs" and  httpStaticRoot = "/static/"
     *      then "/home/nol/docs" will be served at "/static/"
     * e.g. if httpStatic = [{path: '/home/nol/pics/', root: "/img/"}]
     *      and httpStaticRoot = "/static/"
     *      then "/home/nol/pics/" will be served at "/static/img/"
     */
    //httpStaticRoot: '/static/',

    /** The following property can be used to configure cross-origin resource sharing
     * in the http static routes.
     * See https://github.com/troygoode/node-cors#configuration-options for
     * details on its contents. The following is a basic permissive set of options:
     */
    //httpStaticCors: {
    //    origin: "*",
    //    methods: "GET,PUT,POST,DELETE"
    //},

    /** The following property can be used to modify proxy options */
    // proxyOptions: {
    //     mode: "legacy", // legacy mode is for non-strict previous proxy determination logic (node-red < v4 compatible)
    // },

/*******************************************************************************
 * Runtime Settings
 *  - lang
 *  - runtimeState
 *  - diagnostics
 *  - logging
 *  - contextStorage
 *  - exportGlobalContextKeys
 *  - externalModules
 ******************************************************************************/

    /** Uncomment the following to run node-red in your preferred language.
     * Available languages include: en-US (default), ja, de, zh-CN, zh-TW, ru, ko
     * Some languages are more complete than others.
     */
    // lang: "de",

    /** Configure diagnostics options
     * - enabled:  When `enabled` is `true` (or unset), diagnostics data will
     *   be available at http://localhost:1880/diagnostics
     * - ui: When `ui` is `true` (or unset), the action `show-system-info` will
     *   be available to logged in users of node-red editor
    */
    diagnostics: {
        /** enable or disable diagnostics endpoint. Must be set to `false` to disable */
        enabled: true,
        /** enable or disable diagnostics display in the node-red editor. Must be set to `false` to disable */
        ui: true,
    },

    /** Configure the logging output */
    logging: {
        /** Only console logging is currently supported */
        console: {
            /** Level of logging to be recorded. Options are:
             * fatal - only those errors which make the application unusable should be recorded
             * error - record errors which are deemed fatal for a particular request + fatal errors
             * warn - record problems which are non fatal + errors + fatal errors
             * info - record information about the general running of the application + warn + error + fatal errors
             * debug - record information which is more verbose than info + info + warn + error + fatal errors
             * trace - record very detailed logging + debug + info + warn + error + fatal errors
             * off - turn off all logging (doesn't affect metrics or audit)
             */
            level: "info",
            /** Whether or not to include metric events in the log output */
            metrics: false,
            /** Whether or not to include audit events in the log output */
            audit: false
        }
    },

    /** Context Storage
     * The following property can be used to enable context storage.
     * The configuration for this property is an object, where the keys provide
     * the names of the storage modules and the values are the configuration
     * objects for those modules.
     *
     * For more information, refer to the documentation:
     *    https://nodered.org/docs/user-guide/context
     */
    //contextStorage: {
    //   default: {
    //       module: "localfilesystem"
    //   },
    //   memoryOnly: {
    //       module: "memory"
    //   }
    //},

    /** Export Global Context Keys
     * The following property can be used to expose global context keys to the
     * Function node.
     * For more information, refer to the documentation:
     *    https://nodered.org/docs/user-guide/writing-functions#global-context
     */
    //exportGlobalContextKeys: false,

    /** External Modules
     * The following property can be used to configure how external modules are
     * handled.
     */
    //externalModules: {
    //    autoInstall: false,   /** Whether the runtime should attempt to automatically install missing modules */
    //    autoInstallRetry: 30, /** Interval, in seconds, between attempts to install missing modules */
    //    palette: {              /** Configuration for the Palette Manager */
    //        allowInstall: true, /** Enable/disable the Palette Manager */
    //        allowUpload: true,  /** Enable/disable the Palette Manager upload feature */
    //        allowList: ['*'],   /** Allow specific modules to be installed */
    //        denyList: [],       /** Deny specific modules from being installed */
    //        allowUpdate: true,  /** Enable/disable module updates */
    //        allowCatalogFetch: true, /** Enable/disable catalog fetch */
    //        catalogisation: 'online', /** 'online' or 'offline' */
    //    },
    //    modules: {              /** Configuration for the Function Node's module loading */
    //        allowInstall: true, /** Enable/disable module installation */
    //        allowList: [],      /** Allow specific modules to be installed */
    //        denyList: []        /** Deny specific modules from being installed */
    //    }
    //},

/*******************************************************************************
 * Editor Settings
 *  - editorTheme
 ******************************************************************************/

    /** Editor Theme
     * The following property can be used to customise the editor theme.
     * See https://github.com/node-red/node-red/wiki/Theme-Configuration-Guide
     * for details.
     */
    editorTheme: {
        /** The following property can be used to set the default theme for the editor.
         * See https://github.com/node-red/node-red/wiki/Theme-Configuration-Guide
         * for details.
         */
        //page: {
        //    title: "Node-RED",
        //    favicon: "/absolute/path/to/theme/icon",
        //    css: "/absolute/path/to/custom/css/file",
        //    scripts: [ "/absolute/path/to/custom/script/file" ]
        //},

        /** The following property can be used to set the default header for the editor.
         * See https://github.com/node-red/node-red/wiki/Theme-Configuration-Guide
         * for details.
         */
        //header: {
        //    title: "Node-RED",
        //    image: "/absolute/path/to/header/image", // or null to remove image
        //    url: "http://nodered.org" // url to link to when image is clicked
        //},

        /** The following property can be used to set the default deploy button for the editor.
         * See https://github.com/node-red/node-red/wiki/Theme-Configuration-Guide
         * for details.
         */
        //deployButton: {
        //    type: "simple",
        //    label: "Deploy",
        //    icon: "/absolute/path/to/deploy/icon" // or null to remove icon
        //},

        /** The following property can be used to set the default menu for the editor.
         * See https://github.com/node-red/node-red/wiki/Theme-Configuration-Guide
         * for details.
         */
        //menu: { // Hide unwanted menu items by id. see node-red/red/api/editor/menu.js
        //    "menu-item-import-library": false,
        //    "menu-item-export-library": false,
        //    "menu-item-keyboard-shortcuts": false,
        //    "menu-item-help": {
        //        label: "Alternative Help Link",
        //        url: "http://example.com"
        //    }
        //},

        /** The following property can be used to set the default user menu for the editor.
         * See https://github.com/node-red/node-red/wiki/Theme-Configuration-Guide
         * for details.
         */
        //userMenu: false, // Hide the user menu

        /** The following property can be used to set the default login page for the editor.
         * See https://github.com/node-red/node-red/wiki/Theme-Configuration-Guide
         * for details.
         */
        //login: {
        //    image: "/absolute/path/to/login/image" // or null to remove image
        //},

        /** The following property can be used to set the default logout page for the editor.
         * See https://github.com/node-red/node-red/wiki/Theme-Configuration-Guide
         * for details.
         */
        //logout: {
        //    redirect: "http://example.com" // redirect to this url on logout
        //},

        /** The following property can be used to set the default palette for the editor.
         * See https://github.com/node-red/node-red/wiki/Theme-Configuration-Guide
         * for details.
         */
        //palette: {
        //    editable: true, // Allow/disallow adding/removing nodes
        //    catalogisation: 'online', // 'online' or 'offline'
        //}

        projects: {
            // To enable the Projects feature, set this value to true
            enabled: false,
            workflow: {
                // Set the default workflow mode. Options are 'manual', 'auto'.
                mode: "manual"
            }
        }
    },

/*******************************************************************************
 * Node Settings
 *  - functionGlobalContext
 *  - functionExternalModules
 *  - nodeMessageBufferMaxLength
 ******************************************************************************/

    /** The following property can be used to add global context properties
     * to the Function node.
     * For example, the following would expose the `os` module as `global.get("os")`
     *
     * functionGlobalContext: {
     *    os:require('os')
     * }
     */
    functionGlobalContext: {
        // os:require('os'),
        // jfive:require("johnny-five"),
        // j5board:require("johnny-five").Board({repl:false})
    },

    /** The following property can be used to configure the external modules
     * available to the Function node.
     */
    //functionExternalModules: true,

    /** The following property can be used to set the maximum length of the
     * message buffer used by the debug node.
     */
    //debugMaxLength: 1000,

    /** The following property can be used to set the maximum number of messages
     * that will be displayed in the debug sidebar.
     */
    //debugUseColors: true,

    /** The following property can be used to set the maximum number of messages
     * that will be displayed in the debug sidebar.
     */
    //mqttReconnectTime: 15000,

    /** The following property can be used to set the maximum number of messages
     * that will be displayed in the debug sidebar.
     */
    //serialReconnectTime: 15000,

}

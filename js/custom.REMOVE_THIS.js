/*
 * HACKING TRYIT
 * #############
 * 
 *
 *
 * You may want to replicate Tryit JsSIP demo web into your server and maybe
 * use it with your own modified version of JsSIP. To achieve it follow the
 * following steps.
 *
 *
 *
 * Retrieve Tryip JsSIP web code
 * -----------------------------
 *
 * In your *nix WWW server retrieve the full code and files of Tryit JsSIP
 * by running:
 *
 *   wget -rN http://tryit.jssip.net
 *
 * This will generate a directory "tryit.jssip.net" in the path where you run
 * the command. The option -N means that just modified files in the server
 * will be downloaded (useful if you run such a command in a cron job for
 * having your Tryit app in sync with the official Tryit JsSIP app).
 *
 *
 * Copy this file js/custom.REMOVE_THIS.js to js/custom.js
 * -------------------------------------------------------
 *
 * Edit js/custom.js and set the variables below at your convenience.
 *
 */



// CustomJsSIP allows you indicating Tryit to use a different URL for
// retrieving JsSIP library (useful if you want to use your own).
//
// CustomJsSIP = "js/jssip-devel.js"
// CustomJsSIP = "http://my-server/my-jssip.js"


// Configure in CustomJsSIPSettings your custom settings for JsSIP so the web
// will inmediately login without filling the HTML form.
//
// Parameters with null value means "use parameter default value". Check the
// documentation at http://jssip.net/documentation/devel/api/ua_configuration_parameters/
//
// CustomJsSIPSettings = {
//   uri: null,
//   password: null,
//   ws_servers: null,
//   display_name: null,
//   authorization_user: null,
//   register: null,
//   register_expires: null,
//   no_answer_timeout: null,
//   trace_sip: null,
//   stun_servers: null,
//   turn_servers: null,
//   use_preloaded_route: null,
//   connection_recovery_min_interval: null,
//   connection_recovery_max_interval: null,
//   hack_via_tcp: null,
//   hack_ip_in_contact: null
// };


// Configure in Settings some parameters.
//
// Settings = {
//   videoDisabledByDefault: true
// };
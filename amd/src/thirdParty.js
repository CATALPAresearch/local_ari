/**
 *
 * @author Marc Burchart
 * @version 1.0.0
 * @description A configuration file to import third party js files.
 *
 */
//@ts-ignore
define([], function () {
    //@ts-ignore
    window.requirejs.config({
        paths: {
            //@ts-ignore
            "d3": M.cfg.wwwroot + '/local/ari/lib/d3',
            //@ts-ignore
            "moment": M.cfg.wwwroot + '/local/ari/lib/moment',
        },
        shim: {
            "d3": { exports: "d3" },
            "moment": { exports: "moment" }
        }
    });
});

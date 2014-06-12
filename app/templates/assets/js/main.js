(function (window, $) {
    function SITE() {
        throw ("Can't instantiate!");
    }
    var p = SITE;

    //variables passed through wp_localize_script from functions.php in the nfb_scripts function
    p.VARIABLES = typeof(VARIABLES) == 'undefined' ? null : VARIABLES;

    p.responsive = jRespond(
        [
            {
                label: "handheld",
                enter: 0,
                exit: 767
            },
            {
                label: "tablet",
                enter: 768,
                exit: 979
            },
            {
                label: "laptop",
                enter: 980,
                exit: 1199
            },
            {
                label: "desktop",
                enter: 1200,
                exit: 10000
            }
        ]);

    p.__construct = function(){

    }
    //
    window.SITE = p;
    window.SITE.__construct();
}(window, jQuery.noConflict()));

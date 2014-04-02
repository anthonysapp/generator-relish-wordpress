<?php
/* AJAX FORM SUBMISSION EXAMPLE */
add_action('wp_ajax_form_submit', '<%= themeName %>_form_submit');
add_action('wp_ajax_nopriv_form_submit', '<%= themeName %>_form_submit');

if (!function_exists('<%= themeName %>_form_submit')) {
    function <%= themeName %>_form_submit()
    {
        global $wpdb;
        $vars = (object)$_POST;

        $errors = array();

        /* DO SOME FORM LOGIC HERE */

        $success = count($errors) == 0;
        $response = array("success" => $success, "errors" => $errors);

        die(json_encode($response));
    }
}
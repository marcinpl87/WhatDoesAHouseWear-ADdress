<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Content-Language" content="en">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>SZONs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
        <meta name="description" content="Szons">
        <meta name="msapplication-tap-highlight" content="no">
        <link rel="shortcut icon" href="#">
        <style type="text/css">
            :root {
                --logoUrl: url("<?php
                    echo get_template_directory_uri();
                ?>/assets/images/logo-inverse.png");
            }
        </style>
        <link href="<?php echo get_template_directory_uri(); ?>/bundle.css" rel="stylesheet">
    </head>
    <body>
        <div
            class="app-container app-theme-white body-tabs-shadow fixed-sidebar"
            data-nonce="<?php echo wp_create_nonce("wp_rest"); ?>"
            data-path="<?php echo get_template_directory_uri(); ?>"
        >Wczytywanie...</div>
        <script src="<?php echo get_template_directory_uri(); ?>/bundle.js"></script>
    </body>
</html>

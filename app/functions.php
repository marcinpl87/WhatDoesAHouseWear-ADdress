<?php
include("connect.php");
try {
    $db = new PDO(
        "mysql:dbname=".$dbname.";host=".$servername.";",
        $username,
        $password
    );
} catch (PDOException $e) {
    die("Connection failed: ".$e->getMessage());
}
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->query("SET NAMES UTF8");
const PREFIX = "alior_";

function secureData($data) {
    header("Content-type: text/csv;charset=utf-8");
    if (
        !!wp_verify_nonce(getallheaders()["X-Wp-Nonce"], "wp_rest")
        && !!is_user_logged_in()
    ) {
        echo json_encode(
            array_merge($data(), [
                "status" => "1",
            ]),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
        );
    }
    else {
        echo json_encode([
            "status" => "0",
        ]);
    }
}

add_action("rest_api_init", function() {
    register_rest_route("mapi", "/finance", [
        "methods" => "get",
        "callback" => function() {
            secureData(function() {
                global $db;
                return [
                    "transactions" => $db->query("
                        select id, date_transaction, value, sender, receiver, title, category_id
                        from ".PREFIX."data
                        order by id desc
                    ")->fetchAll(PDO::FETCH_ASSOC),
                    "categories" => $db->query("
                        select *
                        from ".PREFIX."categories
                    ")->fetchAll(PDO::FETCH_ASSOC),
                    "rules" => $db->query("
                        select *
                        from ".PREFIX."rules
                    ")->fetchAll(PDO::FETCH_ASSOC),
                ];
            });
        },
    ]);
});
add_action("rest_api_init", function() {
    register_rest_route("mapi", "/apartments", [
        "methods" => "get",
        "callback" => function() {
            secureData(function() {
                global $db;
                return [
                    "apartments" => $db->query("
                        select *
                        from ".PREFIX."apartments
                        order by id asc
                    ")->fetchAll(PDO::FETCH_ASSOC),
                ];
            });
        },
    ]);
});
add_action("rest_api_init", function() {
    register_rest_route("mapi", "/tenantsOnboarding", [
        "methods" => "get",
        "callback" => function() {
            secureData(function() {
                global $db;
                return [
                    "tenants" => $db->query("
                        select id, name, is_contract, is_deposit, is_1st_rent, is_insurance, is_warranty, is_key, is_protocol
                        from ".PREFIX."tenants
                        where status = 1
                        order by id desc
                    ")->fetchAll(PDO::FETCH_ASSOC),
                ];
            });
        },
    ]);
});
add_action("rest_api_init", function() {
    register_rest_route("mapi", "/tenantsOnboardingInApartment/(?P<apartment>\d+)", [
        "methods" => "get",
        "callback" => function(WP_REST_Request $params) {
            secureData(function() use(&$params) {
                global $db;
                return [
                    "tenants" => $db->query("
                        select id, name, is_contract, is_deposit, is_1st_rent, is_insurance, is_warranty, is_key, is_protocol
                        from ".PREFIX."tenants
                        where status = 1
                        and apartment_id = ".$params->get_params()["apartment"]."
                        order by id desc
                    ")->fetchAll(PDO::FETCH_ASSOC),
                ];
            });
        },
    ]);
});
?>

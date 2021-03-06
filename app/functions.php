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
        !!wp_verify_nonce(getallheaders()["x-wp-nonce"], "wp_rest")
        && !!is_user_logged_in()
    ) {
        echo json_encode(
            array_merge($data(), [
                "session" => "1",
            ]),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
        );
    }
    else {
        echo json_encode([
            "session" => "0",
        ]);
    }
}
function crud($db, $table) {
    add_action("rest_api_init", function() use(&$db, &$table) {
        register_rest_route("mapi", "/".$table, [
            "methods" => "get",
            "callback" => function() use(&$db, &$table) {
                secureData(function() use(&$db, &$table) {
                    return [
                        $table => $db->query("
                            select *
                            from ".PREFIX.$table."
                            order by id desc
                        ")->fetchAll(PDO::FETCH_ASSOC),
                    ];
                });
            },
        ]);
        register_rest_route("mapi", "/".$table."/(?P<id>\d+)", [
            "methods" => "get",
            "callback" => function(WP_REST_Request $params) use(&$db, &$table) {
                secureData(function() use(&$db, &$table, &$params) {
                    return [
                        $table => $db->query("
                            select *
                            from ".PREFIX.$table."
                            where id = ".$params->get_params()["id"]."
                        ")->fetchAll(PDO::FETCH_ASSOC),
                    ];
                });
            },
        ]);
        register_rest_route("mapi", "/".$table, [
            "methods" => "post",
            "callback" => function() use(&$db, &$table) {
                secureData(function() use(&$db, &$table) {
                    return [
                        "status" => $db->prepare("
                            INSERT
                            INTO ".PREFIX.$table."
                            (date_add) VALUES (now())
                        ")->execute(),
                    ];
                });
            },
        ]);
        register_rest_route("mapi", "/".$table."/(?P<id>\d+)", [
            "methods" => "delete",
            "callback" => function(WP_REST_Request $params) use(&$db, &$table) {
                secureData(function() use(&$db, &$table, &$params) {
                    return [
                        "status" => $db->prepare("
                            DELETE
                            FROM ".PREFIX.$table."
                            WHERE id = ".$params->get_params()["id"]
                        )->execute(),
                    ];
                });
            },
        ]);
    });
}

add_action("rest_api_init", function() use(&$db) {
    register_rest_route("mapi", "/finance", [
        "methods" => "get",
        "callback" => function() use(&$db) {
            secureData(function() use(&$db) {
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
    register_rest_route("mapi", "/apartments", [
        "methods" => "get",
        "callback" => function() use(&$db) {
            secureData(function() use(&$db) {
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
    register_rest_route("mapi", "/configByName/(?P<name>\w+)", [
        "methods" => "get",
        "callback" => function(WP_REST_Request $params) use(&$db) {
            secureData(function() use(&$db, &$params) {
                return [
                    "config" => $db->query("
                        select *
                        from ".PREFIX."config
                        where key_name = '".$params->get_params()["name"]."'
                    ")->fetchAll(PDO::FETCH_ASSOC),
                ];
            });
        },
    ]);
    register_rest_route("mapi", "/categorise", [
        "methods" => "post",
        "callback" => function(WP_REST_Request $params) use(&$db) {
            secureData(function() use(&$db, &$params) {
                return [
                    "status" => $db->prepare("
                        UPDATE
                        ".PREFIX."data
                        SET category_id=?
                        WHERE id=?
                    ")->execute([
                        $params->get_body_params()["category"],
                        $params->get_body_params()["id"],
                    ]),
                ];
            });
        },
    ]);
    register_rest_route("mapi", "/rules", [
        "methods" => "post",
        "callback" => function(WP_REST_Request $params) use(&$db) {
            secureData(function() use(&$db, &$params) {
                return [
                    "status" => $db->prepare("
                        INSERT
                        INTO ".PREFIX."rules
                        (transaction_column, relation, value, cateogry_id)
                        VALUES (?,?,?,?)
                    ")->execute([
                        $params->get_body_params()["transaction_column"],
                        $params->get_body_params()["relation"],
                        $params->get_body_params()["value"],
                        $params->get_body_params()["category_id"],
                    ]),
                ];
            });
        },
    ]);
    register_rest_route("mapi", "/transactions", [
        "methods" => "post",
        "callback" => function(WP_REST_Request $params) use(&$db) {
            $prep = $db->prepare("INSERT INTO ".PREFIX."data (
                date_timestamp,
                date_transaction,
                date_accounting,
                sender,
                receiver,
                title,
                value,
                value2
            ) VALUES (?,?,?,?,?,?,?,?)");
            $db->beginTransaction();
            try {
                foreach($params->get_body_params()["data"] as &$row) {
                    $prep->execute([
                        date("Y-m-d H:i:s", strtotime($row[0])),
                        $row[0],
                        $row[0],
                        $row[2],
                        $row[3],
                        $row[4],
                        str_replace(",", ".", $row[1]),
                        str_replace(",", ".", $row[1])
                    ]);
                }
                $db->commit();
                secureData(function() use(&$db, &$params) {
                    return [
                        "status" => true,
                    ];
                });
            } catch (Exception $e) {
                $db->rollBack();
                secureData(function() use(&$db, &$params) {
                    return [
                        "status" => false,
                    ];
                });
            }
        },
    ]);
});
add_action("rest_api_init", function() {
    register_rest_route("mapi", "/tenants", [
        "methods" => "get",
        "callback" => function() {
            secureData(function() {
                global $db;
                return [
                    "tenants" => $db->query("
                        select *
                        from ".PREFIX."tenants
                        where status = 1
                        order by id desc
                    ")->fetchAll(PDO::FETCH_ASSOC),
                ];
            });
        },
    ]);
    register_rest_route("mapi", "/tenants/(?P<id>\d+)", [
        "methods" => "get",
        "callback" => function(WP_REST_Request $params) {
            secureData(function() use(&$params) {
                global $db;
                return [
                    "tenant" => array(
                        $db->query("
                            select *
                            from ".PREFIX."tenants
                            where id = ".$params->get_params()["id"]."
                            and status = 1
                        ")->fetchAll(PDO::FETCH_ASSOC),
                        $db->query("
                            select val
                            from ".PREFIX."config
                            where key_name = \"contract\"
                        ")->fetchAll(PDO::FETCH_ASSOC)
                    ),
                ];
            });
        },
    ]);
    register_rest_route("mapi", "/tenantsInApartment/(?P<apartment>\d+)", [
        "methods" => "get",
        "callback" => function(WP_REST_Request $params) {
            secureData(function() use(&$params) {
                global $db;
                return [
                    "tenants" => $db->query("
                        select *
                        from ".PREFIX."tenants
                        where status = 1
                        and apartment_id = ".$params->get_params()["apartment"]."
                        order by id desc
                    ")->fetchAll(PDO::FETCH_ASSOC),
                ];
            });
        },
    ]);
    register_rest_route("mapi", "/tenantsStats", [
        "methods" => "get",
        "callback" => function() {
            secureData(function() {
                global $db;
                return [
                    "stats" => $db->query("
                        select apartment_id, COUNT(apartment_id) as count, SUM(rent) as rents
                        from ".PREFIX."tenants
                        where status = 1
                        Group By apartment_id
                    ")->fetchAll(PDO::FETCH_ASSOC),
                ];
            });
        },
    ]);
});
crud($db, "fixes");
crud($db, "mails");
crud($db, "config");
?>

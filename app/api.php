<?php
include("connect.php");
error_reporting(E_ALL);
ini_set("display_errors", "On");
header("Content-type:application/json;charset=utf-8");
try {
    $db = new PDO("mysql:dbname=".$dbname.";host=".$servername.";", $username, $password);
} catch (PDOException $e) {
    die("Connection failed: ".$e->getMessage());
}
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->query("SET NAMES UTF8");
define("PREFIX", "alior_");
if ($_GET) {
    if ($_GET["r"] == "finance") {
        echo json_encode(
            array(
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
                ")->fetchAll(PDO::FETCH_ASSOC)
            ),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
        );
    }
    else if (isset($_GET["mode"])) {
        echo json_encode(
            array(
                $db
                    ->prepare("UPDATE ".PREFIX."".$_GET["r"]." SET ".$_GET["field"]."=? WHERE id=?")
                    ->execute([$_GET["val"], $_GET["id"]])
            ),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
        );
    }
    else if ($_GET["r"] == "tenants") {
        if (isset($_GET["id"])) {
            echo json_encode(
                array(
                    $db->query("
                        select *
                        from ".PREFIX."tenants
                        where id = ".$_GET["id"]."
                    ")->fetchAll(PDO::FETCH_ASSOC),
                    $db->query("
                        select val
                        from ".PREFIX."config
                        where key_name = \"contract\"
                    ")->fetchAll(PDO::FETCH_ASSOC)
                ),
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
            );
        }
        else if (isset($_GET["apartmentId"])) {
            echo json_encode(
                $db->query("
                    select id, name, apartment_id, room_id, rent, email, sender_name
                    from ".PREFIX."tenants
                    where apartment_id = ".$_GET["apartmentId"]."
                    order by id desc
                ")->fetchAll(PDO::FETCH_ASSOC),
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
            );
        }
        else {
            echo json_encode(
                $db->query("
                    select id, name, apartment_id, room_id, rent, email, sender_name
                    from ".PREFIX."tenants
                    order by id desc
                ")->fetchAll(PDO::FETCH_ASSOC),
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
            );
        }
    }
    else if ($_GET["r"] == "fixes" || $_GET["r"] == "mails") {
        if (isset($_GET["task"]) && $_GET["task"] == "add") {
            echo json_encode(array("status" => $db
                ->prepare("INSERT INTO ".PREFIX.$_GET["r"]." (date_add) VALUES (now())")
                ->execute()));
        }
        else if (isset($_GET["task"]) && $_GET["task"] == "del") {
            echo json_encode(array("status" => $db
                ->prepare("DELETE FROM ".PREFIX.$_GET["r"]." WHERE id = ".$_GET["id"])
                ->execute()));
        }
        else if (isset($_GET["id"])) {
            echo json_encode(
                $db->query("
                    select *
                    from ".PREFIX.$_GET["r"]."
                    where id = ".$_GET["id"]."
                ")->fetchAll(PDO::FETCH_ASSOC),
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
            );
        }
        else {
            echo json_encode(
                $db->query("
                    select *
                    from ".PREFIX.$_GET["r"]."
                    order by id desc
                ")->fetchAll(PDO::FETCH_ASSOC),
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
            );
        }
    }
    else if ($_GET["r"] == "config") {
        if (isset($_GET["task"]) && $_GET["task"] == "add") {
            echo json_encode(array("status" => $db
                ->prepare("INSERT INTO ".PREFIX."config () VALUES ()")
                ->execute()));
        }
        else if (isset($_GET["task"]) && $_GET["task"] == "del") {
            echo json_encode(array("status" => $db
                ->prepare("DELETE FROM ".PREFIX."config WHERE id = ".$_GET["id"])
                ->execute()));
        }
        else if (isset($_GET["id"])) {
            echo json_encode(
                $db->query("
                    select *
                    from ".PREFIX."config
                    where id = ".$_GET["id"]."
                ")->fetchAll(PDO::FETCH_ASSOC),
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
            );
        }
        else {
            echo json_encode(
                $db->query("
                    select *
                    from ".PREFIX."config
                    order by id desc
                ")->fetchAll(PDO::FETCH_ASSOC),
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
            );
        }
    }
    else if ($_GET["r"] == "apartments") {
        echo json_encode(
            $db->query("
                select *
                from ".PREFIX."apartments
                order by id asc
            ")->fetchAll(PDO::FETCH_ASSOC),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
        );
    }
    else if ($_GET["r"] == "tenantsInApartment") {
        echo json_encode(
            $db->query("
                select apartment_id, COUNT(apartment_id) as count, SUM(rent) as rents
                from ".PREFIX."tenants
                Group By apartment_id
            ")->fetchAll(PDO::FETCH_ASSOC),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
        );
    }
    else if ($_GET["r"] == "rules") {
        echo json_encode(array("status" => $db
            ->prepare("INSERT INTO ".PREFIX."rules (transaction_column, relation, value, cateogry_id) VALUES (?,?,?,?)")
            ->execute([$_GET["transaction_column"], $_GET["relation"], $_GET["value"], $_GET["category_id"]])));
    }
    else if ($_GET["r"] == "categorise") {
        echo json_encode(
            array(
                $db
                    ->prepare("UPDATE ".PREFIX."data SET category_id=? WHERE id=?")
                    ->execute([$_GET["cat"], $_GET["id"]])
            ),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK
        );
    }
    else if ($_GET["r"] == "charts") {
        echo $db->query("
            select val
            from ".PREFIX."config
            where key_name = \"charts\"
        ")->fetchAll(PDO::FETCH_ASSOC)[0]["val"];
    }
}
else if ($_POST) {
    if ($_POST["r"] == "transactions") {
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
            foreach($_POST["data"] as &$row) {
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
            echo json_encode(array("status" => true));
        } catch (Exception $e) {
            $db->rollBack();
            echo json_encode(array("status" => false));
        }
    }
}
?>

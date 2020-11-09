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
    else if ($_GET["r"] == "tenantsOnboarding") {
    }
    else if ($_GET["r"] == "tenants") {
    }
    else if ($_GET["r"] == "fixes" || $_GET["r"] == "mails") {
    }
    else if ($_GET["r"] == "config") {
    }
    else if ($_GET["r"] == "apartments") {
    }
    else if ($_GET["r"] == "tenantsInApartment") {
    }
    else if ($_GET["r"] == "rules") {
    }
    else if ($_GET["r"] == "categorise") {
    }
    else if ($_GET["r"] == "charts") {
    }
}
else if ($_POST) {
}
?>

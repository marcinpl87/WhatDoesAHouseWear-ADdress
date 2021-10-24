<?php
include(dirname(__FILE__)."/connect.php");
include(dirname(__FILE__)."/../../../wp-config.php");

const PREFIX = "alior_";

function notify($db, $msg) {
    global $smsEmail;
    global $smsNumber;
    mail(
        $smsEmail,
        "Info",
        $msg
    );
    $db
        ->prepare("
            INSERT INTO sms_out (msisdn, body)
            VALUES ('".$smsNumber."', '".$msg."')
        ")
        ->execute();
}

try {
    $dbTask = new PDO(
        "mysql:dbname=".DB_NAME.";host=".DB_HOST.";",
        DB_USER,
        DB_PASSWORD
    );
} catch (PDOException $e) {
    die("Connection failed: ".$e->getMessage());
}
$dbTask->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbTask->query("SET NAMES UTF8");
try {
    $dbSms = new PDO(
        "mysql:dbname=".$smsDbname.";host=".$smsServername.";",
        $smsUsername,
        $smsPassword
    );
} catch (PDOException $e) {
    die("Connection failed: ".$e->getMessage());
}
$dbSms->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbSms->query("SET NAMES UTF8");

$tasks = $dbTask->query("
    select *
    from ".PREFIX."tasks
    where status = 'Todo'
    and date_event != '0000-00-00 00:00:00'
")->fetchAll(PDO::FETCH_ASSOC);
foreach ($tasks as $task) {
    if (
        strtotime(explode(
            " ",
            $task["date_event"]
        )[0]." ".$task["hour"].":00")
        < strtotime(date("Y-m-d H:i:s"))
    ) { //notify about starting task
        notify(
            $dbSms,
            "Rozpocznij zadanie ".$task["title"]
        );
    }
}
$tasks = $dbTask->query("
    select *
    from ".PREFIX."tasks
    where status = 'Doing'
    and date_event != '0000-00-00 00:00:00'
")->fetchAll(PDO::FETCH_ASSOC);
foreach ($tasks as $task) {
    if (
        (strtotime(explode(
            " ",
            $task["date_event"]
        )[0]." ".$task["hour"].":00") + 3600)
        < strtotime(date("Y-m-d H:i:s"))
    ) { //notify about finishing task
        notify(
            $dbSms,
            "Zakoncz zadanie ".$task["title"]
        );
    }
}
?>

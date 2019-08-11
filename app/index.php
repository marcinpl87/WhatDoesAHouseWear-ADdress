<?php
if ($_POST) {
    include("connect.php");
    try {
        $db = new PDO('mysql:dbname='.$dbname.';host='.$servername.';', $username, $password);
    } catch (PDOException $e) {
        die('Connection failed: '.$e->getMessage());
    }
    $db->query("SET NAMES UTF8");
    $salt = $db->query('
        select *
        from alior_users
        where email='.$db->quote($_POST["email"]).'
    ')->fetchAll(PDO::FETCH_ASSOC)[0]["salt"];
    $user = $db->query('
        select id
        from alior_users
        where email='.$db->quote($_POST["email"]).'
        and pass='.$db->quote(hash('sha512', $salt.$_POST["password"])).'
    ')->fetchAll(PDO::FETCH_ASSOC)[0];
    if (isset($user)) {
        setcookie("szonSession", $_POST["email"], time() + (86400), "/"); // 86400 = 1 day
        include("app.php");
    }
    else {
        $error = true;
        include("login.php");
    }
}
elseif(isset($_COOKIE["szonSession"])) {
    include("app.php");
}
else {
    include("login.php");
}
?>

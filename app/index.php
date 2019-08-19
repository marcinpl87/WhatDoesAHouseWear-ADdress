<?php
include("connect.php");
if ($_POST) {
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
elseif($_GET["pass"] == $password && $_GET["email"]) {
    function generateSalt($max = 64) {
        $characterList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?";
        $i = 0;
        $salt = "";
        while ($i < $max) {
            $salt .= $characterList{mt_rand(0, (strlen($characterList) - 1))};
            $i++;
        }
        return $salt;
    }
    try {
        $db = new PDO('mysql:dbname='.$dbname.';host='.$servername.';', $username, $password);
    } catch (PDOException $e) {
        die('Connection failed: '.$e->getMessage());
    }
    $db->query("SET NAMES UTF8");
    $userSalt = generateSalt();
    $userPass = generateSalt(10);
    $pwd = hash('sha512', $userSalt.$userPass);
    echo $_GET["email"]."<br />".$userSalt."<br />".$userPass."<br />".$pwd."<br />";
    var_dump($db
        ->prepare("INSERT INTO alior_users (email, salt, pass) VALUES (?,?,?)")
        ->execute([$_GET["email"], $userSalt, $pwd]));
}
elseif(isset($_COOKIE["szonSession"])) {
    include("app.php");
}
else {
    include("login.php");
}
?>

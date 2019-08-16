<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <title>Login</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://getbootstrap.com/docs/4.0/examples/floating-labels/floating-labels.css" rel="stylesheet">
    <style>
        .mb-4 img.mb-4 {
            margin: -80px 0 -80px!important;
        }
    </style>
</head>
<body>
    <form class="form-signin" action="/" method="post">
        <div class="text-center mb-4">
            <img class="mb-4" src="./assets/images/login.gif" width="100%" />
            <?php if($error): ?>
                <h1 class="h3 mb-3 font-weight-normal"><code>Błąd: niepoprawny email lub hasło</code></h1>
            <?php endif; ?>
        </div>
        <div class="form-label-group">
            <input type="email" name="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="">
            <label for="inputEmail">Email</label>
        </div>
        <div class="form-label-group">
            <input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required="">
            <label for="inputPassword">Hasło</label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Zaloguj</button>
    </form>
</body>
</html>

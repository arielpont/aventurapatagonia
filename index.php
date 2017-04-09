<?php

  session_name("aventurapatagonia");
  session_start();
  require_once('php/facebook-php-sdk-v4-5.0.0/autoload.php');
  
  $fb = new Facebook\Facebook([
      'app_id' => '1002078526589298',
      'app_secret' => '806f7a062b9579fada34b55698196986',
      'default_graph_version' => 'v2.8',
  ]);

  $helper = $fb->getRedirectLoginHelper();
  $permissions = ['email', 'public_profile', 'user_friends']; // optional
  $loginUrl = $helper->getLoginUrl('http://www.aeidos.com.ar/aventurapatagonia/login-callback.php', $permissions);

  // echo '<a href="' . $loginUrl . '">Log in with Facebook!</a>';
?>
<!DOCTYPE html>
<html>
  <head>
    <title>AVENTURA PATAGONIA</title>
    <meta charset="UTF-8">

    <!-- CSS FILES -->
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
    <div class="wrapper-index">

      <div class="block-up">
        <div class="logo"></div>
        <div class="welcome-txt">Conectate con tu red favorita y empeza a disfrutar</div>
      </div>

      <div class="block-down">
        <div class="btn">
          <div class="facebook"></div>
          <a href="<?php echo $loginUrl ?>"><span>Conectate con Facebook</span></a>
        </div>
      </div>

    </div>
  </body>
</html>
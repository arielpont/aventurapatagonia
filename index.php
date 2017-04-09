<?php

  session_name("aventurapatagonia");
  session_start();
  require_once('php/facebook-php-sdk-v4-5.0.0/autoload.php');
  
  $fb = new Facebook\Facebook([
      'app_id' => '1002078526589298',
      'app_secret' => '806f7a062b9579fada34b55698196986',
      'default_graph_version' => 'v2.4',
  ]);

  $helper = $fb->getRedirectLoginHelper();
  $permissions = ['email', 'public_profile', 'user_friends']; // optional
  $loginUrl = $helper->getLoginUrl('localhost/aventurapatagonia/dni.php', $permissions);

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
    <div class="wrapper">
      <div class="block-up">
        <div class="logo"></div>
        <a href="<?php echo $loginUrl ?>"><div class="btn-login"><span>LOG IN WITH FACEBOOK</span></div></a>
      </div>
    </div>
  </body>
</html>
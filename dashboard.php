<?php

  session_name("aventurapatagonia");
  session_start();
  
  /*$root=pathinfo($_SERVER['SCRIPT_FILENAME']);
  define ('BASE_FOLDER', basename($root['aventurapatagonia']));
  define ('SITE_ROOT',    realpath(dirname(__FILE__)));
  define ('SITE_URL',    'http://'.$_SERVER['HTTP_HOST'].'/aventurapatagonia'.BASE_FOLDER);
  define ('ERROR_URL',    'http://'.$_SERVER['HTTP_HOST'].'/aventurapatagonia/error404.php');*/

  $fb_access_token = $_SESSION['fb_access_token'];
  
  //CHEQUEO SI ESTA LOGEUADO
  if($fb_access_token == ''){
    //ENVIO A LOGUEARSE
    /*header('Location: '.SITE_URL);*/
  }else{
    //LOGUEADO. OK!
    require_once('php/facebook-php-sdk-v4-5.0.0/autoload.php');
    
    $fb = new Facebook\Facebook([  
        'app_id' => '1002078526589298',  
        'app_secret' => '806f7a062b9579fada34b55698196986',  
        'default_graph_version' => 'v2.8',  
    ]);  
      
    try {
      // Returns a :Facebook\FacebookResponse` object
      $response = $fb->get('/me', $fb_access_token);
    } catch(Facebook\Exceptions\FacebookResponseException $e) {
      echo 'Graph returned an error: ' . $e->getMessage();
      header('Location: '.ERROR_URL);
      exit;
    } catch(Facebook\Exceptions\FacebookSDKException $e) {
      echo 'Facebook SDK returned an error: ' . $e->getMessage();
      header('Location: '.ERROR_URL);
      exit;
    }

    $user = $response->getGraphUser();
    $userIdFacebook = $user['id'];
    $userName = $user['name'];

    if(strlen($userName) >= 22){
      $userNameshort = substr($userName, 0, 22)."...";
    }else{
      $userNameshort = $userName;
    }
  }
?>

<!DOCTYPE html>
<html>
  <head>
    <title>AVENTURA PATAGONIA</title>
    <meta charset="UTF-8">

    <!--JS-->
	<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <script src="js/cookie/src/cookie.js"></script>
  <script src="js/dashboard.js"></script>

    <!-- CSS FILES -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="js/barindicator/barIndicator/css/bi-style.css">
  </head>
  <body>
    <div class="wrapper-dashboard">
      <div class="logo"></div>
      <div class="block-kms">
        <div class="black-layout"></div>
    	  <div class="profile-img" style='background:url("https://graph.facebook.com/<?php echo $userIdFacebook;?>/picture?width=200&height=200")'></div>
        <div class="txt">Km</div>
        <div class="km-bar">
          <div class="num">1.246</div>
        </div>
      </div>
      <div class="parametros">
      
        <div class="box">
          <div class="title">Refugios</div>
          <div class="num">3/21</div>
        </div>

        <div class="line"></div>

        <div class="box">
          <div class="title">Cervezas</div>
          <div class="num">26</div>
        </div>

        <div class="line"></div>

        <div class="box">
          <div class="title">Variedad</div>
          <div class="num">2/6</div>
        </div>

        <div class="line"></div>

        <div class="box">
          <div class="title">Shares</div>
          <div class="num">14</div>
        </div>

      </div>
    </div>
  </body>
</html>
<?php

	session_name("aventurapatagonia");
	session_start();
	
	$root=pathinfo($_SERVER['SCRIPT_FILENAME']);
	define ('BASE_FOLDER', basename($root['aventurapatagonia']));
	define ('SITE_ROOT',    realpath(dirname(__FILE__)));
	define ('SITE_URL',    'http://'.$_SERVER['HTTP_HOST'].'/aventurapatagonia'.BASE_FOLDER);
	define ('ERROR_URL',    'http://'.$_SERVER['HTTP_HOST'].'/aventurapatagonia/error404.php');

	$fb_access_token = $_SESSION['fb_access_token'];
	
	//CHEQUEO SI ESTA LOGEUADO
	if($fb_access_token == ''){
		//ENVIO A LOGUEARSE
		header('Location: '.SITE_URL);
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

		/** CONNECT DB **/
		include('php/inc.mysql.php');




		/** CHEQUEO SI EL USUARIO YA ESTA EN LA DB **/
		$checkUser_qr = db_select("SELECT iduser, idfacebook, fullname, biography FROM user WHERE idfacebook ='$userIdFacebook'");

		if($userIdFacebook == $checkUser_qr[0]['idfacebook']){
			//EXISTE EL USUARIO. CHEQUEO SI ACTUALIZÓ DATOS EN FACEBOOK.
			if($userName == $checkUser_qr[0]['fullname']){
				//DATOS ACTUALIZADOS
			}else{
				//DATOS DEZACTUALIZADOS. ACTUALIZO NOMBRE.
				$updateUser_qr = db_query("UPDATE user SET fullname='$userName' WHERE iduser='$checkUser_qr[0]['iduser']'");
			}
		}else{
			//NO EXISTE EL USUARIO. LO AGREGO A LA DB.
			$addUser_qr = db_query("INSERT INTO user (idfacebook, fullname) VALUES ('$userIdFacebook', '$userName')");
		}




		$biography = "";
		if($checkUser_qr[0]['biography'] == ''){
			$biography = "Complete your description...";
		}else{
			$biography = $checkUser_qr[0]['biography'];
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
	<script src="js/mask/src/jquery.mask.js"></script>
	<script src="js/dni.js"></script>

    <!-- CSS FILES -->
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
    <div class="wrapper-dni">
    	<div class="logo"></div>
    	<div class="profile-img" style='background:url("http://graph.facebook.com/<?php echo $userIdFacebook;?>/picture?type=square")'></div>
    	<div class="txt">Hola <?php echo $userName ?> , ingresa tu D.N.I</div>
    	<input id="dni" type="text" name="dni">
    	<div id="btn-dni">OBTEN&Eacute; TU PASAPORTE</div>
    </div>
  </body>
</html>
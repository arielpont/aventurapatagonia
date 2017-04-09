<?php

	session_name("eidosmap");
	session_start();
	
	$root=pathinfo($_SERVER['SCRIPT_FILENAME']);
	define ('BASE_FOLDER', basename($root['map']));
	define ('SITE_ROOT',    realpath(dirname(__FILE__)));
	define ('SITE_URL',    'http://'.$_SERVER['HTTP_HOST'].'/map'.BASE_FOLDER);
	define ('ERROR_URL',    'http://'.$_SERVER['HTTP_HOST'].'/map/error404.php');

	$fb_access_token = $_SESSION['fb_access_token'];
	
	//CHEQUEO SI ESTA LOGEUADO
	if($fb_access_token == ''){
		//ENVIO A LOGUEARSE
		header('Location: '.SITE_URL);
	}else{
		//LOGUEADO. OK!
		require_once('php/facebook-php-sdk-v4-5.0.0/autoload.php');
		
		$fb = new Facebook\Facebook([  
			  'app_id' => '451696101682859',  
			  'app_secret' => '1473439ba816480fe82a9e84e6b6bcf1',  
			  'default_graph_version' => 'v2.5',  
		]);  
		  
		try {
			// Returns a :Facebook\FacebookResponse` object
			$response = $fb->get('/me', $fb_access_token);
		} catch(Facebook\Exceptions\FacebookResponseException $e) {
			//echo 'Graph returned an error: ' . $e->getMessage();
			header('Location: '.ERROR_URL);
			exit;
		} catch(Facebook\Exceptions\FacebookSDKException $e) {
			//echo 'Facebook SDK returned an error: ' . $e->getMessage();
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
			$addUser_qr = db_query("INSERT INTO user(idfacebook, fullname) VALUES ('$userIdFacebook', '$userName')");
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
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="description" content="EIDOS">
		<meta name="Language" content="English">
		<meta name="Subject" content="EIDOS">
		<meta name="Revisit" content="1 day">
		<meta name="Distribution" content="Global">
		<meta name="author" content="EIDOS">
		<title>EIDOS | MAP</title>

		<meta property="og:title" content="EIDOS">
		<meta property="og:image" content="http://www.aeidos.com.ar/img/logo-home.png">
		<meta property="og:description" content="EIDOS">
		<meta property="og:url" content="http://www.aeidos.com.ar">
		<meta property="og:site_name" content="EIDOS">

		<meta name="twitter:card" content="EIDOS">
		<meta name="twitter:site" content="www.aeidos.com.ar">
		<meta name="twitter:title" content="EIDOS">
		<meta name="twitter:description" content="EIDOS">
		<meta name="twitter:image" content="http://www.aeidos.com.ar/img/logo-home.png">

		<meta name="description" content="EIDOS">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="shortcut icon" href="img/favicon.png">
		
		<!-- CSS FILES -->
		<link rel="stylesheet" href="css/style.css" />
		<link rel="stylesheet" href="css/leaflet.css" />
	</head>
	<body onload="initialize()">
		<div class="usermenu">
			<div class="wrapper">
				<div class="pic" style='background:url("https://graph.facebook.com/<?php echo $userIdFacebook;?>/picture?width=40&height=40")'></div>
				<div class="content">
					<div class="name"><span><?php echo $userName ?></span></div>
					<div class="btn-menu"><div class="arrow"></div></div>
					<div class="clear"></div>
					<div class="menu">
						<div class="top-shadow"></div>
						<ul>
							<li id="btn-profile"><span>PROFILE</span><div class="icon profile"></div></li>
							<li id="btn-projects"><span>PROJECTS</span><div class="icon projects"></div></li>
							<li id="btn-contacts"><span>CONTACTS</span><div class="icon contacts"></div></li>
							<li id="btn-aboutus"><span>ABOUT US</span><div class="icon aboutus"></div></li>
							<li><a href="logout.php?action=logout"><span>LOG OUT</span><div class="icon logout"></div></a></li>
						</ul>
						<div class="bottom-border"></div>
					</div>
				</div>
				
			</div>
		</div>

		<div class="controls">
			<div class="locate-point"></div>
		</div>
		
		<div id="map"></div>

		<div class="profile-panel">
			<div class="close-btn"></div>
			<div class="name"><span><?php echo $userNameshort;?></span></div>
			<div class="pic" style='background:url("https://graph.facebook.com/<?php echo $userIdFacebook;?>/picture?width=200&height=200")'></div>
			<div class="bio">
				<div class="title"><span>BIO</span></div>
				<div class="btn-edit"></div>
				<div class="btn-save-cancel">
					<span id="save-bio" onclick="updateBiotxt('<?php echo $checkUser_qr[0]['iduser']?>')">save</span>  |  <span id="cancel-bio">cancel</span>
				</div>
				<textarea id="bio-textarea" class="textarea" maxlength="400" disabled><?php echo $biography;?></textarea>
			</div>
			<div class="dash-bar"></div>
			<div class="social-networks">
				<a href="https://www.facebook.com/<?php echo $userIdFacebook;?>" target="_blank">
					<div class="icon facebook"></div>
				</a>
			</div>
		</div>

		<div class="profile-panel-other">
			<div class="close-btn-2"></div>
			<div class="name-2"><span></span></div>
			<div class="pic-2" style='background:url("")'></div>
			<div class="bio">
				<div class="title"><span>BIO</span></div>
				<textarea id="bio-textarea-2" class="textarea" maxlength="400" disabled></textarea>
			</div>
			<div class="dash-bar"></div>
			<div class="social-networks-2">
				<a id="social-user-facebook" href="https://www.facebook.com/" target="_blank">
					<div class="icon facebook"></div>
				</a>
			</div>
		</div>
		
		<script src="js/jquery-1.11.3.min.js"></script>
		<script src="js/jquery-ui.min.js"></script>
		<script src="js/jquery.easing.compatibility.js"></script>
		<script src="js/jquery.elastic.source.js"></script>
		<script src="js/leaflet.js"></script>
		<!-- <script src="v2/api.js"></script> -->
		<script src="js/config.js"></script>
		<script src="js/ajax.js"></script>

		<script type="text/javascript">
			function initialize() {

				//LEAFLET

				var bounds = new L.LatLngBounds(new L.LatLng(85, -190), new L.LatLng(-85, 190));
				var map = L.map('map', {
					maxBounds: bounds,
					maxBoundsViscosit: 1.0,
					noWrap: true,
				}).setView([0, 0], 2);

				L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXJpZWxwb250IiwiYSI6ImNpbXFhNGl3ZTAwZWF1cGtraHU0a3R4NmMifQ.Goz96vRhWYhwzchiQnYRuw', {
					maxZoom: 18,
					minZoom: 2,

					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="http://mapbox.com">Mapbox</a>',
					id: 'mapbox.streets'
				}).addTo(map);

				//CLASE DE ICON
				var UserIcon = L.Icon.extend({
			    options: {
			        iconSize:     [35, 35],
			        shadowSize:   [35, 35],
			        shadowAnchor: [0, -21],
			        popupAnchor:  [0, -21]
				    }
				});


				/** CAMBIAR COORDENADAS DEL USUARIO **/
				var cambiarCoor = false;

			    $('.locate-point').click(function() {
			    	if(cambiarCoor == false){
			    		//ACTIVO FUNCIÓN
			    		cambiarCoor = true;
			            $('.locate-point').css('background-position', '-32px 0px');
			            $('#map').css('cursor', 'crosshair');

			            //ZOOM Y UBICO UBICACIOÓN ACTUAL
						var actCoors = getUserLocation('<?php echo $checkUser_qr[0]['iduser']?>');
						var actCoors = actCoors.split(',');
			    		var actCoorX = actCoors[0];
			    		var actCoorY = actCoors[1].substr(2);

			            map.setView([actCoorX, actCoorY], 10, {
			            	animation: true,
			            	duration: 1.0,
			            	easeLinearity: 1.0,
			            	noMoveStart: false
			            });

			    	}else{
			    		//DESACTIVO FUNCIÓN
			    		cambiarCoor = false;
			    		$('.locate-point').css('background-position', '0px 0px');
			    		$('#map').css('cursor', 'move');
			    	}
			    });

			    /** FUNCIÓN PARA RE-LOCALIZAR **/
			    map.on('click', function(e) {
			    	if(cambiarCoor == false){
			    		//FUNCION DESACTIVADA
			    	}else{
			    		//RE-LOCALIZAR
			    		var coordenadas = e.latlng.toString();
			    		coordenadas = coordenadas.split("LatLng").pop();
			    		if (confirm('You are updating you location to: '+coordenadas+ '\nAre you sure you want to make this change?')) {
			    			var coor = coordenadas.split(',');
			    			var coorX = coor[0].substr(1);
			    			var coorY = coor[1].slice(0,-1);
						    
						    updateUserLocation(coorX, coorY, '<?php echo $checkUser_qr[0]['iduser']?>', '<?php echo $checkUser_qr[0]['idfacebook']?>', '<?php echo $checkUser_qr[0]['fullname']?>');							
							
							//CREO NUEVO PUNTO
							setTimeout(function () {
							   	L.marker([coorX, coorY], {icon: new UserIcon({iconUrl: 'https://graph.facebook.com/<?php echo $checkUser_qr[0]['idfacebook']?>/picture?width=35&height=35'})}).addTo(map)
								.bindPopup("<b onclick='showUserinfo('<?php echo $checkUser_qr[0]['idfacebook']?>')><?php echo $checkUser_qr[0]['fullname']?></b>").closePopup();
							  }, 1500);
						} else {
						    //NO
						}
					}
				});


			<?php
				/** TRAIGO INFO DE TODOS LOS USUARIOS **/
				$selectUsersInfo = db_select("SELECT iduser, idfacebook, fullname, coorX, coorY FROM user");

				/** TOMO LA CANTIDAD DE DATOS **/
				$selectUsersInfo_lenght = count($selectUsersInfo);

				/** CHEQUEO SI HAY DATA **/
				if($selectUsersInfo_lenght == null || $selectUsersInfo_lenght == ''){
					//NO HAY USUARIOS REGISTRADOS
				}else{
					//HAY USUARIOS REGISTRADOS. IMPRIMO DATA
					for ($indice = 0; $indice <= $selectUsersInfo_lenght; $indice++) {
						if($selectUsersInfo[$indice]['coorX'] == null || $selectUsersInfo[$indice]['coorX'] == '' || $selectUsersInfo[$indice]['coorY'] == null || $selectUsersInfo[$indice]['coorY'] == ''){
							//NO TIENE COORDENADAS PASO AL SIGUIENTE
						}else{
							//EXISTE USUARIO
							$UcoorX = $selectUsersInfo[$indice]['coorX'];
							$UcoorY = $selectUsersInfo[$indice]['coorY'];
							$Ufullname = $selectUsersInfo[$indice]['fullname'];
							$Uidfacebook = $selectUsersInfo[$indice]['idfacebook'];
							$Uiduser = $selectUsersInfo[$indice]['iduser'];
						    ?>
							    //CREO ICONO DE USUARIO
								L.marker([<?php echo $UcoorX;?>, <?php echo $UcoorY;?>], {icon: new UserIcon({iconUrl: 'https://graph.facebook.com/<?php echo $Uidfacebook;?>/picture?width=35&height=35'})}).addTo(map)
								.bindPopup("<b onclick='showUserinfo(<?php echo $Uiduser;?>)'><?php echo $Ufullname;?></b>").closePopup();
						    <?php
						}
					}
				}
			?>
			}
		</script>
	</body>
</html>
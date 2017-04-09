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
    <div class="wrapper-dashboard">
    	<div class="profile-img" style='background:url("https://graph.facebook.com/<?php echo $userIdFacebook;?>/picture?width=200&height=200")'></div>
    	<div class="txt">Ingresa tu D.N.I</div>
    	<input id="dni" type="text" name="dni">
    	<div id="btn-dni">OBTEN&Eacute; TU PASAPORTE</div>
    </div>
  </body>
</html>
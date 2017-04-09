<?php
	
	session_name("aventurapatagonia");
	session_start();

	$root=pathinfo($_SERVER['SCRIPT_FILENAME']);
	define ('BASE_FOLDER', basename($root['aventurapatagonia']));
	define ('SITE_ROOT',    realpath(dirname(__FILE__)));
	define ('SITE_URL',    'http://'.$_SERVER['HTTP_HOST'].'/aventurapatagonia'.BASE_FOLDER);
	define ('ERROR_URL',    'http://'.$_SERVER['HTTP_HOST'].'/aventurapatagonia/error404.php');

	require_once('php/facebook-php-sdk-v4-5.0.0/autoload.php');

	$fb = new Facebook\Facebook([  
		  'app_id' => '1002078526589298',  
		  'app_secret' => '806f7a062b9579fada34b55698196986',  
		  'default_graph_version' => 'v2.8',  
		]);  
	  
	$helper = $fb->getRedirectLoginHelper();  
	  
	try {  
		$accessToken = $helper->getAccessToken();  
	} catch(Facebook\Exceptions\FacebookResponseException $e) {  
		// When Graph returns an error  
		//echo 'Graph returned an error: ' . $e->getMessage();
		header('Location: '.ERROR_URL);
		exit;  
	} catch(Facebook\Exceptions\FacebookSDKException $e) {  
		// When validation fails or other local issues  
		//echo 'Facebook SDK returned an error: ' . $e->getMessage();
		header('Location: '.ERROR_URL);
		exit;  
	}  

	if (! isset($accessToken)) {  
		if ($helper->getError()) { 
			//echo "Error: " . $helper->getError() . "\n";
			//echo "Error Code: " . $helper->getErrorCode() . "\n";
			//echo "Error Reason: " . $helper->getErrorReason() . "\n";
			//echo "Error Description: " . $helper->getErrorDescription() . "\n";
			header('Location: '.ERROR_URL);
		} else {  
			header('Location: '.ERROR_URL);
			//echo 'Bad request';  
		}  
		exit;  
	}  

	// Logged in  
	echo '<h3>Access Token</h3>';  
	var_dump($accessToken->getValue());  
	  
	// The OAuth 2.0 client handler helps us manage access tokens  
	$oAuth2Client = $fb->getOAuth2Client();  

	// Get the access token metadata from /debug_token  
	$tokenMetadata = $oAuth2Client->debugToken($accessToken);  
	echo '<h3>Metadata</h3>';  
	var_dump($tokenMetadata);  
	  
	// Validation (these will throw FacebookSDKException's when they fail)  
	$tokenMetadata->validateAppId('1002078526589298');  
	// If you know the user ID this access token belongs to, you can validate it here  
	// $tokenMetadata->validateUserId('');  
	$tokenMetadata->validateExpiration();   
	   
	if (! $accessToken->isLongLived()) {  
	  // Exchanges a short-lived access token for a long-lived one  
	  try {  
		$accessToken = $oAuth2Client->getLongLivedAccessToken($accessToken);  
	  } catch (Facebook\Exceptions\FacebookSDKException $e) {  
		//echo "<p>Error getting long-lived access token: " . $helper->getMessage() . "</p>";  
		header('Location: '.ERROR_URL);
		exit;  
	  } 
	  //echo '<h3>Long-lived</h3>';  
	  //var_dump($accessToken->getValue());  
	}

	$_SESSION['fb_access_token'] = (string) $accessToken;  
	  
	// User is logged in with a long-lived access token.  
	// You can redirect them to a members-only page.  
	header('Location: http://www.aeidos.com.ar/aventurapatagonia/dni.php');
?>
$(document).ready(function() {
	//PRE-LOADER WEBSITE
	$("#full-wrapper").hide();
});

$(window).on("load", function(){
		//SCROLL
		 $("html").niceScroll({
		 	cursorcolor: '#7E1C58',
		 	cursoropacitymin: 0.2,
		 	cursoropacitymax: 0.6,
		 	cursorwidth: 6,
		 	cursorborder: 'none',
		 	cursorborderradius: '6px',
		 	zindex: 9999,
		 	scrollspeed: 350,
		 	mousescrollstep: 350,
		 	touchbehavior: false,
		 	hwacceleration: false
		 });

		//AFTER LOADED THE WEBSITE
		$("#full-wrapper").show(0, function() {
    		$(".logo-pre-loader").delay(200).fadeOut(500, function() {				/*SACAR DELAY DE PRUEBA!!!!!!!!*/
    			$("#pre-loader").delay(150).slideToggle(400, "easeOutExpo");
    		});
  		});

		//INITIALIZE
		$("#dialog").dialog({
			autoOpen: false
		});

        //MENU-LIST OPEN/CLOSE
        $(".menu").click(function(){
        	//FIRST, HIDE SERACH
        	$(".search-box").hide();
        	$(".search").removeClass("search-open");
        	//TOGGLE MENU
        	$(".menu").stop(true, false).toggleClass("menu-open");
           	$(".menu-list").stop(true, false).slideToggle(500, "easeInOutQuint");
        });

        //SEARCH OPEN/CLOSE
        $(".search").click(function(){
        	//FIRST, HIDE MENU-LIST
        	$(".menu-list").hide();
        	$(".menu").removeClass("menu-open");
        	//TOGGLE MENU
        	$(".search").stop(true, false).toggleClass("search-open");
           	$(".search-box").stop(true, false).slideToggle(250, "easeOutExpo");
        });

        //SEARCH
        $("#search-menu").keyup(function(e) {
		    if(e.which == 13 && !$(".ui-dialog").is(":visible")) {
		    	$value = $("#search-menu").val();
		    	if($value == ""){
			    	$value = "Por favor, completar campo."
			    	//SHOW ALERT
				    $("#dialog p").html($value);
				    $("#dialog").dialog({
					   	autoOpen: false,
					   	modal: false,
				    	title: "Error en la búsqueda",
				    	width: 250,
				    	height: 120,
					   	show: {
					       	effect: "fade",
					       	duration: 200
					   	},
						hide: {
					      	effect: "fade",
					      	duration: 200
					    },
					   	open: function() {
					       	$('.overlay').show();
					   	},
					   	close: function() {
					       	$('.overlay').hide();
					   	}}).prev(".ui-dialog-titlebar").css({'background':'#D11F34', 'color':'#FFF'});
		    	}else{
			    	//SHOW ALERT
				    $("#dialog p").html("'"+$value+"'");
				    $("#dialog").dialog({
					   	autoOpen: false,
					   	modal: false,
				    	title: "Buscando...",
				    	width: 250,
				    	height: 120,
					   	show: {
					       	effect: "fade",
					       	duration: 200
					   	},
					    hide: {
						   	effect: "fade",
						   	duration: 200
						},
					    open: function() {
					       	$('.overlay').show();
					    },
					    close: function() {
					       	$('.overlay').hide();
					    }}).prev(".ui-dialog-titlebar").css({'background':'#4fb648', 'color':'#FFF'});
			    	}

			   	$("#dialog").dialog('open');    	
		    }
		});

		$("body").bind('click', function(e){
                if($('#dialog').dialog('isOpen') && !$(e.target).is('.ui-dialog, a') && !$(e.target).closest('.ui-dialog').length){
                	$('#dialog').dialog('close');
                }
        });
});
$(window).on("load", function(){
    //BACK-BTN
    $("#back-btn").addClass("back-btn");

    //ACTIVE FORM STYLE
    $('.select-search').select2();

    //SHOW FILTER
    $("#filter-btn-zones").click(function(){
            //FIRST, HIDE MENU-LIST
            $("#filter-btn-zones").addClass("selected");
            $("#list-btn-zones, #map-btn-zones").removeClass("selected");
            $("#list-zones, #map-zones").hide();
            $("#zones").show();
        });

    //SHOW LIST
    $("#list-btn-zones").click(function(){
            //FIRST, HIDE MENU-LIST
            $("#list-btn-zones").addClass("selected");
            $("#filter-btn-zones, #map-btn-zones").removeClass("selected");
            $("#zones, #map-zones").hide();
            $("#list-zones").show();
        });

    //SHOW MAP
    var mapinitialized = false;
    var amountShow = false;
    $("#map-btn-zones").click(function(){
            //FIRST, HIDE MENU-LIST
            $("#map-btn-zones").addClass("selected");
            $("#filter-btn-zones, #list-btn-zones").removeClass("selected");
            $("#list-zones, #zones").hide();
            $("#map-zones").show();

            if(mapinitialized == false){

                //RANGER SLIDER ACTIONS
                $(function(){
                    $("#slider-range-max").slider({
                        range: "max",
                        min: 250,
                        max: 2500,
                        step: 250,
                        value: 250,

                        slide: function( event, ui) {
                            if(amountShow == false){
                               $("#amount").show(function(){amountShow = true});
                            }else{}
                                //CONVERT "METERS" TO "KM" TO SHOW ON SCREEN
                                $("#amount").val((ui.value / 1000) + "km");
                                radius = ($("#amount").val().slice(0,-2) * 1000);

                                //DELETE PREVIUS CIRCLE
                                $(".radiusCircle").remove();

                                //CREATE NEW CIRCLE
                                var circle = L.circle([-34.647421, -58.4707942], { //ACTUAL POSITION ------------------------------------> TOBI!!
                                    stroke: false, 
                                    color: 'blue',
                                    fillColor: '#73c1eb',
                                    fillOpacity: 0.35,
                                    radius: radius, //Radius of the circle, goes in meters.
                                    clickable: false,
                                    className: 'radiusCircle'
                                }).addTo(map);

                                /*var distans = getDistanceFromLatLonInKm(-34.647421, -58.4707942, ,);
                                if(radius / 1000) >= distans){
                                    //SHOW MARKER
                                }else{
                                    //HIDE MARKER
                                }*/
                        }       
                    });

                    $("#amount").val($("#slider-range-max").slider("value"));
                });

                //LIMITS OF MAP
                var bounds = new L.LatLngBounds(new L.LatLng(85, -190), new L.LatLng(-85, 190));

                //CREATE OBJECT MAP
                var map = L.map('gmap', {
                    maxBounds: bounds,
                    maxBoundsViscosit: 1.0,
                    noWrap: true,
                    zoomControl: false,
                    attributionControl: false,
                    //TOMAR UN PUNTO DE REFERENCIA PARA ENFOCAR EL MAPA --------------------------> TOBI!!!
                }).setView([-34.647421, -58.4707942], 18);

                //STYLE MAP WITH GOOGLE MAPS    
                var roadMutant = L.gridLayer.googleMutant({
                        minZoom: 10,
                        type:'roadmap',
                        //HIDE LOCAL BUSINESS
                        styles:[{
                            featureType: "poi.business",
                            elementType: "labels",
                            stylers:[{
                                visibility: "off"
                            }],
                        }],
                    }).addTo(map);

                //STYLE MAP WITH MAPBOX
                /*L.tileLayer('https://api.mapbox.com/styles/v1/arielpont/cizcv37q5001k2sn6rp3spbyo/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXJpZWxwb250IiwiYSI6ImNpemN0bmMyMzB0aXcyd2w4dWhnaHZpaWoifQ.zRbb7ToSmTxxVjQmrBpBwQ', {
                    minZoom: 6,
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                    id: 'arielpont.Veggmap'
                }).addTo(map);*/

                //CIRCLE RADIUS
                var circle = L.circle([-34.647421, -58.4707942], {
                    stroke: false, 
                    color: 'blue',
                    fillColor: '#73c1eb',
                    fillOpacity: 0.35,
                    radius: 250, //Radius of the circle, in meters.
                    clickable: false,
                    className: 'radiusCircle'
                }).addTo(map);

                //MAP ICONS CLASS
                var userPosition = L.Icon.extend({
                    options: {
                        iconSize: [24, 24],
                        className: 'userPosition',
                    }
                });

                var localIcon = L.Icon.extend({
                    options: {
                        iconSize: [82, 82],
                        className: 'localIcon-Open',
                    }
                });

                var localIcon2 = L.Icon.extend({
                    options: {
                        iconSize: [70, 70],
                        className: 'localIcon-Closed',
                    }
                });

                /****CLASES****/
                //USER-LOCATION
                var blue = new userPosition({iconUrl: 'img/icons/map/iconmap-01.svg'});
                
                //VEGETARIAN
                /*var openVegetarianPromo = new localIcon({iconUrl: 'img/icons/map/iconmap-04.svg'});
                var closeVegetarianPromo = new localIcon({iconUrl: 'img/icons/map/iconmap-03.svg'});
                var openVegetarian = new localIcon2({iconUrl: 'img/icons/map/iconmap-09.svg'});
                var closeVegetarian = new localIcon({iconUrl: 'img/icons/map/iconmap-07.svg'});*/

                //VEGGAN
                /*var openVegganPromo = new localIcon({iconUrl: 'img/icons/map/iconmap-05.svg'});
                var closeVegganPromo = new localIcon({iconUrl: 'img/icons/map/iconmap-02.svg'});
                var openVeggan = new localIcon2({iconUrl: 'img/icons/map/iconmap-08.svg'});
                var closeVeggan = new localIcon({iconUrl: 'img/icons/map/iconmap-06.svg'});*/

                //RESTAURANT
                var openRestaurantPromo = new localIcon({iconUrl: 'img/icons/map/iconmap-12.svg'});
                var closeRestaurantPromo = new localIcon({iconUrl: 'img/icons/map/iconmap-11.svg'});
                var openRestaurant = new localIcon2({iconUrl: 'img/icons/map/iconmap-17.svg'});
                var closeRestaurant = new localIcon({iconUrl: 'img/icons/map/iconmap-15.svg'});

                //DELICATESSEN
                var openDelicatessenPromo = new localIcon({iconUrl: 'img/icons/map/iconmap-13.svg'});
                var closeDelicatessenPromo = new localIcon({iconUrl: 'img/icons/map/iconmap-10.svg'});
                var openDelicatessen = new localIcon2({iconUrl: 'img/icons/map/iconmap-16.svg'});
                var closeDelicatessen = new localIcon({iconUrl: 'img/icons/map/iconmap-14.svg'});

                L.marker([-34.64742, -58.4707942], {icon: blue}).bindPopup("Estas aquí").addTo(map);

                //ADD ICONS
                var markersList = [];

                var markers = L.markerClusterGroup({
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true,
                    removeOutsideVisibleBounds: true,
                    spiderLegPolylineOptions: false,
                    maxClusterRadius: 20,
                });

/*
                //CALCULAR DISTANCIA
                function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
                  var R = 6371; // Radius of the earth in km
                  var dLat = deg2rad(lat2-lat1);  // deg2rad below
                  var dLon = deg2rad(lon2-lon1); 
                  var a = 
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2)
                    ; 
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                  var d = R * c; // Distance in km
                  return d;
                }

                function deg2rad(deg) {
                  return deg * (Math.PI/180)
                }*/

                //CREATE MARKERS -------------------------------------> TOBI!!!
                function populate() {
                    //for (var i = 0; i < 100; i++) {
                        var m = L.marker([-34.64842, -58.4708942], {icon: openRestaurantPromo}).bindPopup("<b onclick='loadLocalProfile();'>Vegetariano Destacado</b>");
                        markersList.push(m);
                        markers.addLayer(m);

                        var m = L.marker([-34.64942, -58.4709942], {icon: closeRestaurantPromo}).bindPopup("<b onclick='loadLocalProfile();'>Vegetariano Destacado - Cerrado</b>");
                        markersList.push(m);
                        markers.addLayer(m);

                        var m = L.marker([-34.65042, -58.4710942], {icon: openRestaurant}).bindPopup("<b onclick='loadLocalProfile();'>Vegetariana - Abierto</b>");
                        markersList.push(m);
                        markers.addLayer(m);

                        var m = L.marker([-34.65142, -58.4711942], {icon: closeRestaurant}).bindPopup("<b onclick='loadLocalProfile();'>Vegetariana - Cerrado</b>");
                        markersList.push(m);
                        markers.addLayer(m);

                        var m = L.marker([-34.64842, -58.4718942], {icon: openDelicatessenPromo}).bindPopup("<b onclick='loadLocalProfile();'>Vegano Destacado</b>");
                        markersList.push(m);
                        markers.addLayer(m);

                        var m = L.marker([-34.64942, -58.4719942], {icon: closeDelicatessenPromo}).bindPopup("<b onclick='loadLocalProfile();'>Vegano Destacado - Cerrado</b>");
                        markersList.push(m);
                        markers.addLayer(m);

                        var m =  L.marker([-34.65042, -58.4720942], {icon: openDelicatessen}).bindPopup("<b onclick='loadLocalProfile();'>Vegano - Abierto</b>");
                        markersList.push(m);
                        markers.addLayer(m);

                        var m = L.marker([-34.65142, -58.4721942], {icon: closeDelicatessen}).bindPopup("<b onclick='loadLocalProfile();'>Vegano - Cerrado</b>");
                        markersList.push(m);
                        markers.addLayer(m);
                    //}
                    //return false;
                }

                //ADD DE MARKERS TO THE MAP
                populate();
                map.addLayer(markers);

                //MAP INITIALIZE ONLY ONE TIME
                mapinitialized = true;
            }else{}
    });

    $(".close-profile").click(function(){
        $('#local-profile').hide();
    });
    


	loadpais();
    $('#list-zones').hide();
    $('#state').prop('disabled', true);
    $('#city').prop('disabled', true);
    $('#neighborhood').prop('disabled', true);
        
        
    $('#country').on("change", function(){
            loadprov();
        });
    $('#state').on("change", function(){
            loadloc();
        });

    $('#city').on("change", function(){
            loadbarrio();
        });

    $('.btnsearch').on("click", function(){
            search();
        });

});
/****** END ON READY ******/
    /*****LOCAL-PROFILE*****/
    function loadLocalProfile(){
        $('#local-profile').show(0, function(){
            //ROYALSLIDER
            $(".home-banner").royalSlider({
                autoScaleSlider: true,
                autoScaleSliderWidth: 320,
                autoScaleSliderHeight: 180,
                imageScaleMode: 'fill', //fit
                imageAlignCenter: true,
                imageScalePadding: -10,
                controlNavigation: 'bullets',
                arrowsNav: false,
                arrowsNavAutoHide: true,
                arrowsNavHideOnTouch: false,
                imgWidth: null,
                imgHeight: null,
                slidesSpacing: 0,
                startSlideId: 0,
                loop: true,
                loopRewind: true,
                randomizeSlides: false,
                numImagesToPreload: 2,
                usePreloader: true,
                slidesOrientation: 'horizontal',
                transitionType:'move',
                transitionSpeed: 200,
                easeInOut: 'easeInOutSine',
                easeOut: 'easeOutSine',
                controlsInside: true,
                navigateByClick: false,
                sliderDrag: true,
                sliderTouch: true,
                keyboardNavEnabled: false,
                fadeinLoadedSlide: true,
                allowCSS3: true,
                globalCaption: false,
                addActiveClass: true,
                minSlideOffset: 0,
                autoHeight: false,
                slides: false,
                autoPlay: {
                    enabled: false,
                    pauseOnHover: true,
                    stopAtAction: false,
                    delay: 1750,
                }
            });

            //ROYALSLIDER
            $('.days-open-slider').royalSlider({
                slidesSpacing: 0,
                loopRewind: false,
                arrowsNav: false,
                fadeinLoadedSlide: true,
                controlNavigationSpacing: 0,
                controlNavigation: 'thumbnails',
                
                thumbs: {
                  fitInViewport: true,
                  orientation: 'horizontal',
                  arrowsAutoHide: true,
                  autoCenter: false,
                  spacing: 0,
                  paddingBottom: 0
                },
                
                keyboardNavEnabled: true,
                imageScaleMode: 'fill',
                imageAlignCenter:true,
                slidesSpacing: 0,
                loop: false,
                loopRewind: true,
                numImagesToPreload: 3,
                
                autoScaleSlider: false, 
                autoScaleSliderWidth: 900,     
                autoScaleSliderHeight: 350,

                /* size of all images http://help.dimsemenov.com/kb/royalslider-jquery-plugin-faq/adding-width-and-height-properties-to-images */
                imgWidth: 640,
                imgHeight: 360
            });
        });
    }


function loadpais() {
    $.ajax({
        url: 'php/filtros.php',//https://tobiwg.com/veggmap/php/filtros.php
        type: 'post',
        data: {accion: "loadpais", },
        success: function(response) {
            //  alert(response);       
            $('#country').html('');
            $('#country').append(response);     
                    
        }
    });
  
}
function loadprov() {
//  alert($('#country').val());
    $.ajax({
        url: 'php/filtros.php',//https://tobiwg.com/veggmap/php/filtros.php
        type: 'post',
        data: {accion: "loadprov", pais: $('#country option:selected').text()},
        success: function(response) {
            //alert(response);
            $('#state').html('');
            $('#state').append(response);
            $('#state').prop("disabled",false);
    
                    
        }
    });
  
}
function loadloc() {
   // alert($('#state').children("option").filter(":selected").text());
    $.ajax({
        url: 'php/filtros.php',//https://tobiwg.com/veggmap/php/filtros.php
        type: 'post',
        data: {accion: "loadloc", prov: $('#state option:selected').text()},
        success: function(response) {
            //alert(response);    
            $('#city').html('');
            $('#city').append(response);
            $('#city').prop("disabled",false);                 
        }
    });
}

function loadbarrio() {
  //  alert($('#city').val());
    $.ajax({
        url: 'php/filtros.php',//https://tobiwg.com/veggmap/php/filtros.php
        type: 'post',
        data: {accion: "loadbarrio", loc: $('#city option:selected').text()},
        success: function(response) {
            //alert(response);           
            $('#neighborhood').html('');
            $('#neighborhood').append(response);
            $('#neighborhood').prop("disabled",false);        
         }
    });
}

function search() {
       //alert("pais:"+ $('#country').val()+" prov:"+ $('#state').option.text() +" loc:"+ $('#city').val()+"barrio:"+ $('#neighborhood').val() );
   /* $.ajax({
        url: 'php/search.php',//https://tobiwg.com/veggmap/php/filtros.php
        type: 'post',
         data: {pais: $('#country option:selected').text(),prov: $('#state option:selected').text() , loc: $('#city option:selected').text(),barrio: $('#neighborhood option:selected').text()},
         success: function(response) {
            //alert(response);
                $('#list-zones').html('');
                $('#list-zones').append(response);*/
                $('#list-zones').show();
                $('#zones').hide();
                $("#sub-menu").show();
                $("#list-btn-zones").addClass("selected");
                $("#filter-btn-zones, #map-btn-zones").removeClass("selected");
                /*

   
         }
    });*/

}
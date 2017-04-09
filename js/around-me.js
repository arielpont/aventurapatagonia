var radius=500;
var markers = [];
var localMarker = [];
var horario;
var dia;
var k=0;
var yh=0;
var ym=0;
var xh=0;
var xm=0;
var tbl=0;
var localmap = "";
var localmapActivated=0;
var localID = ""; //localID is revaluated in function "loadLocalProfile()"

/*********************************/
/***** INITIALIZE LOCAL MAP ******/
/*********************************/

//LIMITS OF MAP
var bounds = new L.LatLngBounds(new L.LatLng(85, -190), new L.LatLng(-85, 190));

var localMarker = L.markerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  removeOutsideVisibleBounds: true,
  spiderLegPolylineOptions: false,
  maxClusterRadius: 20,
});

var localmap = L.map('localmap', {
  maxBounds: bounds,
  maxBoundsViscosit: 1.0,
  noWrap: true,
  zoomControl: false,
  attributionControl: false,
});
                              
//STYLE MAP WITH GOOGLE MAPS
var roadMutant = L.gridLayer.googleMutant({
  minZoom: 15,
  maxZoom: 17,
  type:'roadmap',

  styles:[
    {
    //BLACK AND WHITE MAP
    featureType: "all",
    stylers:[{
      hue: "#7E1C58",
      color: "#7E1C58",
      saturation: 100,
      lightness: -20,
      gamma: 2,
    }],
    },
      
    {
    //HIDE LOCAL BUSINESS
    featureType: "poi.business",
    elementType: "labels",
    stylers:[{
      visibility: "off",
    }],
  }
],

}).addTo(localmap);

/*************************************/
/***** END-INITIALIZE LOCAL MAP ******/
/*************************************/


/**************************************/
/***** MAP ICONS/MARKERS CLASSES ******/
/**************************************/

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


/**************************************/
/***** MAP ICONS/MARKERS CLASSES ******/
/**************************************/

$(window).on("load", function(){
 /*GET TABLE*/
 $.ajax({
        url: 'php/lugares.php',
        type: 'post',
         data: {},
         success: function(response) {
           if (response!="") {
             var str=response;
             tabla=str.split(";");
             tbl=tabla.length;
             if (tbl!=0) {
              for(var i=0;tabla.length>i;i++){
                  tabla2=tabla[i].split(" , ");
                  tabla[i]=tabla2;
                  if (tabla[i][3]=="No") {
                      tabla[i][3]=tabla[i][10];
                  }
                  if (tabla[i][9]!=undefined||tabla[i][9]!=null) {
                      horario=tabla[i][9].split('/');
                      tabla[i][9]=horario;
                  }
                  if (tabla[i][8]!=""||tabla[i][9]!="") {
                      dia=dias(tabla[i][8],tabla[i][9]);
                      tabla[i][9]=dia;
                  }
              }
             }
           }
        }
  });
 /*END GET TABLE*/
 /*GET LOCATION*/
  navigator.geolocation.getCurrentPosition(showPosition, showError);//ON SUCCESS CALL showPosition ON ERROR CALL showError
 /*END GET LOCATION*/

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert( "User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
           alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
           alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
        alert( "An unknown error occurred.");
            break;
    }
}

function showPosition(position) {
    //SAVE USER COORDINATES
    lat = position.coords.latitude;
    lon = position.coords.longitude;
               
    //BACK-BTN
    $("#back-btn").addClass("back-btn");

    //SHOW MAP
    $("#map-zones").show(function(){

       $("#amount").show();

       
        
        //RANGER SLIDER ACTIONS
        $("#slider-range-max").slider({
            range: "max",
            min: 500,
            max: 5000,
            step: 250,
            value: 750,

            slide: function( event, ui) {
                //CONVERT "METERS" TO "KM" TO SHOW ON SCREEN
                $("#amount").val((ui.value / 1000) + "km");
                radius = ($("#amount").val().slice(0,-2) * 1000);
                populate(tabla);
                
                //DELETE PREVIUS CIRCLE
                $(".radiusCircle").remove();

                //CREATE NEW CIRCLE
                var circle = L.circle([lat, lon], { //ACTUAL POSITION ------------------------------------> TOBI!!
                    stroke: false, 
                    color: 'blue',
                    fillColor: '#73c1eb',
                    fillOpacity: 0.35,
                    radius: radius, //Radius of the circle, goes in meters.
                    clickable: false,
                    className: 'radiusCircle'
                    }).addTo(map);
                }       
        });

        $("#amount").val($("#slider-range-max").slider("value"));

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
                    }).setView([lat, lon], 14);
                    
                    //STYLE MAP WITH GOOGLE MAPS    
                    var roadMutant = L.gridLayer.googleMutant({
                            minZoom: 10,
                            type:'roadmap',
                            //HIDE LOCAL BUSINESS
                            styles:[
                              {
                                //BLACK AND WHITE MAP
                                featureType: "all",
                                stylers:[{
                                  saturation: 16,
                                }],
                              },
                              {
                                //HIDE LOCAL BUSINESS
                                featureType: "poi.business",
                                elementType: "labels",
                                stylers:[{
                                  visibility: "off",
                                }],
                              }
                            ],
                        }).addTo(map);

                    //STYLE MAP WITH MAPBOX
                   /* L.tileLayer('https://api.mapbox.com/styles/v1/arielpont/cizcv37q5001k2sn6rp3spbyo/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXJpZWxwb250IiwiYSI6ImNpemN0bmMyMzB0aXcyd2w4dWhnaHZpaWoifQ.zRbb7ToSmTxxVjQmrBpBwQ', {
                        minZoom: 6,
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        id: 'arielpont.Veggmap'
                    }).addTo(map);*/

                    //CIRCLE RADIUS
                    var circle = L.circle([lat, lon], {
                        stroke: false, 
                        color: 'blue',
                        fillColor: '#73c1eb',
                        fillOpacity: 0.35,
                        radius: 750, //Radius of the circle, in meters.
                        clickable: false,
                        className: 'radiusCircle'
                    }).addTo(map);

                    L.marker([lat, lon], {icon: blue}).bindPopup("Estas aquí").addTo(map);

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

                    //CREATE MARKERS -------------------------------------> TOBI!!!
                    function populate(table) {
                        markers.clearLayers();
                        for(var i=0;tabla.length>i;i++){
                          var tid=i;
                            var position = L.latLng(tabla[i][14], tabla[i][15]);
                            var gposition = new google.maps.LatLng(tabla[i][14], tabla[i][15]);
                            if (position!=undefined) {
                                if (google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(lat, lon), gposition)<=parseInt(radius)) {
                                       var d = new Date();
                                       if(ab(i,d.getDay())=="Abierto"){
                                              if (tabla[i][2]=="Vegetariano"||tabla[i][2]=="Vegetariana") { //CAMBIAR VARIABLES -------> TOBI
                                              var m = L.marker(position, {icon: openRestaurant, title: i});
                
                                              }else{
                                                     var m =  L.marker(position, {icon: openDelicatessen, title: i});          
                                              }
                                       }else{
                                              if (tabla[i][2]=="Vegetariano"||tabla[i][2]=="Vegetariana") { //CAMBIAR VARIABLES -------> TOBI
                                                     var m = L.marker(position, {icon: closeRestaurant, title: i});
                                              }else{
                                                     var m =  L.marker(position, {icon: closeDelicatessen, title: i});
                                              } 
                                       }
                                markersList.push(m);
                                markers.addLayer(m);
                                }
                            }  
                        }
                    }

                    //CLICK ON A MARKER AND OPEN IT
                    $(document).on('click', '.leaflet-marker-icon',function(){
                        var i = $(this).attr('title');
                        //AVOID TO CLICK ON A "CLUSTER GROUP" AND FAIL
                        if(i == "" || i == null){

                        }else{
                          loadLocalProfile(i);
                        }
                    });

                    //ADD DE MARKERS TO THE MAP
                    populate(tabla);
                    map.addLayer(markers);

                    //MAP INITIALIZE ONLY ONE TIME
                    mapinitialized = true;

    });

    //CLOSE LOCAL PROFILE
    $(".close-profile").click(function(){
        $('#local-profile').hide();
    });
 }

});
/****** END ON READY ******/
/***** FUNCTION TO DETERMINATE IF OPEN *****/
function ab(h, day) {
       var x=1;
       var d = new Date();
       var horas=d.getHours();
       if (horas==0) {
         horas=24;
       }
       var minutos=d.getMinutes();
       var hh=tabla[h][9][day];
       var j;
       var k;
       try {
           var t=hh.split("!");
       hh=t;
       
       } catch(e) {
           alert(e);
           alert(h+" "+tabla[h][10]);
       }
       for (var i=0;hh.length>i;i++) { 
           j=hh[i].split("-"); //TOBI!!! ACÁ ESTA TIRANDO ERROR "Uncaught TypeError: hh[i].split is not a function"
           hh[i]=j;
       }
       for (var i=0;hh.length>i;i++) {
           for (var y=0;hh[i].length>y;y++) {
               k=hh[i][y].split(":");
               hh[i][y]=k;
               if (parseInt(hh[i][y][0])==0) {
                 hh[i][y][0]=24;
               }
               if (parseInt(hh[i][y][1])==0) {
                 if (y==1) {
                     hh[i][y][1]=59;
                      hh[i][y][0]=parseInt( hh[i][y][0])-1;
                 }            
              }
           }
       }
       var r="";
       for (var k=0;hh.length>k;k++) {
              if (horas>=parseInt(hh[k][0][0])&&horas<=parseInt(hh[k][1][0])) {
                   if (horas==parseInt(hh[k][0][0])&&minutos>=parseInt(hh[k][0][1])) {
                        r= "Abierto";
                       x=0;
                   }else{
                     if (horas==parseInt(hh[k][1][0])&&minutos<=parseInt(hh[k][1][1])) {
                       r="Abierto";
                       x=0;
                     }else{
                       if (horas>parseInt(hh[k][0][0])&&horas<parseInt(hh[k][1][0])) {
                           r= "Abierto";
                           x=0;
                       }
                     }     
                   }
              }else{
                     r="Cerrado";         
              }
     }
     return r;
}

/***** END FUNCTION TO DETERMINATE IF OPEN*****/

/*****FUNCTION TO MADE THE TIME GREED*****/    
function dias(d, horarios){
  if (d===undefined||d===null) {        
  }else{
    d=d.split(" a ");
    var array2 = [6,6,6,6,6,6,6];
              for(var i =0;d.length>i;i++){
                  switch (d[i]) {
                      case "Lunes": d[i]=1;
                        break;
                      case "Martes": d[i]=2;
                        break;
                      case "Miercoles": d[i]=3;
                        break;
                      case "Jueves": d[i]=4;
                        break;
                      case "Viernes": d[i]=5;
                        break;
                      case "Sabado": d[i]=6;
                        break;
                      case "Domingo": d[i]=7;
                        break;
                  }
              }
              for(var i=0;horarios.length>i;i++){  
                switch (horarios[i].charAt(0)) {
                   case "l": array2[1]= horarios[i].replace("l", "");
                    break;
                  case "m":  array2[2]= horarios[i].replace("m", "");
                     break;
                  case "M":  array2[3]= horarios[i].replace("M", "");
                     break;
                  case "j":  array2[4]= horarios[i].replace("j", "");
                     break;
                  case "v":  array2[5]= horarios[i].replace("v", "");
                     break;
                  case "s": array2[6]= horarios[i].replace("s", "");
                     break;
                  case "d":  array2[0]= horarios[i].replace("d", "");
                  break;
                default:
                      for (var x=0;array2.length>x;x++) {
                          array2[x]=horarios[i];
                      }
                }
              }
              for (var x=1;7>=x;x++) {
                 if (x<d[0]||x>d[1]) {
                    if (x==7) {
                    array2[0]="Cerrado";
                    }
                      array2[x]="Cerrado";
                 }
              }
            return array2;
      }
  }
  /*****LOCAL-PROFILE*****/
    function loadLocalProfile(i){
          //GIVE GLOBAL VALUE TO "localID"
          localID = i;

          var d = new Date();
          var day=d.getDay();
        $('#local-profile').show(0, function(){
            
            var d = new Date();
            $('.name').text(tabla[i][3]);
            $('.address').html("<span>"+tabla[i][10]+"</span>");

            if (ab(i,d.getDay())=="Abierto") {
              $('#status').removeClass("closed");
              $('#status').addClass("open");   
            }else{
                $('#status').removeClass("open");
                $('#status').addClass("closed");   
            }
            
            $('#status').text(ab(i,d.getDay()));
            
            if (tabla[i][11]!="No") {
                $('#tel').text(tabla[i][11]);
            }else{
                $('#tel').text("Telefono no disponible");
            
            }
            
            $('.txt-desc').text(" ");
            $('.txt-desc').text(tabla[i][16]);
            $('.delivery').hide();
            $('.restaurant').hide();
            $('.delicatessen').hide();
            $('.vegan').hide();
            $('.vegetarian').hide();
            $('.outstanding').hide();
            $('.btn-promos').hide();
            if (tabla[i][19]=="si") {
                  $('.outstanding').show();
          
            }
            if (tabla[i][17]=="si") {
                  $('.delivery').show();
          
            }
            if (tabla[i][19]=="si") {
                  $('.outstanding').show();
          
            }
            if (parseInt(tabla[i][18])!=0&&tabla[i][18]!="") {
                  $('.btn-promos').show();
          
            }
            if (tabla[i][2]=="Vegetariano"||tabla[i][2]=="Vegetariana") {
                  $('.vegetarian').show();
            }else{
                  $('.vegan').show();
            }
            var tipo =tabla[i][1].split("/");
            for(var y=0;tipo.length>y;y++){
                switch(tipo[y]) {
                    case "Restaurante":
                      $('.restaurant').show();
                      break;
                    case "Rotiseria":
                        $('.delicatessen').show();
                    break;
                    case "Almacen":
                        $('.store').show();
                    break;
                }
                
            }
            var localhours=tabla[i][9];
            var html="";
            for(var x=0;localhours.length>x;x++){
               // alert(localhours[x]);
                var l=localhours[x].split("!");
                localhours[x]=l;
                for(var y=0;localhours[x].length>y;y++){
                    if (y==0) {
                      html=localhours[x][y];
                    }else{
                      html=html+"<br>"+localhours[x][y];
                    }
                }
              switch (x) {
                    case 0:
                     if (html=="Cerrado") {
                        $('#sun').addClass("closed");
                     }else{
                        $('#sun').addClass("open");
                     }
                     if (x==day) {
                        $('#rsSun').addClass("today");
                     }
                        $('.sun').html(html);
                        html="";
                    break;
                    case 1:
                     if (html=="Cerrado") {
                        $('#mon').addClass("closed");
                     }else{
                        $('#mon').addClass("open");
                     }
                       if (x==day) {
                         $('#rsMon').addClass("today");
                     }
                        $('.mon').html(html);
                        html="";
                    break;
                    case 2:
                     if (html=="Cerrado") {
                        $('#tue').addClass("closed");
                     }else{
                        $('#tue').addClass("open");
                     }
                       if (x==day) {
                         $('#rsTue').addClass("today");
                     }
                        $('.tue').html(html);
                        html="";
                    break;
                    case 3:
                     if (html=="Cerrado") {
                        $('#wed').addClass("closed");
                     }else{
                        $('#wed').addClass("open");
                     }
                       if (x==day) {
                         $('#rsWed').addClass("today");
                     }
                        $('.wed').html(html);
                        html="";
                    break;
                    case 4:
                     if (html=="Cerrado") {
                        $('#thu').addClass("closed");
                     }else{
                        $('#thu').addClass("open");
                     }
                       if (x==day) {
                         $('#rsThu').addClass("today");
                     }
                        $('.thu').html(html);
                        html="";
                    break;
                    case 5:
                     if (html=="Cerrado") {
                        $('#fri').addClass("closed");
                     }else{
                        $('#fri').addClass("open");
                     }
                       if (x==day) {
                         $('#rsFri').addClass("today");
                     }
                        $('.fri').html(html);
                        html="";
                    break;
                    case 6:
                     if (html=="Cerrado") {
                        $('#sat').addClass("closed");
                     }else{
                        $('#sat').addClass("open");
                     }
                       if (x==day) {
                         $('#rsSat').addClass("today");
                     }
                        $('.sat').html(html);
                        html="";
                    break;  
              }
                
            }

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



            L.marker([lat, lon], {icon: blue}).bindPopup("Estas aquí").addTo(localmap);

            //SHOW LOCAL ICON
            var position = L.latLng(tabla[localID][14], tabla[localID][15]);
            //console.log("position: "+position);
            var gposition = new google.maps.LatLng(tabla[localID][14], tabla[localID][15]);
              if (position!=undefined) {
                if (google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(lat, lon), gposition)<=parseInt(radius)) {
                  var d = new Date();
                  if(ab(localID,d.getDay())=="Abierto"){
                    if (tabla[localID][2]=="Vegetariano"||tabla[localID][2]=="Vegetariana") { //CAMBIAR VARIABLES -------> TOBI
                      var m = L.marker(position, {icon: openRestaurant});
                    }else{
                      var m =  L.marker(position, {icon: openDelicatessen});          
                    }
                  }else{
                    if (tabla[localID][2]=="Vegetariano"||tabla[localID][2]=="Vegetariana") { //CAMBIAR VARIABLES -------> TOBI
                      var m = L.marker(position, {icon: closeRestaurant});
                    }else{
                      var m =  L.marker(position, {icon: closeDelicatessen});
                    } 
                  }
                
                //console.log("m: "+m);
                localMarker.addLayer(m);
                
                }
              } 

            //ADD MARKER
            localmap.addLayer(localMarker);
            localmap.setView([tabla[localID][14], tabla[localID][15]], 17);
                      
        });
    }

var tabla;
var radius=2000;
var tabla2;
var markers = [];
var horario;
var dia;
var k=0;
var yh=0;
var ym=0;
var xh=0;
var xm=0;
var tbl=0;
$(document).ready(function() {
});
function initialize() {
  $.ajax({
        url: 'https://tobiwg.com/veggmap/php/lugares.php',
        type: 'post',
         data: {},
         success: function(response) {
           if (response!="") {
             var str=response;
             tabla=str.split(";");
            // alert(tabla.length);
              tbl=tabla.length;
             if (tbl!=0) {
                MainMap(tbl);
             }
             for(var i=0;tabla.length>i;i++){
                 tabla2=tabla[i].split(" , ");
                 tabla[i]=tabla2;
                 tabla[193][9]="11:00-15:30";
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
           }else{
             alert("empty")
           }
            }
  });
 
  $('.ui-slider-handle').text($('#slider').val()+" m");
}
$(document).on('change', '.ui-slider', function() {
    slider();
  });
$(document).on('touchmove', '.ui-slider', function() {
    slider();
  });
$(document).on("pageinit", "#info", function() {
     minimap();
  });
$('#bm').on("click",function(){
    
    minimap();
  });
google.maps.event.addDomListener(window, 'load', initialize);
function MainMap(tbl) {
       navigator.geolocation.getCurrentPosition(function(position) {
              lat = position.coords.latitude;
              lon = position.coords.longitude; 
              var mapProp = {
                 center: new google.maps.LatLng(lat, lon),
                 zoom:14,
                 mapTypeId:google.maps.MapTypeId.ROADMAP
              };   
              map=new google.maps.Map(document.getElementById("googleMap"),mapProp);   
              circle= new google.maps.Circle({
                strokeColor: 'black',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#58FA82',
                map: map,
                center: new google.maps.LatLng(lat, lon),
                radius: radius
              });
              lugares(tbl);
            });
  }
function slider(){
    var sv=parseInt($('#slider').val());
    if (sv<1000) {
         $('.ui-slider-handle').text(sv+" m");
    }else{
    $('.ui-slider-handle').text(sv/1000+" Km");
    }
    circle.setRadius(sv);
    lugares(tbl);
}
function lugares(tbl) {
    var tbl2=0;
    if (tbl!=0) {
        tbl2=tbl
    setMapOnAll(null);
    var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lon),
          map: map,
          icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });
    for(var i=0;tbl2>i;i++){
     var position = new google.maps.LatLng(tabla[i][14], tabla[i][15]);
     if (google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(lat, lon), position)<=parseInt($('#slider').val())) {
        marker = new google.maps.Marker({
           position: position,
           map: map,
           title: tabla[i][3]
        });
       hor=tabla[i][9];
       google.maps.event.addListener(marker, 'click', (function(marker, i) {return function() {
         $.mobile.changePage('#info',{transition: "flip"});
         $('.info').html('<h3>'+ tabla[i][3]+'</h3>'+tabla[i][1]+' '+tabla[i][2]+'<br><br>Direccion: '+tabla[i][10]+'<br><br><div id="abierto"></div><br>'+'<div onclick="horariosC('+i+');"><a href="#horarios" data-rel="popup" class="" data-position-to="window">Horario Completo</a></div>'+'<br>Tel: '+tabla[i][11]+'<br><br>Web: '+tabla[i][13]+'</p></div>    </p>')
         var d = new Date();
         ab(i,d.getDay());
       }})(marker, i));
        markers.push(marker);
     }
    }
    }else{
      lugares(tbl2);
    }
}
function minimap() {
    navigator.geolocation.getCurrentPosition(function(position) {
     var  lat = position.coords.latitude;
       var lon = position.coords.longitude; 
    });
    var mapProp2 = {
        center: new google.maps.LatLng(lat, lon),
        zoom:17,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };    
    miniMap=new google.maps.Map(document.getElementById("MiniMap"),mapProp2);   
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: miniMap,
        
    });
   //alert(lat+","+lon);
}
function setMapOnAll(map) {     
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
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
          //alert(x);
          if (x==7) {
            array2[0]="cerrado";
          }
            array2[x]="cerrado";
        }
    }
            return array2;
      }
  }
function horariosC(h) {
  document.getElementById("h").innerHTML =('<table><tr><td >Lunes</td><td>'+tabla[h][9][1]+'</td></tr>'+'<tr><td>Martes</td><td>'+tabla[h][9][2]+'</td></tr>'+'<tr><td>Miercoles</td><td>'+tabla[h][9][3]+'</td></tr>'+'<tr><td>Jueves</td><td>'+tabla[h][9][4]+'</td></tr>'+'<tr><td>Viernes</td><td>'+tabla[h][9][5]+'</td></tr>'+'<tr><td>Sabado </td><td> '+tabla[h][9][6]+'</td></tr>'+'<tr><td>Domingo</td><td>'+tabla[h][9][0]+'</td></tr></table>');   
}
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
    hh=hh.split("!");
    for (var i=0;hh.length>i;i++) {
        j=hh[i].split("-");
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
        if (horas>=parseInt(hh[i][0][0])&&minutos>=parseInt(hh[i][0][1])&&x==1) {
            if (horas<=parseInt(hh[i][1][0])&&minutos<=parseInt(hh[i][1][1])&&x==1) {
                document.getElementById("abierto").innerHTML = "abierto";
                //tiempo("a",hh,i);
                x=0;
            }else{
                document.getElementById("abierto").innerHTML = "cerrado";
               //tiempo("c",hh,i,h);
            }     
        }else{
          if (x!=0) {
            document.getElementById("abierto").innerHTML = "cerrado";
            // tiempo("c",hh,i, h);
          }
        }
    }
} 
function tiempo(e, h, i, t){
  var u;
  var r;
  var d = new Date();
  var horas=d.getHours();
  if (horas==0) {    
      horas=24;
  }
  var minutos=d.getMinutes();
  switch (e) {
    case "a": if (parseInt(h[i][1][1])==0) {
                h[i][1][1]=59;
                h[i][1][0]=parseInt(h[i][0][0])-1;
              }
              r=parseInt(h[i][1][0])-horas;
              if (r<0) {
                r +=24;
                ab(t, d.getDay()+1);
              }
              if (parseInt(h[i][1][1])-minutos<0) {
                u =60+(parseInt(h[i][1][1])-minutos);
                r -=1;
              }else{
                u=parseInt(h[i][1][1])-minutos;
              }
              if (i==0) {
                xh=r*60;
                xm=u;
              }else{
                yh=r*60;
                ym=u;
              }
              if (yh!=0||ym!=0) {
                if (xh+xm<=yh+ym) {
                  r=xh/60;
                  u=xm;
                  xh=0;
                  xm=0;
                }else{
                  r=yh/60;
                  u=ym;
                  yh=0;
                  ym=0;  
                }
               }else{
                 r=xh/60;
                 u=xm;
               }
               document.getElementById("abierto").innerHTML = "Abierto \n (faltan "+r+"h y "+u+"m para cerrar)";
      break;
    case "c":
                if (parseInt(h[i][0][1])==0) {
                  h[i][0][1]=59;
                  h[i][0][0]=parseInt(h[i][0][0])-1;
                 }
                r=parseInt(h[i][0][0])-horas;
                if (r<0) {
                  r +=24; 
                }
                if (parseInt(h[i][0][1])-minutos<0) {
                  u =60+(parseInt(h[i][0][1])-minutos);
                  r -=1;
                }else{
                  u =parseInt(h[i][0][1])-minutos;
                }
                if (i==0) {
                  xh=r*60;
                  xm=u;
                  alert(xh+xm);
                }else{
                   yh=r*60;
                   ym=u;
                   alert(yh+ym);   
                }
               if (yh!=0||ym!=0) {
                  if (xh+xm<=yh+ym) {
                    r=xh/60;
                    u=xm;
                    xh=0;
                    xm=0;
                  }else{
                    r=yh/60;
                    u=ym;
                    yh=0;
                    ym=0;
                  }
               }else{
                  r=xh/60;
                  u=xm;
               }
            document.getElementById("abierto").innerHTML = "cerrado \n (faltan "+r+"h y "+u+"m para abrir)";
      break; 
  }
}          

  
  
  
  


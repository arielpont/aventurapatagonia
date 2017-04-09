$(window).on("load", function(){

          //ROYALSLIDER
      $(".royalSlider").royalSlider({
        // general options go gere
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
          enabled: true,
          pauseOnHover: true,
          stopAtAction: false,
          delay: 1750,
        }
      }); 

    //SHOW OUTSTANDINGS
    $("#submenu-btn-outstanding").click(function(){
            //FIRST, HIDE "submenu-btn-all"
            $("#submenu-btn-outstanding").addClass("selected");
            $("#submenu-btn-all").removeClass("selected");
            $("#list-all").hide();
            $("#list-outstanding").show();
        });

    //SHOW ALL
    $("#submenu-btn-all").click(function(){
            //FIRST, HIDE "submenu-btn-outstanding"
            $("#submenu-btn-all").addClass("selected");
            $("#submenu-btn-outstanding").removeClass("selected");
            $("#list-outstanding").hide();
            $("#list-all").show();
        });
});
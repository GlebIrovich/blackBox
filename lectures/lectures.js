// page controller
// var pageController = (function(coms) {
//     // get data from the page
//     var Comment = function(id, slide, main, level){
//         this.id = id;
//         this.slide = slide;
//         this.main = main;
//         this.level = level;
//     };
//     var data = {
//         comments: [],
//     };
//     return {
//         // get comments from the page
//         getCommentsFromPage: function(){
//             var rawComments = coms;
//             var newCommentSet = [];
//             for (var i in COMMENTS) {
//                 var id = rawComments[i]['pk'];
//                 var slide = rawComments[i]['fields']['slide'];
//                 var main = rawComments[i]['fields']['main'];
//                 var level = rawComments[i]['fields']['level'];
//                 var com = new Comment(id, slide, main, level);
//                 newCommentSet.push(com);
//             }
//             data.comments = newCommentSet;
//             return data
//         }
//     }
// })(COMMENTS);

// UI controllers
var UIController = (function() {
    var DOMS = {
        carouselA: '#carousel-a',
        carouselB: '#carousel-b',
        right: '.carousel-control-next',
        left: '.carousel-control-prev',
        lightbox: '.lightbox',
        close: '.closex',
        subchapters: '.controls',
        lazyLoad: '#lazyLoadLink',
        allComments: '#comments',
        singleComment: '.comment'
    };
    return {
        getDOMS: function(){
            return DOMS;
        }
    };
})();

// Lightbox controller
var lightboxController = (function(UIContr){

    DOM = UIContr.getDOMS();
    // set up eventListeners
    function setupEventlisteners(){
        // display on double click
        $(DOM.carouselB).on('dblclick', function(){ $(DOM.lightbox).show(); });
        // display on doubletouch
        $(DOM.carouselB).on('doubletap', function(){ $(DOM.lightbox).show(); });
        // close lightbox with ESC
        $(document).keydown(function(e) {
            if( e.keyCode === 27 ) {$(DOM.lightbox).hide(); }
        });
        // close pressing cross
        $(DOM.close).click(function() {$(DOM.lightbox).hide(); })
    };
    return {
        init: function(){
            console.log('Lightbox control has started');
            setupEventlisteners();

        }
    };

})(UIController);

// Carousel controller

var carouselController = (function(UIContr){
    DOM = UIContr.getDOMS();

    // Sync carousels
    function syncCarousels() {
        // sync nav shevrons
        $(DOM.carouselB).on('click','a',function(){$(DOM.carouselA).carousel($(this).data('slide')); });
        $(DOM.carouselA).on('click','a',function(){$(DOM.carouselB).carousel($(this).data('slide')); });

        // add arrows control
        $(document)
            // highlight first link on load
            .ready(function(){
                if ($(DOM.subchapters).find("a").length) {
                    $(DOM.subchapters).find("a").eq(0).addClass("chosen");
                }
            })
            .keydown(function(e) {
                // if left arrow pressed
                if( e.keyCode === 37) {
                    $(DOM.carouselA).carousel('prev');
                    $(DOM.carouselB).carousel('prev');
                // if rigth arrow is pressed
                }  else if ( e.keyCode === 39) {
                    $(DOM.carouselA).carousel('next');
                    $(DOM.carouselB).carousel('next');
                }
            });
        // Change active color of the link and move both carousels
        $(DOM.subchapters).on('click','a',function(){
            // get slide destination
            var link = parseInt($(this).data('slide-to'));
            // check if another link is highlighted
            if($(".chosen").length){
                $(".chosen").removeClass('chosen')
            };
            $(this).addClass("chosen");

            // move carousels
            $(DOM.carouselA).carousel(link);
            $(DOM.carouselB).carousel(link);
        });
    };

    return {
        init: function(){
            console.log('carousel control has started');
            syncCarousels();
        }
    };

})(UIController)


// INITIATE MODULES
jQuery(function($) {
    lightboxController.init();
    carouselController.init();
});

  // double tap
(function($){

    $.event.special.doubletap = {
    bindType: 'touchend',
    delegateType: 'touchend',

    handle: function(event) {
        var handleObj   = event.handleObj,
            targetData  = jQuery.data(event.target),
            now         = new Date().getTime(),
            delta       = targetData.lastTouch ? now - targetData.lastTouch : 0,
            delay       = delay == null ? 300 : delay;

        if (delta < delay && delta > 30) {
        targetData.lastTouch = null;
        event.type = handleObj.origType;
        ['clientX', 'clientY', 'pageX', 'pageY'].forEach(function(property) {
            event[property] = event.originalEvent.changedTouches[0][property];
        })

        // let jQuery handle the triggering of "doubletap" event handlers
        handleObj.handler.apply(this, arguments);
        } else {
        targetData.lastTouch = now;
        }
    }
};})(jQuery);
$(document).ready(function() {
  // On Load
  setArticleWidth();
  initArticles();

  var resizeTimeout = null;
  $(window).resize(function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(function() {
      // On resize
      setArticleWidth();
    },250);
  });



  function getWindowSize() {
    var ww = $(window).width();
    if(ww >= 1120) {
      return "lg";
    }
    if(ww >= 992) {
      return "md";
    }
    if(ww >= 768) {
      return "sm";
    }
    else {
      return "xs";
    }
  }


  function setArticleWidth() {
    var columns = 6;
    if(getWindowSize() == "lg" && $(".all-articles-cat-list").length >= 0)
      columns = 4;
    else if(getWindowSize() == "md")
      columns = 4;
    else if(getWindowSize() == "sm")
      columns = 2;
    else if(getWindowSize() == "xs")
      columns = 2;

    // Articles (All)
    $(".all-articles .article-wrap").width($(window).width()/columns);
    $(".all-articles-cat-list .article-wrap").width($(window).width()/(columns+.5));

    // Article (Source)
    $(".all-articles-cat-list").each(function() {
      var totalWidth = 0;
      var maxHeight = 0;
      var $current = $(this);
      $current.find(".article").attr("style","");

      $current.find("li").each(function() {
        totalWidth += $(this).width();
        if($(this).find(".article").height() > maxHeight)
          maxHeight = $(this).height();
      });
      $current.width(totalWidth+2).find(".article").height(maxHeight);
    });

  }


  function initArticles() {

    // Articles (All)
    if( $(".all-articles").length >= 1) {
      $(".all-articles .article-wrap .has-background").lazyload({
        effect : "fadeIn"
      });
    }
    else {
      // Article (Source)
      $(".cat-list .article-wrap .has-background").lazyload({
        effect : "fadeIn",
        threshold: 100
      });

      $('.nano').perfectScrollbar(); 
    }


    var $wrap = $(".cat-list");
    $wrap.find(".has-background").lazyload({
      effect : "fadeIn",
      container: $wrap,
    });

    window.setTimeout(function() {
      $(window).trigger('scroll');
    },250);


      
    //   .each(function() {
    //   var $current = $(this);
    //   $current.find(".has-background").lazyload({
    //     effect : "fadeIn"
    //   });
    // });

    var $container = $('ul.all-articles').masonry({
      itemSelector: 'li.article-wrap',
      gutter: 0,
      // columnWidth: $(window).width()/4,
    });
    
  }











  $("#article-sources").change(function() {
    var feedName = $(this).val();
    if(feedName == 'All') {
      $('.article-wrap').fadeIn(0).addClass("visible");
      $("h1").html("All News");
    }
    else {
      $('.article-wrap').each(function() {
        if($(this).attr("feed-name") !== feedName) {
          $(this).fadeOut(0).removeClass("visible");
        }
        else {
          $(this).fadeIn(0).addClass("visible");
        }
        $("h1").html(feedName);
      });
    }
    // $container.masonry('destroy');
    // $container = $('ul').masonry({
    //   itemSelector: 'li.visible',
    //   gutter: 0,
    //   columnWidth: $(window).width()/4,
    // });
  });

  $("#article-categories").change(function() {
    var feedName = $(this).val();
    if(feedName == 'All') {
      $('.article-wrap').fadeIn(0).addClass("visible");
      $("h1").html("All News");
    }
    else {
      $('.article-wrap').each(function() {
        if($(this).attr("feed-category") !== feedName) {
          $(this).fadeOut(0).removeClass("visible");
        }
        else {
          $(this).fadeIn(0).addClass("visible");
        }
        $("h1").html(feedName);
      });
    }
    $container.masonry('destroy');
    $container = $('ul').masonry({
      itemSelector: 'li.visible',
    });
  });

});

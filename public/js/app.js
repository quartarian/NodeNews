$(document).ready(function() {
  var $container = $('ul').masonry({
    itemSelector: 'li.article-wrap',
  });

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
    $container.masonry('destroy');
    $container = $('ul').masonry({
      itemSelector: 'li.visible',
    });
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

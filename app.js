var Twig = require("twig"),
    Feed = require("feed-read"),
    request = require('request'),
    cheerio = require('cheerio'),
    express = require('express'),
    moment = require('moment'),
    app = express();

var feeds = [
  {
    name:"The Verge",
    rss: "http://www.theverge.com/rss/index.xml",
    category: "Technology"
  },
  {
    name:"Ars Technica",
    rss: "http://feeds.arstechnica.com/arstechnica/index?format=xml",
    category: "Technology"
  },
  {
    name:"Re/code",
    rss: "http://recode.net/feed/",
    category: "Technology",
    query: ".hero-img img"
  },
  {
    name:"OMG Ubuntu",
    rss: "http://feeds.feedburner.com/d0od",
    category: "Technology"
  },
  {
    name:"Web Upd8",
    rss: "http://feeds2.feedburner.com/webupd8",
    category: "Technology"
  },
  {
    name:"Lifehacker",
    rss: "http://lifehacker.com/rss",
    category: "Technology"
  },
  {
    name:"Cnet - All",
    rss: "http://www.cnet.com/rss/all/",
    category: "Technology"
  },
  {
    name:"TechCrunch",
    rss: "http://feeds.feedburner.com/TechCrunch/",
    category: "Technology"
  },
  {
    name:"Gizmodo",
    rss: "http://gizmodo.com/rss",
    category: "Technology"
  },
  {
    name:"TechHunter",
    rss: "http://techhunter.co/feed/",
    category: "Technology"
  },
  {
    name:"Hacker News",
    rss: "https://news.ycombinator.com/rss",
    category: "Technology"
  },
  {
    name:"CNN - Top Stories",
    rss: "http://rss.cnn.com/rss/cnn_topstories.rss",
    category: "News",
    query: ".pg-side-of-rail img.media__image"
  },
  // {
  //   name:"Wall Street Journal",
  //   rss: "http://www.wsj.com/xml/rss/3_7014.xml",
  //   category: "News"
  // },
  {
    name:"The Huffington Post",
    rss: "http://feeds.huffingtonpost.com/c/35496/f/677045/index.rss",
    category: "News",
    query: "article.entry img"
  },
  {
    name:"AP Top Stories",
    rss: "http://hosted2.ap.org/atom/APDEFAULT/3d281c11a96b4ad082fe88aa0db04305",
    category: "News",
    query: ".ap_photo_wrapper img"
  },
  {
    name:"Economist",
    rss: "http://www.economist.com/sections/economics/rss.xml",
    category: "News"
  },
  {
    name:"BBC News",
    rss: "http://feeds.bbci.co.uk/news/rss.xml?edition=us#",
    category: "News",
    filter: "VIDEO:",
    query: ".column--primary .story-body__inner img",
    query2: ".column--primary .js-delayed-image-load"
  },
  {
    name:"Slate",
    rss: "http://feeds.slate.com/slate",
    category: "News",
    query: ".slate_image img"
  },
  {
    name:"The New Yorker",
    rss: "http://www.newyorker.com/rss",
    category: "News",
    query: ".gallery-wrapper img",
    queryAttr: "data-thumbnail-src",
    query2: ".featured img"
  },
  {
    name:"AP Science",
    rss: "http://hosted2.ap.org/atom/APDEFAULT/b2f0ca3a594644ee9e50a8ec4ce2d6de",
    category: "Science",
    query: ".ap_photo_wrapper img"
  },
  {
    name:"Discovery News",
    rss: "http://feeds.feedburner.com/DiscoveryNews-Top-Stories",
    category: "Science",
    query: "#content-wrap img.media-hero"
  },
  {
    name:"Smithsonian Science.",
    rss: "http://smithsonianscience.si.edu/feed/",
    category: "Science",
  },
  // {
  //   name:"Popular Science",
  //   rss: "http://www.popsci.com/rss.xml",
  //   category: "News"
  // },
  {
    name:"Scientific American",
    rss: "http://rss.sciam.com/ScientificAmerican-News",
    category: "Science",
    query: ".article-media img"
  },
  {
    name:"NPR",
    rss: "http://www.npr.org/rss/rss.php?id=1001",
    category: "News",
    query: "article.story .imagewrap img"
  },
  // {
  //   name:"Popular Mechanics",
  //   url: "http://www.popularmechanics.com/",
  //   category: "News"
  // },
  {
    name:"Phys.org - Computer Science",
    url: "http://phys.org/rss-feed/technology-news/computer-sciences/",
    category: "Science",
  },
  {
    name:"The Atlantic",
    rss: "http://feeds.feedburner.com/TheAtlantic",
    category: "News"
  },
  {
    name:"New Scientist - Features",
    rss: "http://feeds.newscientist.com/features",
    category: "Science",
    query: ".article-content figure img"
  },
  {
    name:"Make:",
    rss: "http://makezine.com/feed/",
    category: "DIY"
  },
  {
    name:"Instructables",
    rss: "http://www.instructables.com/tag/type-id/featured-true/rss.xml",
    category: "DIY"
  },
];

var updateFeeds = function() {

  var fetchFirstImage = function(i,j) {
    if(typeof feeds[i].query !== 'undefined') {
      request(feeds[i].articles[j].link, function (error, response, html) {
        console.log("Loading link: " + feeds[i].articles[j].link);
        if (!error && response.statusCode == 200) {

          $ = cheerio.load(html);

          var attribute = "src";
          if(typeof feeds[i].queryAttr !== 'undefined') {
            attribute = feeds[i].queryAttr;
          }

          var thumbnail = $(feeds[i].query).attr(attribute);
          if(typeof thumbnail !== 'undefined') {
            feeds[i].articles[j].thumbnail = thumbnail;
          }
          else {
            thumbnail = $(feeds[i].query2).attr(attribute);
            if(typeof thumbnail !== 'undefined') {
              feeds[i].articles[j].thumbnail = thumbnail;
            }
            else {
              thumbnail = $(feeds[i].query2).attr("data-src");
              if(typeof thumbnail !== 'undefined') {
                feeds[i].articles[j].thumbnail = thumbnail;
              }
            }
          }

          if(feeds[i].name == "Slate" && thumbnail)
            feeds[i].articles[j].thumbnail = "http://slate.com"+thumbnail;

          if(feeds[i].name == "Scientific American" && thumbnail)
            feeds[i].articles[j].thumbnail = "http://www.scientificamerican.com"+thumbnail;


          console.log(feeds[i].name + " : " + thumbnail);
        }
        else {
          console.log("Error loading arcticle.");
        }
      });
    }
  }


  var fetchFeed = function(index) {
    Feed(feeds[index].rss, function(err, articles) {
      if (err) {
        console.log("Failed to fetch: " + feeds[index].name); 
        // console.log(feeds[index].rss); 
        //throw err;
      }
      else {
        console.log("Fetching articles for "+feeds[index].name);
        if(typeof feeds[index].articles == 'undefined')
          feeds[index].articles = [];

        feeds[index].articles = articles;
        for(var i = 0; i < articles.length; i++) {
          //@TODO add one by one and check for existance
          // if(feeds[index].articles.length <= 0 || !inArray(articles[i].title, feeds[index].articles) {
          //   feeds[index].articles.push(
          // }

          $ = cheerio.load(feeds[index].articles[i].content);
          var thumbnail = $("img").attr("src");

          if(typeof feeds[index].filter !== 'undefined' && feeds[index].articles[i].title.indexOf(feeds[index].filter) >=0 ) {
            // Remove filtered articles
            var removed = feeds[index].articles.splice(i, 1);
          }
          else {
            //ignore tracking images
            if(typeof thumbnail !== "undefined" 
              && thumbnail.indexOf("rc.img") < 0
              && thumbnail.indexOf("b.gif") < 0
              && thumbnail.indexOf("ScientificAmerican-News") < 0
              && thumbnail.indexOf("DiscoveryNews-Top-Stories") < 0)
              feeds[index].articles[i].thumbnail = thumbnail;
            else
              thumbnail = '';
            
            // Find first image in story
            if(thumbnail == "") {
              fetchFirstImage(index,i);
            }
          }

        }
      }
    });
  }
  for(var i =0; i < feeds.length; i++) {
    if(feeds[i].hasOwnProperty("rss")) {
      fetchFeed(i);
    }
  }
}

updateFeeds();
setInterval(function() {
  updateFeeds(); 
},900000);//15 minutes

var getAllArticles = function() {
  var shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  var allFeeds = [];
  for(var i =0; i < feeds.length; i++) {
    if(typeof(feeds[i].articles) !== 'undefined') {
      for(var j = 0; j < feeds[i].articles.length; j++) {
        var article = feeds[i].articles[j];
        article.feedName = feeds[i].name;
        article.feedCategory = feeds[i].category;
        allFeeds.push(article);
      }
    }
  }
  var compare = function(a,b) {
    var timeA = moment(a.published);
    var timeB = moment(b.published);
    if(timeA < timeB)
      return 1;
    else if (timeA > timeB)
      return -1
    else
      return 0;
  }
  shuffle(allFeeds);
  allFeeds.sort(compare);
  return allFeeds;
}

var getAllCategories = function() {
  var categories = [];

  for(var i =0; i < feeds.length; i++) {
    var found = false;

    if(categories.length > 0) {
      for(var j=0; j < categories.length; j++) {
        if(categories[j] == feeds[i].category)
          found = true;
      }
    }

    if(!found) {
      categories.push(feeds[i].category);
      console.log(feeds[i].category);
    }
  }

  return categories;
}



app.use(express.static('public'));
app.set("twig options", {
    strict_variables: false,
    cache: false
});

// app.get('/', function(req, res){
//   res.render('index.twig', {
//     page_title: "Feeds",
//     feeds : feeds
//   });
// });
app.get('/', function(req, res){
  res.render('all.twig', {
    page_title: "Feeds",
    feeds : feeds,
    articles: getAllArticles(),
    categories: getAllCategories()
  });
});
 
app.listen(8000);

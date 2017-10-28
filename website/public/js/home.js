
function checkforSynonyms(){
    
  //check if keyword has synonyms
  var kw = app.keywords;
  flag = false;

  for(var i=0; i < kw.length; i++){

    app.synonyms.forEach(function(ele, elei){
      ele.forEach(function(val, vali){
        if( kw[i] == val){
          flag = true;
          kw.splice(i, 1);
        }
      });

      if(flag){
        var length = app.synonyms[elei].length;
        for(var j=0; j<app.synonyms[elei].length; j++){
          kw.unshift(app.synonyms[elei][j]);
        }
        flag = false;
      }
    });

  }
}

function checkSpecialChar(ch){
  if(ch=="?") return true;
}

function highlight(content){
  //content = content in string to highlight if possible
  //kw = keywords that could be matched and hightlight content
  var kw = app.keywords;

  var kwords = "";
  for(var i in kw){
    if(checkSpecialChar(kw[i])){
      kw[i]="\\?";
    }
    kwords += "\\b"+kw[i]+"\\b";
    if((parseFloat(i)+1) < kw.length){
      kwords += "|";
    }
  }
  regExp = new RegExp(kwords, "ig");

  if(typeof(content)=="string"){

    content = content.replace(regExp, function(match){
        return "<span class='b'>"+match+"</span>";
    });
    return content;

  }else if(typeof(content)=="object"){

    var articles = [];
    var foundBool = false;

    content.forEach(function(article, i){

      article = article.replace(regExp, function(match){
          foundBool = true;
          return "<span class='b'>"+match+"</span>";
      });
      if(foundBool){
        articles.push(article);
        foundBool = false;
      }

    });
    return articles;

  }
}

//split the content data string in the desirable type: section or article.
//return an array o segments of this content string
function splitDocument(content, type){
  //if( type == 'article'){
    var articles=[];

    //pattern for start of the article
    //original pattern at the beggining of the conception:
    //(?<![\w\d])Art(?![\w\d]) but negative lookbehind doesnt work in js (?!>)

    regExp = new RegExp("(?:^|\\s)Article ([\\d]+)|(?:^|\\s)Art. ([\\d]+)");

    var i=0;
    while(content.length>0){
      //get start pos of the article
      var startPosMatch = regExp.exec(content);
      /*
      console.log("\nContent to check");
      console.log(content);
      console.log("startPosMatch");
      console.dir(startPosMatch);
      */

      if(startPosMatch){
        articles[i] = startPosMatch[0];
        content = content.substr(startPosMatch.index+(startPosMatch[0].length), content.length-1);

        var endPosMatch = regExp.exec(content);
        if(endPosMatch){
          articles[i] = articles[i] + content.substr(0, endPosMatch.index-1); 
          content = content.substr(endPosMatch.index, content.length-1);
        }else{
          articles[i] = articles[i] + content;
          content = "";
        }
      }
      i++;
    }
  //}
  //else = nothing to do
  return articles; 
}

function getSynonyms(keywords){
  var config = {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };

  keywords.forEach(function(keyword, i){
    axios.get('http://thesaurus.altervista.org/thesaurus/v1?word='+keyword+'&language=en_US&output=json&key=hDIA5jHnTlXbyA8SPLw5').then(function (res){
      console.log("synonyms of keyword: "+keyword);
      res.data.response.forEach(function(val, i){
        console.log(val.list.synonyms);
      });
    }).catch(function(error){
      console.log("found a error in thesaurus");
      console.dir(error);
    });
  });
  return 1;
  //return synonyms keywords
}

Vue.component('comp-result-units',{
  template: '\
    <div :id="divId" class="resultUnit" @click="showRU">\
      <span :id="span1Id" class="ruIcons" v-html="value">{{ value }}</span>\
      <span class="ruText" v-html="data">{{ data }}</span>\
    </div>\
  ',
  props: ['divId', 'span1Id', 'data'],
  methods: {
    showRU: function(){
      var $el =  this.$el;
      var $spanIcon = this.$el.children[0];
      var $spanText = this.$el.children[1];

      if(!this.active){

        Object.assign($el.style, {
          height: "400px", 
          borderColor: "yellowgreen"
        });
        $spanIcon.style.fontSize = "23px";
        Object.assign( $spanText.style, {
          height: $el.style.height,
          overflowY: "scroll"
        });
        this.value = "&#8628";
        this.active = true

      }else{
        
        Object.assign($el.style, {
          height: "45px", 
          borderColor: "black"
        });
        $spanIcon.style.fontSize = "18px";
        Object.assign( $spanText.style, {
          height: $el.style.height,
          overflowY: "hidden"
        });
        this.value = "&#8627";
        this.active = false
        $spanText.scrollTop = 0;

      }
    }
  },
  data: function(){
    return {
      active: false,
      value: "&#8627;"
    }
  }
}); 

var app = new Vue({
  el: '#div-parent',
  data: {
    phValue: "Hey there! How can i help you?",
    claimData: "",
    claimDataSW: "",
    keywords: "",
    synonyms: [
      ["back", "return"],
      ["time", "days"]
    ],
    outputBool: false,
    posBool: false, //indicate to system if should apply the tagged on the claim or not
    posResult: "", // var the has the contents of pos
    posDivShow: false, //shows the div content of pos taggs
    kwordsDivShow: false, //shows the content of keywords div
    configDivBool: false, //bool that sinalizes the systems if it the configDiv should be visible or not
    resultsBool: false, //bool that sinalize the systems to show the div of results
    resultsTitle: "Documents: ",
    results: "",
    hits: "",
    //index: 0,
    resultUnits: [],
    configSearchStruct: "section",
  },
  watch: {
    //if there is a claim type in the inputfield then outputBool = true (show the desc "searching...")
    claimData: function(event){
      if(app.claimData){
        app.outputBool= true; 
      }else{
        app.outputBool= false; 
      }
    },
    resultsBool: function(){
      if(app.resultsBool){
        app.phValue = "Would you like to ask again?"
      }else{
        app.phValue = "Olá! Como posso ajuda-lo ?"
      }
    }
  },
  methods: {
    ajaxSearch: function(e){
      if((e.key == "Enter") && (app.claimData != "")){
        config = {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        };

        axios.get('http://localhost:3000/elastic/?q='+app.claimData, config).then(function (res){
          app.hits = res.data.hits

          //app.hits.hits.length = tell how many results were found.
          if(app.hits.hits.length> 0){

            //always clear this variable before pushing new results to the page
            app.resultUnits = []

            if(app.configSearchStruct=="section"){

              app.resultsTitle = "Documents ("+app.hits.hits.length+") :";

              // for each "hit" = document indexed found
              // app.results is handled as RawHtml text

              app.hits.hits.forEach(function(val, i){
                tempContent = val._source.content

                tempContent = highlight(tempContent);
                
                app.resultUnits.push({
                  divId: 'resultUnit-'+i,
                  span1Id: 'ruStatus-'+i,
                  data: tempContent
                });
                //app.index+=1;
              });

            }else{

              //article model
              var j=0;
              app.hits.hits.forEach(function(val, i){
                tempContent = val._source.content

                var articles= splitDocument(tempContent, app.configSearchStruct);
                console.log(articles);

                //TODO: if the content wasnt highlighted, remove the article from the tempContent.
                articles = highlight(articles);
              
                for(var k=0;k<articles.length;k++){
                
                  app.resultUnits.push({
                    divId: 'resultUnit-'+j,
                    span1Id: 'ruStatus-'+j,
                    data: articles[k]
                  });
                  j++;
                  //app.index+=1;

                }
              });
              app.resultsTitle = "Documents ("+j+") :";

            }


            //now that the vue.instances are populate, we can visualize the content in the page
            app.resultsBool = true;

          }else{
            app.results = "Nothing was found. Try again with different claim."
            alert(app.results);
            app.resultsBool = false;
            app.results = "";
          }
          app.claimData = "";
        }).catch(function (error){
            console.log(error);
            alert("Sorry an error ocurred trying to connect the elasticsearch.");
        });
      }
    },
    ajaxSearchSW: function(e){
      if((e.key == "Enter") && (app.claimData != "")){
        axios.post('/ajax/stopwordsremoval', {
          claim: app.claimData,
          posBool: app.posBool
        })
        .then(function (res){
          app.keywords = res.data.keywords;

          //check if keywords has synonyms and add then to app.keywords
          checkforSynonyms();

          app.claimDataSW = "Keywords: "+app.keywords;

          //var synonyms = getSynonyms(res.data.keywords);

          app.posResult = (res.data.claimTagged != "") ? res.data.claimTagged : "";
          //call function that request a search in elasticsearch.js

          // update the app.claimData var with the claim content processed by the backend. 
          // app.claimData will always contain the input for the elasticsearch to search 
          // for matchs in the documents
          app.claimData = res.data.claim;
          app.ajaxSearch(e);
        })
        .catch(function(err){
          console.log(err);
        });
      }
    },
    showPosTagger: function(){
      app.posDivShow = !app.posDivShow; 
    },
    showKeywords: function(){
      app.kwordsDivShow = !app.kwordsDivShow;
    },
    toggleConfigDiv: function(bool){
      app.configDivBool = bool;
    }
  }
});

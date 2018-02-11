var lib = {
  removeRepeatedWords: function (keywords){
    //keywords = array of keywords
    let firstEl;
    
    let flagRemoved = false;

    if(keywords.length>0){
      //first element of the array if removed and the current array passed as parameter is changed
      firstEl = keywords.shift();
      //console.log(`Checking if '${firstEl}' is repeated`);

      //check for repeated element in the rest of array left
      let iK = keywords.indexOf(firstEl);

      if(iK > -1){
        //keywords changs with splice
        keywords.splice(iK, 1);

        //flag is necessary here. if i put the return here it would removed only one repteated match
        flagRemoved = true;
      }

      if(flagRemoved){
        //put it back to check if there is another keywords like that repeated to remove.
        //insert into the beggining the element removed
        keywords.unshift(firstEl);
        keywords = this.removeRepeatedWords(keywords);
      }else{
        //first option: algorithm didnt find a repetead word. so time to check next keyword in the array.
        ///since i already removed the first element, i just have pass the rest of keywords to function recursively
        keywords = this.removeRepeatedWords(keywords);
        keywords.unshift(firstEl);

        //if function didnt find a repetead keywords. it will return the keywords arr back as result. 
        //return keywords after this curly bracket
      }
    }
    return keywords;
  },
  // function remove keywords that are equal to a emptyspace and reestructure the array with the
  // rest of keywords
  rmEmptySpace: function (keywords){
    for(var i in keywords){
      //check for a empty word
      if((keywords[i] == " ") || (keywords[i] == "")){

        // get the "head" of the array
        //check if index 'i' isnt the last index of the keywords.length
        if(parseFloat(i)+1 < keywords.length){
          var head = [];
          //check if 'i' isnt the first element of array
          if(i > 0){
            head = keywords.slice(i-1, i);
          }

          // tail of the array (part after the element removed)
          if((parseFloat(i)+1) == keywords.length){
            var rest = keywords[keywords.length-1];
          }else{
            var rest = keywords.slice(parseFloat(i)+1);
          }
          
          Array.prototype.push.apply(head, rest);
          keywords = head;
          keywords = arguments.callee(keywords);
          return keywords;

        }else{
          //else: last position of array to remove
          keywords = keywords.slice(0, keywords.length-1);
          return keywords;
        }
      }
    }
    return keywords;
  },
  //returns the name of the deepest diretory in the string
  getLastDirName : function(str){
    var indexLast1 = str.lastIndexOf('/');
    var dirName = str.substring(0, indexLast1-1);

    var indexLast = dirName.lastIndexOf('/');
    dirName = str.substring(++indexLast, indexLast1);
    return dirName;
  },
  stopWordsRemoval : function(claim){
      var stopwords = "well good bad can could my may might would this those less more same her his our mine my from until only them was were will am among instead otherwise above under what when where do does who that which whom shall , they other are under their it into by for a an of the and to in art. -   or paragraph its section be than may as if there any with one two three four five your on a an";
      var filter_other= "i have had has \\?";
      var filter_romanianNumerals = "I II III IV V VI VII VIII IX X XI XII XIII XIV";
      stopwords = stopwords+" "+filter_romanianNumerals+" "+filter_other;
      stopwords = stopwords.split(" "); 

      var regExp = new RegExp();

      for(var i in stopwords){
        regExp = new RegExp("\\b"+stopwords[i]+"\\b", "i");
        claim = claim.replace(regExp, "");
      }

      //remove emptySpace
      regExpWhiteSpace = new RegExp("(\\s+)", "g");
      claim = claim.replace(regExpWhiteSpace, " ");

      var keywords = claim.split(" ");

      //some cases, the regExp left a '' as a word, this is the trick to remove them just in case.
      for(var i=0; i < keywords.length; i++){
        if (keywords[i] == ''){
          keywords.splice(i, 1);
        }
      }

      return {claim: claim, keywords: keywords}
      //keywords = functions.rmEmptySpace(keywords);
  },
  stopWordsRemovalPT : function(claim){

      claim = " "+claim+" ";

      //remove comma, point, exclamation, interrogation marks
      regCharMarks = new RegExp(`(\\:)|(\\;)|(\\))|(\\()|(\\,)|(\\.)|(\\?)|(\\!)|(\\/)|(\\&)|(\\$)|(\\%)|(\\#)|(\\*)|(\\-)|(\\_)|(\\")|(\\')|(\\[)|(\\])|(\\{)|(\\})`, "g");
      claim = claim.replace(regCharMarks, " ");
      //remove double emptySpace
      regExpWhiteSpace = new RegExp("(\\s+)", "g");
      claim = claim.replace(regExpWhiteSpace, " ");

      //também contém palavras ou expressões aglutinadas: você = vc. 
      var stopwords = "vc eu meu sua seu suas seus poderia gostaria disto isso deste esse desta esta dessa essa menos mais assim ele ela eles elas dela dele nosso nossa apenas era eram sou uma umas um uns ou ao de da do das dos que em no na nos nas ter com sem nao não mas porem porém entretanto todavia ainda se os as pelo pela pelos pelas todo toda mesmo mesma lá me la las lo los ali cada so só somente todos nenhum";

      //verbos de ligação (#TODO: adicionar dps conjugação verbal)
      var conectingVerbs = "foi ser são sao serão serao sera será sido sendo foram";

      //outros verbos
      var otherVerbs = "faz fazem fez fizeram fazendo ir iram irão indo ido vi viu viram";

      //adverbios
      let adverbs = "como sempre";
      let pronouns = "ante ate até após apos com contra desde entre para per perante por sob sobre trás tras"

      //var filter_romanianNumerals = "I II III IV V VI VII VIII IX X XI XII XIII XIV";
      filter_romanianNumerals = "";
      stopwords = stopwords+" "+filter_romanianNumerals+" "+conectingVerbs+" "+otherVerbs+" "+adverbs+" "+pronouns;
      stopwords = stopwords.split(" ");

      //ex9: R$ 754,00 -> r 75400 -> 75400
      var otherLetters = "r";
      otherLetters = otherLetters.split(" ");

      let regExp = new RegExp();

      var numerals = "0123456789";
      for(i=0;i<numerals.length; i++){
        regExp = new RegExp(`[${numerals}]+`, "ig");
        claim = claim.replace(regExp, "");
        //remove double emptySpace
        regExpWhiteSpace = new RegExp("(\\s+)", "g");
        claim = claim.replace(regExpWhiteSpace, " ");
      }

      //regExp removes a word contain vogals as described above and also remove the spaces besides the vowel. This expression is replaced for a single space
      for(i=0;i<otherLetters.length; i++){
        regExp = new RegExp("\\s"+otherLetters[i]+"\\s", "ig");
        claim = claim.replace(regExp, " ");
        //remove double emptySpace
        regExpWhiteSpace = new RegExp("(\\s+)", "g");
        claim = claim.replace(regExpWhiteSpace, " ");
      }

      //vowels and diactrics
      var articleVowels = "àaeiíouéèêëàâäîïùúûüôóö";
      articleVowels = articleVowels.split("");

      //regExp removes a word contain vogals as described above and also remove the spaces besides the vowel. This expression is replaced for a single space
      for(i=0;i<articleVowels.length; i++){
        regExp = new RegExp("\\s"+articleVowels[i]+"\\s", "ig");
        claim = claim.replace(regExp, " ");
        //remove double emptySpace
        regExpWhiteSpace = new RegExp("(\\s+)", "g");
        claim = claim.replace(regExpWhiteSpace, " ");
      }

      for(i=0;i<stopwords.length; i++){
        // \b pattern that checks for a word that contains exactly what is between \b
        // i = case insensitive, g = global search

        regExp = new RegExp("\\s"+stopwords[i]+"\\s", "ig");
        claim = claim.replace(regExp, " ");
        //remove double emptySpace
        regExpWhiteSpace = new RegExp("(\\s+)", "g");
        claim = claim.replace(regExpWhiteSpace, " ");
      }

      let arrKeywords = claim.split(" ");

      //some cases, the regExp left a '' as a word, this do the trick to remove them just in case.
      for(var i=0; i < arrKeywords.length; i++){
        if (arrKeywords[i] == '' || arrKeywords[i] == '.'){
          arrKeywords.splice(i, 1);
        }
      }

      return {claim: claim, keywords: arrKeywords}
      //keywords = functions.rmEmptySpace(keywords);
  },
  merge : function(leftObj, rightObj){
    let left = leftObj.arr,
        leftC = leftObj.arrC;

    let right = rightObj.arr,
        rightC = rightObj.arrC;

    /*
    console.log("Conquistando");
    console.log(left, leftC);
    console.log(right, rightC);
    */

    var result = [],
        resultC = [],
        lLen = left.length,
        rLen = right.length,
        l = 0,
        r = 0;

    while(l < lLen && r < rLen){
       if(left[l] < right[r]){
         resultC.push(leftC[l]);
         result.push(left[l++]);
       }else{
         resultC.push(rightC[r]);
         result.push(right[r++]);
      }
    }  

    //remaining part needs to be addred to the result
    return {
      arr: result.concat(left.slice(l)).concat(right.slice(r)),
      arrC: resultC.concat(leftC.slice(l)).concat(rightC.slice(r))
    }
  },
  mergeSort : function(arrObj){
    //parameter requires an object that contains arr and arrC properties.

    //console.log("Dividindo para Conquistar");
    let arr = arrObj.arr;
    let arrC = arrObj.arrC; //Content

    /*
    console.log(arr);
    console.log(arrC);
    console.log("--");
    */

    var len = arr.length;

    if(len <2)
        return {
          arr: arr, 
          arrC: arrC
        }

    var mid = Math.floor(len/2),
         left = arr.slice(0,mid),
         right = arr.slice(mid),
         leftC = arrC.slice(0,mid),
         rightC = arrC.slice(mid);

    let leftObj = {
      arr: left,
      arrC: leftC
    }
    
    let rightObj = {
      arr: right,
      arrC: rightC
    }
    
    //send left and right to the mergeSort to broke it down into pieces
    //then merge those
    return this.merge(this.mergeSort(leftObj), this.mergeSort(rightObj));
  },
};

module.exports = lib;

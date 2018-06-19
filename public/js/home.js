
//responderei o questionário neste link (<a href="https://goo.gl/forms/irOkb0TIAVZbY4k53" target="_blank">https://goo.gl/forms/irOkb0TIAVZbY4k53</a>) após finalizar o experimento.

//tell Vue to install the plugin
window.Vue.use(VuejsDialog.default);

//In case users click to back to previous claim:
window.onpopstate = function(event) {
  //alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
  if(event.state && event.state.claimId){
    axios.post('/historical_learning/selectClaimById', {
      claimId: event.state.claimId
    })
    .then(function (res){
      //2nd parameter bool, if true then donot update url string
      app.showCaseToUser(res.data, true);
    });
  }else{
    window.location = "/";
  }
};

function checkforSynonyms(){
    
  //check if keyword has synonyms
  //if it find that keywords has synonyms, it adds all the others keywords-synonyms in the array of synonyms
  let kw = app.keywords;
  flag = false;

  let arrSynIndex = [];

  for(var i=0; i < kw.length; i++){
    app.synonyms.forEach(function(ele, eli){
      //ele = element value,
      //eli =  element index

      //compares if element in array of synonyms is equal to keyword.
      //if it is indeed, it is removed from keywords array right away
      ele.forEach(function(val, vali){
        //console.log(`checking if ${kw[i]} == ${val}`);
        if(kw[i] == val){
          console.log(`found keyword synonym ${val}`);
          flag = true;
          app.keywords.splice(i, 1);
          i--;

          console.log(`Synonyms to add:\n ${app.synonyms[eli]}`);
          arrSynIndex.push(eli);
        }
      });
    });
  }

  if(flag){
    arrSynIndex.forEach(function(val, i){
      app.synonyms[val].forEach(function(word, iWord){
        if(app.keywords.indexOf(word) == -1){
          app.keywords.unshift(word);
        }
      });
    });
    /*
    var length = app.synonyms[eli].length;
    for(var j=0; j<app.synonyms[eli].length; j++){
      //puts the element in the first pos of array
      app.keywords.unshift(app.synonyms[eli][j]);
    }
    */
  }
}

//Highlight words in the article. if it doesnt find a match there. the article is excluded.
//also, depending of how data is structured (section or in articles) the highlight function return diff data struct
function highlight(content, dataStruct){
  //content = group of articles [0]=> articles content, [2]=> article id
  //kw = keywords that could be matched and hightlight content
  var kw = app.keywords;

  let kwords = "";

  for(var i in kw){
    // ?????
    if(kw[i]=="?"){
      kw[i]="\\?";
    }
    kwords += "\\b"+kw[i]+"\\b";
    if((parseFloat(i)+1) < kw.length){
      kwords += "|";
    }
  }

  regExp = new RegExp(kwords, "ig");

  if(dataStruct == "article"){

    if(typeof(content[0])==typeof("")){
      content = content[0].replace(regExp, function(match){
          return "<span class='b'>"+match+"</span>";
      });
      return content[0];

    }else if(typeof(content[0])== typeof {}){

      let groupArticles = [];
      let articles = [];
      let numberArticles = [];
      let foundBool = false;

      //for each article inside of object of articles, replace matchs for words in bold
      content[0].forEach(function(article, i){

        article = article.replace(regExp, function(match){
            foundBool = true;
            return "<span class='b'>"+match+"</span>";
        });

        //if in the current article wasnt found a match then it is removed in the code below
        if(foundBool){
          articles.push(article);
          numberArticles.push(content[1][i]);
          foundBool = false;
        }

      });
      groupArticles[0] = articles;
      groupArticles[1] = numberArticles;
      return groupArticles;

    }
  }else{
    content = content.replace(regExp, function(match){
        return "<span class='b'>"+match+"</span>";
    });
    return content;
  }
}

//split the content data string in the articles
//return an array o segments of this content string
function splitDocument(content, type){
  let articles=[];
  let numberArticles = [];

  //pattern for start of the article
  //original pattern at the beggining of the conception:
  //(?<![\w\d])Art(?![\w\d]) but negative lookbehind doesnt work in js (?!>)

  regExp = new RegExp("(?:^|\\s)Artigo([\\d]+)|(?:^|\\s)Art. ([\\d]+)");
  var startPosMatch = regExp.exec(content);

  let i=0;

  while(content.length>0 && (startPosMatch != null)){

    //.exec returns an array "result" containing [0] = the full string of characters matched, [1]..[n] substring matches if any.
    //[index] the 0-based index of the match in the string
    //[input] original string

    startPosMatch = regExp.exec(content);

    if(startPosMatch){
      articles[i] = startPosMatch[0];
      content = content.substr(startPosMatch.index+(startPosMatch[0].length), content.length-1);

      //try a match again, if it finds more matchs after removing the previous match. Then this documents has more than one article
      var endPosMatch = regExp.exec(content);
      if(endPosMatch){
        articles[i] = articles[i] + content.substr(0, endPosMatch.index-1); 
        content = content.substr(endPosMatch.index, content.length-1);
      }else{
        //not anymore articles was found.
        articles[i] = articles[i] + content;
        content = "";
      }

      //add the number of the article found
      numberArticles[i] = startPosMatch[2];
    }
    i++;
  }
  let groupArticles = [];

  groupArticles[0] = articles;
  groupArticles[1] = numberArticles;

  return groupArticles; 
}

function getSynonyms(keywords){
  var config = {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };

  keywords.forEach(function(keyword, i){
    axios.get('http://thesaurus.altervista.org/thesaurus/v1?word='+keyword+'&language=pt_BR&output=json&key=hDIA5jHnTlXbyA8SPLw5').then(function (res){
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

//'#table-similar-claims',
/*
  obj.subject = val.subject;
  obj.claimId = val.id;
  obj.artId = val.art_id;
  obj.claimText = val.claim_text;
  obj.artText = val.text;
  obj.similarity = val.similarity;
*/

Vue.component('comp-similar-claim-units',{
  template: `
      <table class="div-similar-claims" id="table-similar-claims" v-if="columns && data">
        <tr>
          <th v-for="column in columns" @click="sortBy(column)" :class="{ active: sortKey == column}">
            {{ columnsTitles[column] }}
            <span class="arrow" :class="sortOrders[column] > 0 ? 'asc' : 'desc'"></span>
          </th>
        </tr>
        <tr v-for="claim in filteredData" class="similar-claim-row" @click="showCaseToUser(claim)">
          <td v-for="key in columns">

            <!-- if valor relacionado a queixa -->
            <div v-if="key == 'claimText'" class="claim-text" :title="claim[key]" >{{ claim[key] }}</div>

            <!-- if valor é relacionado com similaridade -->
            <div v-else-if="key == 'similarity' && claim[key] >= 70" class="similarity similar-high">{{ claim[key] }}</div>
            <div v-else-if="key == 'similarity' && claim[key] >= 45" class="similarity similar-good">{{ claim[key] }}</div>
            <div v-else-if="key == 'similarity'"  class="similarity similar-low">{{ claim[key] }}</div>
            <div v-else>{{ claim[key] }}</div>
          </td>
        </tr>
      </table>
  `,
  props: { 
    data: Array,
    columns: Array
  },
  data: function(){

    var sortOrders = {}

    /*this.columns.forEach((key)=>{
      sortOrders[key] = 1;
    });*/

    var columnsTitles = {
      subject: "Categoria",
      artId: "Artigo",
      claimText: "Queixa",
      similarity: "Similaridade (%)"
    }

    Object.keys(columnsTitles).forEach((key) => {
      sortOrders[key] = 1;
    });
    sortOrders["similarity"] = -1;

    return {
      columnsTitles: columnsTitles,
      sortKey: 'similarity',
      sortOrders: sortOrders
    }

  },
  computed: {
    filteredData: function(){
      var data = this.data;
      var sortKey = this.sortKey;
      var order = this.sortOrders[sortKey] || 1;

      //sorting pair to pair
      data = data.slice().sort((a, b)=>{
        a = a[sortKey];
        b = b[sortKey];
        return (a==b ? 0 : a > b ? 1: -1) * order;
      });

      return data;
    }
  },
  methods: {
    showCaseToUser: function(caseClaim){
      app.showCaseToUser(caseClaim);
    },
    sortBy: function(key){
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    }
  }
});


Vue.component('comp-chat-msgs',{
  template: '\
      <div :class="divClass" :id="divId">\
        <div class="msg-text">{{ data }}</div>\
        <div class="msg-photo"></div>\
      </div>\
  ',
  props: ['divId', 'divClass', 'data'],
  data: function(){ //this.active and this.value acess here
    return {
      active: false,
    }
  }
});

var vueHeader = new Vue({
  el: '#header-claim',
  data: function(){
    return {
      phValue: "Descreva seu problema",
      claimData: "",
      loadingBool: false
    }
  },
  methods: {
    //ajaxsearch stop words
    ajaxSearchSW: function(e){
      //ajaxSearchSW triggered on keyup due to checking e.target.value.length which is update after a content is updated
      if(!app.chatbotStartedBool){
        if(((e.key == "Enter")||(e.type == "click")) && (vueHeader.claimData != "")){
          app.chatbotStartedBool = true;
          
          app.claimData = vueHeader.claimData;

          this.addLoadingDiv();
          axios.post('/ajax/stopwordsremovalPT', {
            claim: app.claimData,
            posBool: app.posBool
          })
          .then(function (res){
            console.log(res.data);
            app.keywords = res.data.keywords;

            //check if keywords has synonyms and add then to app.keywords
            checkforSynonyms();
            app.claimDataSW = "Keywords: "+app.keywords;
            //altervist
            //var synonyms = getSynonyms(res.data.keywords);

            app.posResult = (res.data.claimTagged != "") ? res.data.claimTagged : "";

            // update the app.claimData with the claim content processed by the backend. 
            // app.claimData will always contain the input for the elasticsearch to search 
            // for matchs in the documents
            //app.claimData = res.data.claim;

            //Realiza requisição de matchs nos documentos pelo elasticsearch
            app.ajaxSearch(e);
          })
          .catch(function(err){
            app.chatbotStartedBool = false;
            console.log(err);
          });
        }else{
          if(e.target.tagName === "INPUT" && e.target.value.length > 25){
            //extend do vueHeader
            var textareaComponent = Vue.extend({
              template: `
                <textarea v-model="claimData" id="textarea-claim" @keyup="changeClaimData" autofocus></textarea>
              `,
              props: { 
                claim: String, required: true,
              },
              data: function(){
                return {
                  claimData: vueHeader.claimData,
                }
              },
              mounted: function(){
                this.$nextTick(function(){
                  //code that will run only after the
                  //entire view has been rendered
                })
              },
              methods: {
                changeClaimData: ()=>{
                  let elClaim = document.getElementById("textarea-claim");
                  this.claimData = elClaim.value;
                }
              }
            });

            //this will replace #textarea-claim
            new textareaComponent().$mount('#textarea-claim');

            let elClaim = document.getElementById("textarea-claim");
            elClaim.focus();
            
          }else if(e.target.tagName === "TEXTAREA"){
            //console.log(vueHeader.claimData);
          }
        }
      }else{
        alert("A busca da queixa já foi iniciada. Respondam as perguntas ou, para iniciar nova queixa, atualize a página.");
        document.getElementById('div-chatbot').scrollIntoView();

        //focus on the input of typing message to the chatbot
        app.$refs["chatbot-input"].focus();

        //make the input field to flash for +- 9 seconds
        let cnt = 0;
        let timer = setInterval(function(){
          if (cnt==9){
            elTypingBox.style.border = "none";
            elTypingBox.style["border-bottom"] = "1px solid darkblue";
            clearInterval(timer);
          }else{
            //cnt % 2 == 1 ? app.$refs["chatbot-input"].style.border = "1px solid gray" : app.$refs["chatbot-input"].style.border = "none";
            cnt % 2 == 1 ? elTypingBox.style.border = "none" : elTypingBox.style.border = "2px solid darkblue";
          }
          cnt++;
        }, 800);
      }
    },
    jumpToId: (elId)=>{
      document.getElementById(elId).scrollIntoView();
    },
    addLoadingDiv: function(){
      this.loadingBool = true;  
    },
    removeLoadingDiv: function(){
      this.loadingBool = false;
    }
  }
}); 

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
          height: "40px", 
          lineHeight: "40px",
          borderColor: "black"
        });
        $spanIcon.style.fontSize = "18px";
        Object.assign( $spanText.style, {
          height: "30px",
          overflowY: "hidden"
        });
        this.value = "&#8627";
        this.active = false
        $spanText.scrollTop = 0;
      }
    }
  },
  data: function(){ //this.active and this.value acess here
    return {
      active: false,
      value: "&#8627;"
    }
  }
}); 

var app = new Vue({
  el: '#div-chatbot',
  data: function(){
    return {
      userId: "",
      claimData: "",
      claimDataSW: "", //contains the message of keywords of claim
      keywords: "",
      synonyms: [
        ["volta", "reembolso", "devolução", "restituição", "indébito", "quantia", "estorno", "estornar"],
        ["tempo", "dias", "prazo"],
        ["uso", "vícios", "defeito", "falha"],
        ["pagamento", "cobrar", "cobrando", "cobrança", "cobrado", "quantia", "indebito", "indébito", "dívida", "divida"],
        ["anuncio", "anunciando", "publicidade", "propaganda", "enganosa", "enganado", "enganados"],
        ["produto", "produtos"],
        ["serviço", "servico", "serviços"],
        ["perigoso", "perigosos", "nocivo", "nocivos", "ferir", "matar"],
        ["quantidade", "quantidades", "unidade", "unidades"],
        ["arrependi", "arrependeu", "arrependimento"],
        ["plano", "consórcio", "consórcios", "consorcio", "consorcios", "prestação", "prestações"],
        ["passado", "informação"]
      ],
      //Div elements
      emptySimilarCasesMessage: false,
      chatbotStartedBool: false,
      suggestionTitleBool: true,
      reportClaimTitleBool: false,
      thanksVotingBool: false,
      newSuggestionAnswerBool: false,
      outputBool: false,
      posBool: false, //indicate to system if it should apply the POS Tagger on the claim or not
      posResult: "", // var the has the contents of pos
      posDivShow: false, //shows the div content of pos taggs
      kwordsDivShow: false, //shows the content of keywords div
      configDivBool: false, //bool that sinalizes the systems if the configDiv should be visible or not
      resultsBool: false, //bool that sinalize the systems to show the div of results
      expBool: false,
      voteClaimBool: false,
      suggestionExpData: "",
      termName: "",
      resultsTitle: "Documentos: ",
      voteButtons: [],
      results: "",
      hits: "",
      resultUnits: [],
      msgUnits: [],
      configSearchStruct: "article",
      questions: [], //contains questions related to every article. ex: question[0] = refere-se ao artigo 1
      //chatbot vars
      nMsgsBot: -1,
      nMsgsUser: -1,
      inputChatbot: "",
      gridSimilarClaims: {
        "data": [],
        "columns": []
      },
      viewCase: {},
      positiveAnswers: ["sim", "s", "isso", "perfeito", "de acordo", "positivo", "claro", "ok", "exatamente", "exato", "correto"],
      negativeAnswers: ["não", "n", "no", "nao", "naõ", "nada a ver", "negativo", "nem pensar", "foi longe", "errado", "não faz sentido", "nao faz sentido"],
      //zero based array: i: index of questions array, (i+1) article number. When i is the array index and (i+1) is the number of the article
      questions: [
        "Foi demonstrado alguma confusão pelo vendedor a respeito do papel de fornecedor ou consumidor?",
        "-",//"Foi demonstrado alguma confusão pelo vendedor a respeito do papel de fornecedor ou consumidor?",
        "-",//"Foi demonstrado alguma confusão pelo vendedor a respeito do papel de fornecedor ou consumidor?",
        //Art 4 removido para revisão
        //"Tem alguma  dúvida em relação aos princípios de proteção ao consumidor ditado pela Politica Nacional das Relações de Consumo?",
        "-",
        //Art 5 (escolhido vetar do sistema por ora. Eleitor leigo n saberia responder se esta ligado ou nao a política nacional das relações do consumo
        //"Existe uma referência específica sobre as a execução dos princípios estabelecidos pela Política Nacional das Relações de Consumo. Deseja visualizar?",
        "-",
        [
          "O fornecimento deste produto ou serviço indica risco a sua saúde e segurança de vida ou ainda não respeita os consumidores com deficiência?",
          "Você sente que igualdade ou sua liberdade de escolha foi quebrada durante a contratação?",
          "A informação passada para você foi feita de forma devida? Isto é, A informação foi clara sobre o produto ou serviço adquirido?",
          "Você suspeita que passou por algum tipo de publicidade enganosa?",
          "Por acaso, percebeu que está pagando parcelas desproporcionais ao estabelecido em seu contrato?",
          "Você passou por algum dano moral, patrimonial ($$), individual ou coletivo?",
          "Tentou acessar algum órgão perto de você e não pôde ser atendido ou não encontrou nenhum órgão do governo que pudesse te ajudar?",
          "Na recorrência de uma alegação, você pode utilizar a inversão do ônus de prova a favor no processo?",
          "Durante a prestação do serviço público, seu problema foi solucionado?",
        ],
        "Um dos atores (fornecedores ou consumidores), rejeitam a responder pelo reparo de danos?",
        //Art 8
        "O produto ou serviço que adquiriu apresenta algum risco a sua saúde ou segurança e não foi alertado pelo fornecedor?",
        "No seu caso, o fornecedor do produto ou serviço potencialmente nocivo não te informou devidamente a respeito do risco e periculosidade que o mesmo apresenta?",
        "O Fornecedor sabia do perigo que o produto ou serviço apresentava e mesmo assim lhe forneceu dizendo que era de 'ótima' qualidade?",
        "-",
        "Você deseja ter reparo dos danos (causado a sua saúde ou segurança) pelo produto adquirido?",
        "Você não consegue identificar o fabricante, produto ou responsável do produto e o comerciante se nega a assumir responsabilidade pelos danos do produto?",
        "O responsável se nega de alguma forma a reparação do causado pela prestação do serviço defeituoso ou pela informação insuficiente do serviço e você deseja ser indenizado parcialmente ou totalmente pelo serviço realizado?",
        "-", //Art 15 (vetado)
        "-",
        "-",
        //Art 18
        [
          "Você não está satisfeito com a inadequação do produto vendido seja por causa da propaganda, informações da embalagem, inadequação com validade ou inadequado para uso por outro motivo e deseja substituir, ressarcir ou trocar-lo? (prazo maximo de 30 dias)",
          "A empresa não solucionou o problema e você gostaria de substituir o seu produto?", 
          "A empresa não solucionou o problema e você gostaria de ter seu dinheiro de volta?",
          "A empresa não solucionou o problema e você gostaria que o preço do produto sofresse um abatimento ?",
          "Ao contactar a empresa, a mesma disse que o prazo da troca ou devolução do produto ou serviço COM DEFEITO não pode ser ampliado? (Em casos de prazos menores que 180 dias)",
          "Ao substituir por um novo produto ou serviço, o mesmo apresentou outro problema e a empresa se negou a resolve-lo?",
          "A empresa ou fornecedor diz que não tem o produto e por isso não pode efetuar troca?"
        ],
        "Lhe foi vendido um produto com quantidade ou medidas abaixo da informada na especificação e gostaria de ter abatimento do preço, complementação do peso / medida, substituição do produto ou restituição da quantia paga ?",
        //Art 20
        "O fornecedor prestou serviço impróprio para consumo, abaixo da qualidade oferecida ou o serviço prestado teve disparidade da informação contida na oferta / propaganda?",
        "O serviço prestado pela empresa utilizou de peças usadas ou inadequadas para reparação de seu produto, isto é, fora das especificações técnicas do fabricante sem sua autorização?",
        //Art 22
        "Você recebeu algum atendimento de um órgão público que demonstrou falta de profissionalismo para solucionar seu problema? Se sim, qual serviço você precisou para solucionar seu problema e qual foi o gargalo ou inadequação encontrado em seus serviços?",
        "O fornecedor responde dizendo que não sabia que o produto vendido por ele estava neste estado e se nega a solucionar seu problema?",
        "-",
        //Art 25
        "O fornecedor nega a solucionar seu problema devido a uma clausula contratual assinado entre você e ele que diminua ou anule a obrigação dele de indeniza-lo pelo defeito ou causado?",
        [
          "Fornecedor alega que a reclamação não pode ser feita porque passou do prazo do seu direito?",
          "Ant",
          "Você não tinha certeza se o produto tinha defeito e acha que percebeu tarde mais para fazer queixa do fornecedor?(vício oculto)"
        ],
        "O produto ou serviço que adquiriu te causou algum dano físico / quimico e acha que passou do prazo para tentar recorrer a reparação do dano?",
        "Está dificil identificar quem são os sócios da empresa ou eles alegam que não possuem recursos para pagamento de débitos?",
        "-",
        //Art 30
        //"A oferta do produto ou serviço que você viu, ofereceu um determinado valor e no momento do pagamento você teve que pagar por um valor mais alto?",
        "-",
        "O produto ou Serviço que adquiriu não possuia informações claras, corretas, precisas em português quanto suas caracteristicas, qualidades, composição, preço, garantia ou ainda não informava riscos que apresenta a sua saúde e segurança?",
        "O fabricante ou importador do produto que adquiriu afirma que não possui peças de reposição para seu produto e este continua sendo fabricado e veiculado no mercado?",
        [
          "Foi oferecido a você ou você comprou um produto via telefone em que as informações do fabricante e endereço da companhia não foi informado na embalagem?",
          "Foi cobrado de você uma taxa por aceitar uma ligação telefonica feita exclusivamente para realizar propaganda do produto?"
        ],
        "A empresa representante do produto ou serviço que você adquiriu nega a responder pela responsabilidade do dano",
        //Art 35
        "O fornecedor do produto ou serviço recusou a cumprir a oferta publicada e não ofereceu a você a escolha de um dos seguintes items ? (exigir cumprimento da oferta, aceitar outro produto ou serviço equivalente ou ainda rescindir o contrato com restituição)",
        [
          "Você acha que a propaganda foi colocada de forma confusa e complicada para visualização?",
          "O fornecedor demonstra não conter os dados utilizados para construção da mensagem publcitária?"
        ],
        //Art 37, Propaganda Enganosa
        [
          "O fornecedor deixou de informar na propaganda  / oferta uma informação essencial no produto ou serviço que você ficou interessado ou ainda, ofertou a venda um produto ou serviço não existente em seu estabelecimento? (propaganda enganosa)",
          "Você considera que a publicidade é discrimatória, te induz ao erro ou contém total ou parcialmente informações falsas?"
        ],
        "Você considera que a publicidade é discrimatória, te induz ao erro ou contém total ou parcialmente informações falsas?",
        [
          "O vendedor forneceu um produto atrelado a outro, recusou atendimento, aproveitou da sua falta de informação, reajustou preços ou informações da venda sem negociação ou ainda, produto esta fora das normas da abnt?",
          "O vendedor disse que só poderia adquirir um produto ou serviço se adquirisse um outro diferente produto ou serviço?",
          "O vendedor recusou atendimento a ti mesmo em condições de prestar o serviço ou com disponibilidade de estoque ou ainda sem justificativa?",
          "Te enviaram um produto ou serviço sem solicitação feita por ti e em seguida te cobraram por isso?",
          "O vendedor lhe vendeu um produto ou serviço utilizando sua falta de informação sobre os mesmo para realizar a venda? Que informação ele disse ou deixou de dizer propositalmente para que fosse feita a cobrança por ti? Nesses casos, é preciso de um acompanhando melhor do caso.",
          "O fornecedor lhe fez uma cobrança indevida por algum serviço não prestado ? (lucro excessivo)",
          "O fornecedor te vendeu um produto sem informar o cálculo de custos ou um serviço sem autorização para ser feito",
          "Fornecedor te passou uma informação incorreta, maliciosa ou tendenciosa na compra do produto ou serviço?",
          "Um dos produtos ofertados pelo fornecedor está fora das normas da ABNT ou outra instituição oficial de medidas?",
          "Você ofereceu o pagamento imediato (dinheiro) porém o fornecedor negou dizendo que não aceita pagamento no momento que decidiu a compra e só aceita compras a prazo (cartão, cheque, vales)?",
          "O fornecedor lhe fez uma cobrança indevida por algum serviço não prestado ? (lucro excessivo)",
          "Fornecedor reajustou os valores dos produto ou serviço sem previa negociação, diferente do estabelecido no contrato?",
          "Na compra do bem ou serviço, o fornecedor não estabeleceu datas e turno da entrega do mesmo ou/e não disponibilizou direito de escolha a você?",
          "Fornecedor reajustou os valores dos produto ou serviço sem previa negociação, diferente do estabelecido no contrato?",
          "O estabelecimento que você acessou na busca de um serviço ou compra continha maior número de consumidores permitidos pela autoridade oficial para o local? Conseguiu registrar o momento de alguma forma (foto, vídeo, horario, testemunha) ?"
        ],
        //Art 40
        [
          "O fornecedor estipulou um outro valor para pagamento do serviço ou produto diferente do escrito no orçamento feito em até 10 dias atrás?",
          "O fornecedor aumentou o orçamento de um produto ou serviço sem aviso ou não discutiu contigo antes de alterar e solicita que você pague esse acrescimo ?",
        ],
        "O fornecedor vendeu um produto ou serviço fora do valor estabelecido pela instituição oficial? (só responda sim se o preço seguir de um tabelamento oficial)",
        //Art 42
        [
          "Você sofreu algum tipo de constrangimento/ameaça durante a cobrança de débitos ou foi solicitado cobrança de taxa indevida ou desconhecida?",
          "Você foi solicitado a pagamento de um serviço ou produto através de um documento que não possui informações suficientes acerca do fornecedor (cpf, cnpf, endereço, nome) ?"
        ],
        //Art 43
        [
          "O fornecedor nega informar todas as informações contidas em seu banco de dados a seu respeito ?",
          "Os seus dados cadastrados no banco do fornecedor possuem informações duvidosas e/ou possuem informções negativas a mais de 5 anos?",
          "Você foi cobrado ou não informado sobre uma compra registrada no banco de dados que não realizou?",
          "O arquivista ou responsável pelo banco de dados com seus registros negou sua solicitação para correção dos dados ou não comunicou eventuais destinatários a respeito das informações incorretas?",
          "Você encontrou seus dados sendo veiculado em entidades de caráter privado? (viola também a garantia a intimidade e vida privada)",
          "Passado o período de registro de inadimplencia no banco de dados público ou privado, você teve dificuldade em realizar compras ou emprestimos em algum fornecedor / vendedor de produto ou serviço?",
          "Você, consumidor com deficiente, foi impossibilitado de visualizar  seus dados no banco por causa de inacessibilidade?"
        ],
        "Você realizou uma queixa em um orgão publica e esta não pode ser armazenada e retida para consulta posteriormente ou sua queixa não pôde ser registrada?",
        "-",
        "O fornecedor obrigou a aceitar uma clausula contratual sem a oportunidade de ler e verificar previamente ou ainda,  o fornecedor dificultou a compreensão do contrato?",
        "Você assinou um contrato que contém clausulas contratuais duvidosas em que o fornecedor só as interpreta ao favor dele?",
        "O fornecedor antes de enviar um contrato legal a ti pelo produto ou serviço, comunicou ou preparou algum documento prometendo algumas caracteristicas acerca do serviço ou produto porém o mesmo não pode ser encontrado no contrato?",
        "Você arrependeu-se do plano assinado fora do estabelecimento comercial, solicitou o cancelamento do plano contratual assinado em até 7 dias atrás e o pedido foi negado pelo fornecedor?",
        //Art 50
        "O produto ou serviço que realizou não foi respeitado pela garantia ou teve sua garantia invalidada pelo fornecedor afirmando que a mesma já havia sido utilizada por uma troca de defeito anterior?",
        [
          "Você assinou algum contrato com o fornecedor durante a compra ou pagamento pelo serviço e percebeu que o contrato contém clausulas abusivas??",
          "No regulamento ou contrato indicado pelo fornecedor, ele diminui ou anula seus direitos acerca de devolução, substituição ou reembolso em caso de falhas, defeitos ou outros vícios associados ao produto / serviço ?",
          "No regulamento ou contrato indicado pelo fornecedor, ele diminui ou anula seus direitos acerca de devolução, substituição ou reembolso em caso de falhas, defeitos ou outros vícios associados ao produto / serviço ?",
          "O fornecedor não assume a falha do prejuízo exercido pelo serviço ou incluso no produto e transfere culpa para terceiros?",
          "O fornecedor estabeleceu obrigações no contrato que te deixou em desvantagem exagerada acerca do roduto ou serviço que adquiriu?",
          "-",
          "-",
          "O fornecedor estabelece no contrato que no caso de conflito você PRECISA aceitar e comunicar-se com um arbitro para tentar solucionar seu problema ao invés de diretamente a justiça/ consumidor?",
          "O fornecedor impõe um representante para realizar e tomar decisões de negocio por você?",
          "O fornecedor obriga você a cumprir  o disposta no contrato enquanto ele pode sair quando quiser ?",
          "O fornecedor diz em contrato que ele pode variar o preço acordado sem informar a você?",
          "É estabelecido que o fornecedor pode desistir do contrato quando quiser sem aviso prévio e negociação contigo?",
          "O fornecedor te obriga a você consumidor a ressarcir custos da sua obrigação sem oferecer o mesmo a ti em casa de falhas ?",
          "O fornecedor afirma que poderá modificar o conteúdo ou qualidade do contrato após adesão do contrato e sem acordo de negociação contigo (consumidor)?",
          "O fornecedor dá liberdade a si mesmo de infringir normais ambientais?",
          "Você acha que as clausulas contratuais inferem ou estão em desacorod com o Sistema de Proteção ao Consumidor? Isto é, restringe direitos e obrigações fundamentais do consumidor?",
          "O fornecedor não garante o direito de indenização em casos de vícos (defeito, falhas, indevido a consumo, prejudicial) ?",
        ],
        "O fornecedor antes de gerar o financiamento ou prestações não informa previamente o preço do produto ou serviço em moeda naciona, juros e acrescimos legais, número e periodo de prestações e soma total a pagar ou ainda não dá direito a liquidação total ou parcial da prestação ou financiamento ?",
        "Você, após pagar total ou parcialmente prestações não teve direito a retorno do valor pago após se retirar do consórcio? (Prestações pagas foram todas anuladas pela contrato.)",
        //Art 54
        [
          "O fornecedor inseriu uma nova clausula no formulario do contrato e você suspeita que isso seja infração perante ao código de defesa do consumidor?",
          "O fornecedor de um bem que você adquiriu induz a idéia de que você não pode cancelar o contrato (clausula resolutória ou rescisória)?",
          "O contrato criado e oferecido a você pelo fornecedor possui termos estranhos ou de dificil compreensão ou ainda está escrito em fonte muito pequena isto é, menor que 12 ?",
          "No contrato que vc aderiu ou está prestes a aderir, possui clausulas que limitam o direito do consumidor e não foram indicadas em destaque no documento?",
        ]
      ]
    } 
  },
  watch: {
    "vueHeader.claimData": function (newValue, oldValue) {
        this.claimData= vueHeader.claimData;
    },
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
        app.phValue = "Gostaria de realizar outra queixa?"
      }else{
        app.phValue = "Olá! Como posso ajuda-lo ?"
      }
    }
  },
  methods: {
    //chatbot methods
    isEnterKey: function(e){
      if(e.keyCode == "13"){
        e.preventDefault();
      }
    },
    ajaxSearch: function(e){
      config = {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      };

      axios.get('/elastic/?q='+app.keywords, config).then(function (res){
        app.hits = res.data.hits


        //app.hits.hits.length = tell how many results were found.
        if(app.hits.hits.length> 0){
          
          //always clear this variable before pushing new results to the page
          app.resultUnits = []

          //configured to show results as section or articles?
          if(app.configSearchStruct=="section"){

            app.resultsTitle = "Documentos ("+app.hits.hits.length+") :";

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

          }else{ //split Document in articles

            var j=0;

            app.hits.hits.forEach(function(val, i){

              tempContent = val._source.content

              //split document in articles units
              //var articles is an array containing content-data of the articles.
              //groupArticles[0] == content of the first article in this section... and on on.

              let groupArticles = splitDocument(tempContent, app.configSearchStruct);

              //highlight words in the articles that matches with the keywords from the user claim
              //if it doesnt find a match, article is excluded
              groupArticles = highlight(groupArticles, app.configSearchStruct);
            
              for(var k=0;k<groupArticles[0].length;k++){
              
                app.resultUnits.push({
                  divId: 'resultUnit-'+j,
                  span1Id: 'ruStatus-'+j,
                  data: groupArticles[0][k], //text content
                  artId: groupArticles[1][k] //number of the article
                });

                j++;
              }
            });

            app.resultsTitle = "Documentos ("+j+") :";

          }
          //now that the vue.instances are populate, we can visualize the content in the page
          app.resultsBool = true;
          app.hits = "";

          //checks if there is already an article too similar to that one based on the keywords
          //[1] if there is, then do not register claim at db, shows the one that is already registered.
          //[2] if not, start the chatbot 
          axios.post('/historical_learning/searchMostSimilarClaim', {
            myKeywords: app.keywords 
          })
          .then(function (res){
            //if(claim returned is higher than 95, select claim and article from the database
            vueHeader.removeLoadingDiv();

            if(res.data.ratio > 95){
              alert("Encontrei uma queixa muito similar ao seu caso!");
              console.log(`Grau de Similaridade da queixa encontrada: ${res.data.ratio}`);
              axios.post('/historical_learning/selectClaimById', {
                claimId: res.data.claimId 
              })
              .then(function (res){

                app.showCaseToUser(res.data);
              });
            }else{
              //iniciate chatbot with the user based on the result that we have in app.resultUnits
              startChatbot();
            }
          })
          .catch(function(err){
            console.log(err);
            console.log("Erro: searchMostSimilarClaim");
            alert(`Erro de conexão com o servidor aconteceu. Tente novamente.`);
            location.href = "/";
          });

        }else{
          vueHeader.removeLoadingDiv();
          app.results = "Não encontrei nada relacionado. Poderia escrever novamente com outras palavras?"
          alert(app.results);
          app.chatbotStartedBool = false;
          app.resultsBool = false;
          app.results = "";
          app.claimData = "";
        }
      }).catch(function (error){
          console.log(error);
          app.chatbotStartedBool = false;
          alert("Erro ao tentar conectar ao elastic search.");
          location.href = "/";
      });
    },
    showPosTagger: function(){
      app.posDivShow = !app.posDivShow; 
    },
    showKeywords: function(){
      app.kwordsDivShow = !app.kwordsDivShow;
    },
    toggleConfigDiv: function(bool){
      app.configDivBool = bool;
    },
    showClaimText: function(){
      app.reportClaimTitleBool=!app.reportClaimTitleBool;
    },
    sendMessage: function(e){
      //if user pressed enter and inputChat bot is different from empty AND there is 
      //already at least one message from bot then insert message from user
      if((e.key == "Enter" || e.type == "click") && (this.inputChatbot != "") && (this.nMsgsBot > -1)){
       
        app.msgUnits.push({
          id: 'user-msg-div-'+this.nMsgsBot,
          class: 'div-user msg-unit-el',
          data: this.inputChatbot 
        });
        this.nMsgsUser++;

        this.inputChatbot = "";

        let elContentMsgs = document.getElementById("content-msgs");
        setTimeout(function(){
          elContentMsgs.scrollTop = elContentMsgs.scrollHeight;
        }, 200);
      }else if(this.nMsgsBot == -1){
        alert("Digite sua queixa no início da página");
        app.inputChatbot = "";
      }
    },
    sendMessageBot: function(msg){

        app.msgUnits.push({
          id: 'bot-msg-div-'+this.nMsgsBot,
          class: 'div-bot msg-unit-el',
          data: msg
        });
        this.nMsgsBot++;

        let elContentMsgs = document.getElementById("content-msgs");
        setTimeout(function(){
          elContentMsgs.scrollTop = elContentMsgs.scrollHeight;
        }, 200);
    },
    showCaseToUser: function(caseClaim, flagPrevious){
      
      app.viewCase = caseClaim;

      if(flagPrevious === undefined)
        flagPrevious = false;

      /*
      caseClaim.subject
      caseClaim.claimId
      caseClaim.artId
      caseClaim.claimText
      caseClaim.artText
      caseClaim.votePos
      caseClaim.voteNeg
      caseClaim.keywords
      */
      
      //show the article found by the system the endorces the claim of the user
      let overlayDiv = document.querySelector(".overlay");
      if(!overlayDiv){
        //add overlay
        let bodyEl = document.querySelector("body");
        overlayDiv = document.createElement("div");
        overlayDiv.className = "overlay";
        bodyEl.appendChild(overlayDiv);
      }
      app.reportClaimTitleBool = true;

      //reload div-report-voting (go and back events of browser)
      app.suggestionTitleBool = true;
      app.voteButtons = [];
      app.voteButtons.push({id: "vote-pos", count: app.viewCase.votePos},{id: "vote-neg", count: app.viewCase.voteNeg});

      //remove message of thanks if necessary (user previously already voted on the last claim
      //reset other message from previous claims accessed
      app.thanksVotingBool = false; 
      app.emptySimilarCasesMessage = false;
      app.gridSimilarClaims.data = [];
      app.gridSimilarClaims.columns = [];

      let divReportEl = document.querySelector(".div-view-report");
      divReportEl.style.display = "block";

      document.getElementById("header-claim").scrollIntoView();

      //Salvar antiga url da pagina
      let oldUrl = window.location.pathname;
      let newUrl = "";

      if(caseClaim.claimId != undefined){
        let divReportContentEl = document.querySelector(".div-report-content");
        divReportContentEl.innerHTML = caseClaim.artText;

        let divReportSubjectEl = document.querySelector(".div-report-subject"); 
        divReportSubjectEl.innerHTML = caseClaim.subject;

        //atualiza url do navegador
        if(flagPrevious == false){
          //caso flagPrevious tenha sido ativada (usuario clicou em voltar no navegador)
          newUrl = `/view/?claimId=${caseClaim.claimId}`
          window.history.pushState({claimId: caseClaim.claimId}, "claim", newUrl);
        }

      }else{
        alert("Erro grave com caseClaim (home.js). Contacte o admnistrador do sistema");
      }

      //When report is iniciated, shows links to similar claims
      //:TEST searchSimilarClaims
      if(!Array.isArray(caseClaim.keywords)){
        caseClaim.keywords = caseClaim.keywords.split(",");
      }
      axios.post('/historical_learning/searchSimilarClaims', {
        myKeywords: caseClaim.keywords
      })
      .then(function (res){

        if(res.data.claims.length >0){
          app.gridSimilarClaims.data = [];
          app.gridSimilarClaims.columns = ["subject", "artId", "claimText", "similarity"];

          res.data.claims.forEach(function(val, i){

            let obj = {};

            obj.subject = val.subject;
            obj.claimId = val.id;
            obj.artId = val.art_id;
            obj.claimText = val.claim_text;
            obj.artText = val.text;
            obj.similarity = val.similarity;
            obj.votePos = val.votePos;
            obj.voteNeg = val.voteNeg;
            obj.keywords = val.keywords;

            app.gridSimilarClaims.data.push(obj);
          });
        }else{
          //put message to user
          app.emptySimilarCasesMessage = true;
          
        }
      });
    },
    //recursive request to questions
    generateQuestionsToUser: function(previousArt){
      //flag that indicates that the system could identify the claim typed from the user
      let questionIndex;

      while(app.resultUnits.length > 0 && previousArt && (previousArt.artId == app.resultUnits[0].artId)){
        console.log(`Question repeated removed. Previous article number was:`);
        console.log(previousArt.artId);
        app.resultUnits.shift();
      }

      //eliminate questions that are vetoed
      if(app.resultUnits.length>0){
        questionIndex = parseInt(app.resultUnits[0]["artId"])-1; 
        console.log("Question related to Article Number: "+app.resultUnits[0]["artId"]);
      }

      while((app.resultUnits.length>0)&&(app.questions[questionIndex] == "-")){

        if(app.questions[questionIndex] == "-"){
          console.log("Question skiped: 'artigo vetado'");
          app.resultUnits.shift();
        }

        //recalculate and check next question if is 'vetado'
        questionIndex = parseInt(app.resultUnits[0]["artId"])-1; 
        console.log("Question related to Article Number: "+app.resultUnits[0]["artId"]);
      }

      if(app.resultUnits.length>0){
       
        //send question to the user
        if(typeof(app.questions[questionIndex]) == typeof {}){
          console.log(app.questions[questionIndex][0]);
          app.sendMessageBot(app.questions[questionIndex][0]);
        }else{
          //question doesnt include "incisos". there is only one subject for this article co-related
          //parameter contain a string including the question
          app.sendMessageBot(app.questions[questionIndex]);
        }

        //wait for the user response
        let number = app.nMsgsUser;

        let intervalMsg = setInterval(function(){
          if(app.nMsgsUser > number){

            let lastAnswer = app.msgUnits[app.msgUnits.length-1]["data"].toLowerCase();
            console.log("Answer identified: "+lastAnswer);

            //check if user answered with a positive or negative response
            if((app.positiveAnswers.indexOf(lastAnswer) == -1) && (app.negativeAnswers.indexOf(lastAnswer) == -1)){
              app.sendMessageBot("Não entendi sua resposta, responda de forma clara por favor.");
              //resend question
              if(typeof(app.questions[questionIndex]) == typeof({})){ 
                app.sendMessageBot(app.questions[questionIndex][0]);
              }else{
                app.sendMessageBot(app.questions[questionIndex]);
              }
              number = app.nMsgsUser;
            }else{
              clearInterval(intervalMsg);

              if(app.positiveAnswers.indexOf(lastAnswer) > -1){
                let similarClaim = {};

                //call function to show claim to user passing blank obj as parameter. meaning that the claim info
                //is at the app.resultUnits[0]["artId"], app.resultUnits[0]["data"] (content of the article).
               
                //alert("Nova queixa identificada");
                console.log(`artigo relacionado: ${app.resultUnits[0]["artId"]}`);

                let divReportContentEl = document.querySelector(".div-report-content");
                divReportContentEl.innerHTML = app.resultUnits[0]["data"];

                //convert app.keywords tipo 'object' para 'string' para inserir no banco de dados
                let keywords = "";
                app.keywords.forEach(function(val, i){
                  //console.log(i, app.keywords.length);
                  if(i < (app.keywords.length-1)){
                    keywords+= val+",";
                  }else{
                    keywords+= val;
                  }
                });
                
                //Envia requisição ajax para registrar queixa no servidor.
                axios.post('/historical_learning/create', {
                  claim_text: app.claimData,
                  keywords: keywords,
                  article_number: app.resultUnits[0]["artId"]
                })
                .then(function (res){

                  //collect the just new registed claim in db and show to user
                  axios.post('/historical_learning/selectClaimById', {
                    claimId: res.data.claimId 
                  })
                  .then(function (res){
                    app.showCaseToUser(res.data);
                  })
                  .catch(function(err){
                    console.log("Erro: selectClaimById");
                    alert(`Erro de conexão com o servidor aconteceu. Tente novamente.`);
                    location.href = "/";
                  });
                })
                .catch(function(err){
                  console.log("Erro: create");
                  alert(`Erro de conexão com o servidor aconteceu. Tente novamente.`);
                  location.href = "/";
                });

              //negative answer
              }else{
                console.log("Sending another message");
                //since the user answered "No" as answer, the system removes the article as possiblity for the answer to the user
                let previousArt = app.resultUnits.shift();
                console.log(app.resultUnits);

                //generate next question (recursive call)
                app.generateQuestionsToUser(previousArt);
              }
            }
          }else{
            console.log("waiting for the user response");
          }
        }, 2000);
      }else{
        //#TODO add other questions to non cdc related claims
        //app.generateExtraQuestions();

        //Não há mais perguntas para serem feitas ao usuário.. :(
        app.sendMessageBot("Não tenho mais perguntas que poderiam estar relacionadas com sua queixa. Ainda estou aprendendo... ");
        app.sendMessageBot("Se puder me ajudar, me diga com suas palavras qual seria a solução para sua queixa. Assim na proxima vez talvez eu possa ajudar você ou alguém com o mesmo problema!");
        app.newSuggestionAnswerBool = true;

        //wait for answer
        let number = app.nMsgsUser;

        let intervalMsg = setInterval(function(){
          if(app.nMsgsUser > number){

            clearInterval(intervalMsg);

            let lastAnswer = app.msgUnits[app.msgUnits.length-1]["data"].toLowerCase();

            //TODO: cadastrar sugestao digitada no banco de dados

            let overlayDiv = document.querySelector(".overlay");
            if(!overlayDiv){
              //add overlay
              let bodyEl = document.querySelector("body");
              overlayDiv = document.createElement("div");
              overlayDiv.className = "overlay";
              bodyEl.appendChild(overlayDiv);
            }

            if(app.expBool){
              axios.post('/user/registerExperiment', {
                termName: app.termName,
                claimId: 0,
                userVote: false,
                suggestionExp: "Chatbot não mostrou uma pergunta relacionada a minha queixa.",
              })
              .then(function (res){
                //force page to redirect to 'preexperimento' page
                app.termName = "";
                app.expBool = false;
                app.alertDiv("Sua participação foi registrada com sucesso. Para finalizarmos, favor responder esse pequeno questionário, Obrigado!", "experiment");
              });
            }else{
              alert("Obrigado. Espero te ajudar na próxima :)");
              //atualiza a pagina
              location.href = "/";
            }
          }
        }, 2000);
      }
    },
    voteClaim: function(vote_id){
      //All the info about the case is inside of ViewCase : app.viewCase

      //removes informative info for voting
      let div_voting = document.querySelector(".div-report-voting");
      app.voteButtons = []

      //div_suggestion.parentNode.removeChild(div_suggestion);
      app.suggestionTitleBool = false;

      //added div with message of Thanks.
      /*
      let thanksVoting= document.createElement("div");
      let content = document.createTextNode("Seu voto foi computado com sucesso. Obrigado por participar");
      thanksVoting.appendChild(content);
      thanksVoting.className = "thanks-voting";
      div_voting.appendChild(thanksVoting);
      */

      //initializing vars
      app.thanksVotingBool = true;
      app.voteClaimBool = true;
      app.viewCase.userVote = false;

      //getting value of user vote
      if(vote_id === "vote-pos"){
        app.viewCase.userVote = true;
      }

      let claimId = 0;
      if(app.viewCase){
        claimId = app.viewCase.claimId; 
        axios.post('/historical_learning/voteclaim', {
          voting: vote_id,
          claimId: claimId 
        })
        .then(function (res){
          //console.log("Voto registrado com sucesso");
        })
        .catch(function(err){
          console.log("Voto não foi registrado. Segue erro abaixo:");
          console.log(err);
        });
      }

    },
    clearReportDiv: function(){
      window.location = "/";
    },
    generatePDF: function(){

      let userInfo = {}

      if(app.userId != ""){

        axios.post('/user/getUserInfoById', {
          userId: app.userId
          //userId: 111
        }).then((res)=>{

          userInfo = res.data.userInfo;

          let docDefinition = {
            content : [
              /* center table
              {
                columns: [
                  { width: '*', text: '' },
                  {
                    width: 'auto',
                    table: {
                      body: [
                        ['Column 1', 'Column 2', 'Column 3'],
                        ['One value goes here', 'Another one here', 'OK?']
                      ]
                    }
                  },
                  { width: '*', text: '' },
                ]
              },
              */
              {
                table: {
                  widths: [150, '*'],
                  body: [
                    [
                      {
                        border: [true, true, false, true],
                        width: 25,
                        fillColor: '#1c227c',
                        alignment: 'right',
                        image: "data:image/png;base64,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",
                      },
                      {
                        border: [false, true, true, true],
                        fontSize: 16, 
                        margin: [0,4,0,4],
                        fillColor: '#1c227c',
                        color: 'white',
                        text: "MeusDireitosConsumidor.com.br",
                        alignment: 'left',
                        bold: true
                      }
                    ]
                  ]
                }
              },
              {
                table: {
                  widths:[55, '*', 55, '*'],
                  body:[
                    //row one
                    [
                      {
                        text: "Nome:",
                        bold: true
                      },
                      {
                        text: userInfo.name
                      },
                      {
                        text: "CPF:",
                        bold: true
                      },
                      {
                        text: userInfo.cpf
                      }
                    ],
                    //row two
                    [
                      {
                        text: "Email:",
                        bold: true
                      },
                      {
                        text: userInfo.email
                      },
                      {
                        text: "Telefone:",
                        bold: true
                      },
                      {
                        text: userInfo.phone
                      }
                    ]
                 ]
                }
              },
              {
                table: {
                  widths:[55, 100, 100, '*'],
                  body:[
                    //row one
                    [
                      {
                        border: [true, false, true, true],
                        text: "CEP:",
                        bold: true
                      },
                      {
                        border: [true, false, true, true],
                        text: userInfo.address_cep
                      },
                      {
                        border: [true, false, true, true],
                        text: "Logradouro:",
                        bold: true
                      },
                      {
                        border: [true, false, true, true],
                        text: userInfo.address_street
                      }
                    ]
                  ]
                }
              },
              {
                table: {
                  widths:[55, 100, 100, '*'],
                  body:[
                    //row one
                    [
                      {
                        border: [true, false, true, true],
                        text: "Numero:",
                        bold: true
                      },
                      {
                        border: [true, false, true, true],
                        text: userInfo.address_number
                      },
                      {
                        border: [true, false, true, true],
                        text: "Complemento:",
                        bold: true
                      },
                      {
                        border: [true, false, true, true],
                        text: userInfo.address_complement
                      }
                    ]
                  ]
                }
              },
              {
                table: {
                  widths:[55, 130, 70, '*'],
                  body:[
                    //row one
                    [
                      {
                        border: [true, false, true, true],
                        text: "Bairro:",
                        bold: true
                      },
                      {
                        border: [true, false, true, true],
                        text: userInfo.address_district
                      },
                      {
                        border: [true, false, true, true],
                        text: "Cidade-UF:",
                        bold: true
                      },
                      {
                        border: [true, false, true, true],
                        text: `${userInfo.address_city}-${userInfo.address_state}`
                      }
                    ]
                  ]
                }
              },
              {
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        fontSize: 14, 
                        margin: [0,4,0,4],
                        fillColor: '#1c227c',
                        color: 'white',
                        border: [true, false, true, true],
                        text: "Queixa descrita pelo cidadão:",
                        alignment: 'center',
                        bold: true
                      }
                    ],
                    [
                      {
                        border: [true, false, true, true],
                        text: app.viewCase.claimText,
                      }
                    ]
                  ]
                },
                layout: {
                  defaultBorder: false,
                }
              },
              {
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        fontSize: 14, 
                        margin: [0,4,0,4],
                        fillColor: '#1c227c',
                        color: 'white',
                        text: "O Artigo que pode pode endossar seu caso é descrito abaixo:",
                        alignment: 'center',
                        bold: true
                      }
                    ],
                    [
                      {
                        text: `${app.viewCase.subject}\n${app.viewCase.artText}`,
                      }
                    ],
                    [
                      {
                        fontSize: 14, 
                        margin: [0,4,0,4],
                        fillColor: '#1c227c',
                        color: 'white',
                        text: "Informações Adicionais:",
                        alignment: 'center',
                        bold: true
                      }
                    ],
                    [
                      {
                        text: `Esse sistema te auxilia a encontrar informações legais baseado na queixa digitada porém não tem caráter decisório.\n
                        Para ajuizar a queixa ou iniciar um processo para solucionar seu problema entre em contato com o Procom responsável do seu município através do link abaixo:\n
                        http://www.portaldoconsumidor.gov.br/procon.asp?acao=buscar \n
                        Ou ainda entre em contato com o Serviço de Atendimento ao Consumidor (SAC) do seu munícipio.\n
                        No exemplo abaixo temos o link para agendamento de queixas em Salvador-Ba:\n
                        http://www.sac.ba.gov.br/index.php/Servicos-de-parceiros/Servicos-do-TJ-BA-%E2%80%93-Tribunal-de-Justica-da-Bahia/SAJ-%E2%80%93-Servico-de-Atendimento-Judiciario.html`,
                      }
                    ]
                  ]
                }
              }
            ]
          }

          // download the PDF
           pdfMake.createPdf(docDefinition).open();
           //pdfMake.createPdf(docDefinition).download(`claim${app.viewCase.claimId}.pdf`);
        }).catch((err)=>{
          console.dir(err);
        });

      }else{
        //vuejs-dialog
        this.$dialog.confirm("Para gerar PDF é preciso cadastrar-se no sistema. Gostaria de se cadastrar?", {
          okText: "Sim",
          cancelText: "Não"
        }).then(function(dialog){
          window.location = "/login";
        }).catch(function(dialog){});
        
      }
    },
    finishExperiment: function(){

      console.log(app.voteClaimBool);
      console.log(app.viewCase);

      //check if user did vote before finish the experiment
      if(app.voteClaimBool){
        axios.post('/user/registerExperiment', {
          termName: this.termName,
          claimId: this.viewCase.claimId,
          userVote: this.viewCase.userVote,
          suggestionExp: this.suggestionExpData
        })
        .then(function (res){
          //force page to redirect to 'preexperimento' page
          app.termName = "";
          app.expBool = false;
          app.alertDiv("Sua contribuição foi registrada com sucesso. Para finalizarmos, favor responder esse pequeno questionário, Obrigado! =)", "experiment");
        });
      }else{
        alert("Por favor nos informe se o artigo encontrado está relacionado com sua queixa");
      }
    },
    alertDiv: function(msg, divName){
      let alertParamObj;

      if(divName && (divName == "experiment")){
        alertParamObj = {
          props: ['msgText'], 
          template: `<div class="alertBox">
                      <div class="text">{{ msgText }}</div>
                        <div class="linkQuestion">
                        Link: <a href="https://goo.gl/forms/irOkb0TIAVZbY4k53" target="_blank">https://goo.gl/forms/irOkb0TIAVZbY4k53</a>
                        </div>
                        <button class="closeAlert" @click="testinga">Ok</button>
                     </div>`,
          methods: {
            testinga: function(){
              location.href = "/";
            }
          }
        }
      }else{
        alertParamObj = {
          props: ['msgText'], 
          template: `<div class="alertBox">
                      <div class="text">{{ msgText }}</div>
                      <button class="closeAlert" @click="testinga">Ok</button>
                  </div>`,
          methods: {
            testinga: function(){
              window.location.reload();
            }
          }
        }
      }

      let reportDiv = document.querySelector(".div-view-report");
      reportDiv.parentNode.removeChild(reportDiv);

      const AlertVue = Vue.extend(alertParamObj);
      const vueAlertComp = new AlertVue({
        propsData: {
          msgText: msg
        }   
      }).$mount("#alertBox");
      vueAlertComp.msgText += '';
    }
  }
});

function startChatbot(){
  //initialize variables for chatmessages
  app.nMsgsBot = 0;
  app.nMsgsUser= 0;

  //scroll down to the chatbot div
  document.getElementById('chatbot-content').scrollIntoView();

  //make div of typing texts in chatbot to flicker
  elTypingBox = document.getElementById("typingbox");

  //focus on the input of typing message to the chatbot
  app.$refs["chatbot-input"].focus();

  //make the input field to flash for +- 9 seconds
  let cnt = 0;
  let timer = setInterval(function(){
    if (cnt==9){
      elTypingBox.style.border = "none";
      elTypingBox.style["border-bottom"] = "1px solid darkblue";
      clearInterval(timer);
    }else{
      //cnt % 2 == 1 ? app.$refs["chatbot-input"].style.border = "1px solid gray" : app.$refs["chatbot-input"].style.border = "none";
      cnt % 2 == 1 ? elTypingBox.style.border = "none" : elTypingBox.style.border = "2px solid darkblue";
    }
    cnt++;
  }, 800);

  //instanciate items of the chatbot like the claim of the user typed already, first message of chatbot...stuff
  //User claim [first message] 
  app.msgUnits.push({
    id: 'user-msg-div-'+app.nMsgsUser,
    class: 'div-user msg-unit-el',
    data: app.claimData  //user claim
  });

  //bot response [first response] 
  app.msgUnits.push({
    id: 'bot-msg-div-'+app.nMsgsBot,
    class: 'div-bot msg-unit-el',
    data: "Olá, processei sua queixa e encontrei "+app.resultUnits.length+" co-relações que podem te ajudar. Responda algumas perguntas para que eu possa lhe dar o melhor resultado :)"
  });

  app.generateQuestionsToUser();

}


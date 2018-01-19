

function checkforSynonyms(){
    
  //check if keyword has synonyms
  //if it find that keywords has synonyms, it adds all the others keywords-synonyms in the array of synonyms
  let kw = app.keywords;
  flag = false;

  for(var i=0; i < kw.length; i++){
    app.synonyms.forEach(function(ele, eli){
      //ele = element value,
      //eli =  element index

      //compares if element in array of synonyms is equal to keyword.
      //if it is indeed, it is removed from keywords array right away
      ele.forEach(function(val, vali){
        if( kw[i] == val){
          flag = true;
          kw.splice(i, 1);
        }
      });

      if(flag){
        var length = app.synonyms[eli].length;
        for(var j=0; j<app.synonyms[eli].length; j++){
          kw.unshift(app.synonyms[eli][j]);
        }
        flag = false;
        //force break of the loop
        i = kw.length;
      }
    });
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

    if(typeof(content[0])=="string"){
      content = content[0].replace(regExp, function(match){
          return "<span class='b'>"+match+"</span>";
      });
      return content[0];

    }else if(typeof(content[0])=="object"){

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

    let i=0;
    while(content.length>0){
      //.exec returns an array "result" containing [0] = the full string of characters matched, [1]..[n] substring matches if any.
      //[index] the 0-based index of the match in the string
      //[input] original string
 
      var startPosMatch = regExp.exec(content);

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

/*
Vue.component('comp-similar-claim-units',{
  template: '\
    <div :id="divId" class="simclaimUnit" @click="showCaseToUser">\
      <span :id="span1Id" class="ruIcons" v-html="value">{{ value }}</span>\
      <span class="simclaimText" v-html="data">{{ data }}</span>\
    </div>\
  '
});
*/

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
  data: function(){ //this.active and this.value acess here
    return {
      active: false,
      value: "&#8627;"
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
      claimData: ""
    }
  },
  methods: {
    ajaxSearchSW: function(e){
      //ajaxSearchSW triggered on keyup due to checking e.target.value.length which is update after a content is updated
      if(((e.key == "Enter")||(e.type == "click")) && (vueHeader.claimData != "")){
        
        app.claimData = vueHeader.claimData;

        axios.post('/ajax/stopwordsremovalPT', {
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

          // update the app.claimData with the claim content processed by the backend. 
          // app.claimData will always contain the input for the elasticsearch to search 
          // for matchs in the documents
          //app.claimData = res.data.claim;

          app.ajaxSearch(e);
        })
        .catch(function(err){
          console.log(err);
        });
      }else{
        if(e.target.tagName === "INPUT" && e.target.value.length > 25){
          let textareaComponent = Vue.extend({
            template: '\
              <textarea id="textarea-claim" autofocus>{{ this.claimData }} </textarea>\
            ',
            data: function(){
              return {
                claimData: vueHeader.claimData
              }
            },
            mounted: function(){
              this.$nextTick(function(){
                //code that will run only after the
                //entire view has been rendered
              })
            }
          });

          //this will replace #textarea-claim
          new textareaComponent().$mount('#textarea-claim');

          let elClaim = document.getElementById("textarea-claim");
          elClaim.focus();
          
        }
      }
    }
  }
}); 

var app = new Vue({
  el: '#div-chatbot',
  data: function(){
    return {
      claimData: "",
      claimDataSW: "", //contains the message of keywords of claim
      keywords: "",
      synonyms: [
        ["volta", "reembolso", "devolução"],
        ["tempo", "dias"],
        ["uso", "vícios", "defeito", "falha"],
        ["pagamento", "cobrança"],
        ["anuncio", "anunciando", "publicidade"]
      ],
      outputBool: false,
      posBool: false, //indicate to system if it should apply the POS Tagger on the claim or not
      posResult: "", // var the has the contents of pos
      posDivShow: false, //shows the div content of pos taggs
      kwordsDivShow: false, //shows the content of keywords div
      configDivBool: false, //bool that sinalizes the systems if it the configDiv should be visible or not
      resultsBool: false, //bool that sinalize the systems to show the div of results
      resultsTitle: "Documentos: ",
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
      viewCase: {},
      //zero based array corresponding to i+1 article number. When i is the array index and (i+1) is the number of the article
      questions: [
        "Foi demonstrado alguma confusão pelo vendedor a respeito do papel de fornecedor ou consumidor?",
        "Ant",
        "Ant",
        "Tem alguma  dúvida em relação aos princípios de proteção ao consumidor ditado pela Politica Nacional das Relações de Consumo?",
        "Existe uma referência específica sobre as a execução dos princípios estabelecidos pela Ploticia Nacional das Relações de Consumo. Deseja visualizar?",
        [
          "O fornecimento deste produto indica risco a sua saúde e segurança de vida?",
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
        "O produto ou serviço que adquiriu apresenta algum risco a sua saúde ou segurança?",
        "No rotulo do produto ou a empresa que prestou lhe serviço que adquiriu informou devidamente a respeito da periculosidade que o mesmo apresenta?",
        "O Fornecedor sabia do perigo que o produto ou serviço apresentava e mesmo assim lhe forneceu dizendo que era de 'ótima' qualidade?",
        "-",
        "Você deseja  ter reparo dos danos causados pelo produto adquirido?",
        "Ant",
        "O fornecedor, não identificado, se nega de alguma forma a reparação do casado pelo serviço e você deseja ser indenizado pelo serviço parcialmente ou totalmente realizado?",
        "-", //Art 15
        "-",
        "-",
        //Art 18
        [
          "A empresa não solucionou o problema e você gostaria de substituir o seu produto?", 
          "A empresa não solucionou o problema e você gostaria de ter seu dinheiro de volta?",
          "A empresa não solucionou o problema e você gostaria que o preço do produto sofresse um abatimento ?",
          "Ao contactar a empresa, a mesma disse que o prazo da troca ou devolução do produto ou serviço COM DEFEITO não pode ser ampliado? (Em casos de prazos menores que 180 dias)",
          "Ao substituir por um novo produto ou serviço, o mesmo apresentou outro problema e a empresa se negou a resolve-lo?",
          "A empresa ou fornecedor diz que não tem o produto e por isso não pode efetuar troca?"
        ],
        "Lhe foi vendido um produto com medidas abaixo da informada na especificação e gostaria de ter abatimento do preço, complementação do peso / medida, substituição do produto ou restituição da quantia paga ?",
        "O fornecedor prestou serviço de má qualidade ou impróprio para consumo ou ainda e se nega a assumir pelo dano que o serviço tenha causado ou disparidade da informação contida na oferta / propaganda?",
        "O serviço prestado pela empresa utilizou de peças usadas ou inadequadas para reparação de seu produto, isto é, fora das especificações técnicas do fabricante sem sua autorização?",
        //Art 22
        "Você recebeu algum atendimento de um órgão público que demonstrou falta de profissionalismo para solucionar seu problema? Se sim, qual serviço você precisou para solucionar seu problema e qual foi o gargalo ou inadequação encontrado em seus serviços?",
        "O fornecedor responde dizendo que não sabia que o produto vendido por ele estava neste estado e se nega a solucionar seu problema?",
        "O fornecedor nega a solucionar seu problema devido a uma clausula contratual assinado entre você e ele que diminua ou anule a obrigação dele de indeniza-lo pelo defeito ou causado?",
        "Ant",
        [
          "Fornecedor alega que a reclamação não pode ser feita porque passou do prazo do seu direito?",
          "Ant",
          "Você não tinha certeza se o produto tinha defeito e acha que percebeu tarde mais para fazer queixa do fornecedor?(vício oculto)"
        ],
        "O produto ou serviço que adquiriu te causou algum dano físico / quimico e acha que passou do prazo para tentar recorrer a reparação do dano?",
        "Está dificil identificar quem são os sócios da empresa ou eles alegam que não possuem recursos para pagamento de débitos?",
        "-",
        //Art 30
        "A oferta do produto ou serviço que viu ofereceu um determinado valor e no momento do pagamento você teve que pagar por outro valor mais alto?",
        "O produto ou Serviço que adquiriu não possuia informações claras, corretas, precisas em portugês ou suas caracteristicas, qualidades, comprosição, preço, garantia ou ainda não informava riscos que apresenta a sua saúde e segurança?",
        "O fabricantes ou importador do produto que adquiriu afirma que não possui peças de reposição para seu produto e este continua sendo fabricado e veiculado no mercado?",
        [
          "Foi oferecido a você ou você comprou um produto via telefone em que as informações do fabricante e endereço da companhia não foi informado na embalagem?",
          "Foi cobrado de você uma taxa por aceitar uma ligação telefonica feita exclusivamente para realizar propaganda do produto?"
        ],
        "A empresa representante do produto ou serviço que você adquiriu nega a responder pela responsabilidade do dano",
        //Art 35
        "O fornecedor do produto ou serviço recusou a cumprir a oferta publicada pelo mesmo e não foi oferecido a você a escolha de um dos seguintes items ? (exigir cumprimento da oferta, aceitar outro produto ou serviço equivalente ou ainda rescindir o contrato com restituição)",
        [
          "Você acha que a propaganda foi colocada de forma confusa e complicada para visualização?",
          "O fornecedor demonstra não conter os dados utilizados para construção da mensagem publcitária?"
        ],
        //Art 37, Propaganda Enganosa
        [
          "O fornecedor deixou de informar na propaganda  / oferta uma informação essencial no produto ou serviço que você ficou interessado ou ainda, ofertou a venda um produto ou serviço não existente em seu estabelecimento? (propaganda enganosa)",
          "Você considera que a publicidade é discrimatória, te induz ao erro ou contém total ou parcialmente informações falsas?"
        ],
        "-",
        [
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
          "Ant"
        ],
        "O fornecedor vendeu um produto ou serviço fora do valor estabelecido pela instituição oficial? (só responda sim se o preço seguir de um tabelamento oficial)",
        [
          "Você foi exposto sofreu algum tipo de constrangimento ou ameaça durante a cobrança de débitos ou foi cobrado indevidamente?",
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
        "Você arrependeu-se do plano assinado, solicitou o cancelamento do plano contratual assinado em até 7 dias atrás e o pedido foi negado pelo fornecedor?",
        //Art 50
        "O produto ou serviço que realizou não foi respeitado pela garantia ou teve sua garantia invalidada pelo fornecedor afirmando que a mesma já havia sido utilizada por uma troca de defeito anterior?",
        [
          "Você assinou algum contrato com o fornecedor durante a compra ou pagamento pelo serviço?",
          "No regulamento ou contrato indicado pelo fornecedor, ele diminui ou anula seus direitos acerca de devolução, substituição ou reembolso em caso de falhas, defeitos ou outros vícios associados ao produto / serviço ?",
          "Ant",
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
        "Você, após pagar total ou parcialmente prestações não teve direito a retorno do valor pago após se retirar do consórcio ",
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


      console.log("app.claimData: ", app.claimData);

      axios.get('/elastic/?q='+app.keywords, config).then(function (res){
        app.hits = res.data.hits

        //debug in log results found
        //console.log(app.hits.hits);

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
            console.log(app.keywords);

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
                  data: groupArticles[0][k],
                  artId: groupArticles[1][k]
                });

                j++;
              }
            });
            app.resultsTitle = "Documentos ("+j+") :";

          }
          //now that the vue.instances are populate, we can visualize the content in the page
          app.resultsBool = true;
          app.hits = "";

          //iniciate chatbot with the user based on the result that we have in app.resultUnits
          startChatbot();

        }else{
          app.results = "Não encontrei nada relacionado. Poderia escrever novamente com outras palavras?"
          alert(app.results);
          app.resultsBool = false;
          app.results = "";
          app.claimData = "";
        }
      }).catch(function (error){
          console.log(error);
          alert("Erro ao tentar conectar ao elastic search.");
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
    //chatbot methods
    sendMessage: function(e){
      //if user pressed enter and inputChat bot is different from empty AND there is 
      //already at least one message from bot then insert message from user
      if((e.key == "Enter") && (this.inputChatbot != "") && (this.nMsgsBot > -1)){
       
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
    showCaseToUser: function(caseClaim){

      console.log("caseClaim");
      console.log(caseClaim);

      /* Exemplo do obj da queixa similar encontrada:
       *
        artId: 51
        artSubject: test 
        artText:"iaksdjlasds"
        id:311
        voteNeg:0
        votePos:1
      */

      app.viewCase = caseClaim;
      
      //show the article found by the system the endorces the claim of the user
      let overlayEl = document.querySelector(".overlay");
      overlayEl.style.display = "block";

      let divViewReportEl = document.querySelector(".div-view-report");
      divViewReportEl.style.display = "block";

      document.getElementById("header-claim").scrollIntoView();

      //Salvar antiga url da pagina
      let oldUrl = window.location.pathname;
      let newUrl = "";

      if(caseClaim.id != undefined){
        alert("Foi encontrado uma queixa muito similar ao seu caso!");
        console.log(caseClaim);

        let divReportContentEl = document.querySelector(".div-report-content");
        divReportContentEl.innerHTML = caseClaim.artText;

        let divReportSubjectEl = document.querySelector(".div-report-subject"); 
        divReportSubjectEl.innerHTML = caseClaim.artSubject;

        newUrl = `/view/?claimId=${caseClaim.id}`

      }else{
        alert("Queixa nova identificada");

        newUrl = `/view/?claimId=${req.session.currclaimid}`

        let divReportContentEl = document.querySelector(".div-report-content");
        divReportContentEl.innerHTML = app.resultUnits[0]["data"];

        //TODO: shows here also the subject of the article related

        //register claim at the history
        console.log("Segue abaixo informações para historico_aprendizado");
        console.log("Keywords: "+app.keywords);
        console.log("Artigo relacionado: "+app.resultUnits[0]["artId"]); 

        //Envia requisição ajax para registrar queixa no servidor.
        var request = new XMLHttpRequest();
        request.open('POST', '/historical_learning/create', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({
          keywords: app.keywords,
          article_number: app.resultUnits[0]["artId"]
        }));

      }

      //let stateObj = { foo: "claim" }
      window.history.pushState("", "claim", newUrl);
    },
    //recursive request to questions
    generateQuestionsToUser: function(){
      //flag that indicates that the system could identify the claim typed from the user
      let questionIndex;

      if(app.resultUnits.length>0){
       
        console.log("Queston related to Article Number: "+app.resultUnits[0]["artId"]);
        questionIndex = parseInt(app.resultUnits[0]["artId"])-1; 

        //console.log(typeof(app.questions[questionIndex]));

        //send question to the user
        if(typeof(app.questions[questionIndex]) == "object"){
          console.log(app.questions[questionIndex][0]);
          app.sendMessageBot(app.questions[questionIndex][0]);
        }else{
          //question doesnt include "incisos". there is only one quest for this article co-related
          //parameter contain a string including the question
          app.sendMessageBot(app.questions[questionIndex]);
        }

        //wait for the user response
        let number = app.nMsgsUser;

        let intervalMsg = setInterval(function(){
          if(app.nMsgsUser > number){

            let lastAnswer = app.msgUnits[app.msgUnits.length-1]["data"].toLowerCase();
            console.log("Answer identified: "+lastAnswer);

            if(lastAnswer != "sim" && lastAnswer != "não"){
              app.sendMessageBot("Não entendi sua resposta, responda de forma clara por favor.");
              //resend question
              app.sendMessageBot(app.questions[questionIndex][0]);
              number = app.nMsgsUser;
            }else{
              clearInterval(intervalMsg);

              if(lastAnswer == "sim"){
                let similarClaim = {};

                //checks if there is already a article too similar to that one based on the keywords and questions answered
                //[1] if there is, then do not register claim at history, shows the one that is already registered.
                //[2] if there is, then do register claim, but copy the related claim to this one.... no doesnt make sense
                //start to checck for keywords arrays:
                //
                // make a request to databse to retrieve all the keywords from the registered claims
                // question here: make the server or client process this ?
                //
                // try #1: processing by the server and return if this is a new claim or not


                //function will return a equivalent claim in case was found one. 
                axios.post('/historical_learning/searchMostSimilarClaim', {
                  myKeywords: app.keywords 
                })
                .then(function (res){
                  //if(claim returned is higher than 90, select claim and article from the database
                  if(res.data.ratio > 90){
                    
                    axios.post('/historical_learning/selectClaimById', {
                      id: res.data.claimId 
                    })
                    .then(function (res){

                      console.log("This is the similar claim found");
                      console.log(res.data);
                      app.showCaseToUser(res.data);
                      
                    });
                  }else{
                    //call function to show claim to user passing blank obj as parameter. meaning that the claim info
                    //is at the app.resultUnits[0]["artId"], app.resultUnits[0]["data"] (content of the article).
                    //new claim
                    app.showCaseToUser({});
                  }
                })
                .catch(function(err){
                  console.log(err);
                });


              }else{
                console.log("Sending another message");
                //since the user answered "No" as answer, the system removes the article as possiblity for the answer to the user
                app.resultUnits.splice(0, 1);

                //generate next question (recursive call)
                app.generateQuestionsToUser();
              }
            }
          }else{
            console.log("waiting for the user response");
          }
        }, 2000);
      }
    },
    voteClaim: function(voting_char){
      /*
      console.log("Keywords: "+app.keywords);
      console.log("Artigo relacionado: "+app.resultUnits[0]["artId"]);
      */

      //removes informative info for voting
      //remove div of voting
      let div_voting = document.querySelector(".div-report-voting");
      while(div_voting.firstChild) {
          div_voting.removeChild(div_voting.firstChild);
      }
      let div_suggestion = document.querySelector(".div-report-suggestion");
      div_suggestion.parentNode.removeChild(div_suggestion);

      //added div with message of Thanks.
      let thanksVoting= document.createElement("div");
      let content = document.createTextNode("Seu voto foi computado com sucesso. Obrigado por participar");
      thanksVoting.appendChild(content);
      thanksVoting.className = "thanks-voting";
      div_voting.appendChild(thanksVoting);

      let claimId = 0;
      if(app.viewCase){
        claimId = app.viewCase.id; 
      }

      axios.post('/historical_learning/voteclaim', {
        voting: voting_char,
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


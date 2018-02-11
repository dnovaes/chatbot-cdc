var db = require('../config/db.js');

var articles = {
  "1": `Art. 1° O presente código estabelece normas de proteção e defesa do consumidor, de ordem pública e interesse social, nos termos dos arts. 5°, inciso XXXII, 170, inciso V, da Constituição Federal e art. 48 de suas Disposições Transitórias.`, 
  "2": `Art. 2° Consumidor é toda pessoa física ou jurídica que adquire ou utiliza produto ou serviço como destinatário final.
  Parágrafo único. Equipara-se a consumidor a coletividade de pessoas, ainda que indetermináveis, que haja intervindo nas relações de consumo.`, 
  "3": `Art. 3° Fornecedor é toda pessoa física ou jurídica, pública ou privada, nacional ou estrangeira, bem como os entes despersonalizados, que desenvolvem atividade de produção, montagem, criação, construção, transformação, importação, exportação, distribuição ou comercialização de produtos ou prestação de serviços.
§ 1° Produto é qualquer bem, móvel ou imóvel, material ou imaterial.
§ 2° Serviço é qualquer atividade fornecida no mercado de consumo, mediante remuneração, inclusive as de natureza bancária, financeira, de crédito e securitária, salvo as decorrentes das relações de caráter trabalhista.`, 
  "4": `Art. 4º A Política Nacional das Relações de Consumo tem por objetivo o atendimento das necessidades dos consumidores, o respeito à sua dignidade, saúde e segurança, a proteção de seus interesses econômicos, a melhoria da sua qualidade de vida, bem como a transparência e harmonia das relações de consumo, atendidos os seguintes princípios: (Redação dada pela Lei nº 9.008, de 21.3.1995)
I - reconhecimento da vulnerabilidade do consumidor no mercado de consumo;
II - ação governamental no sentido de proteger efetivamente o consumidor:

a) por iniciativa direta;

b) por incentivos à criação e desenvolvimento de associações representativas;

c) pela presença do Estado no mercado de consumo;

d) pela garantia dos produtos e serviços com padrões adequados de qualidade, segurança, durabilidade e desempenho.

III - harmonização dos interesses dos participantes das relações de consumo e compatibilização da proteção do consumidor com a necessidade de desenvolvimento econômico e tecnológico, de modo a viabilizar os princípios nos quais se funda a ordem econômica (art. 170, da Constituição Federal), sempre com base na boa-fé e equilíbrio nas relações entre consumidores e fornecedores;

IV - educação e informação de fornecedores e consumidores, quanto aos seus direitos e deveres, com vistas à melhoria do mercado de consumo;

V - incentivo à criação pelos fornecedores de meios eficientes de controle de qualidade e segurança de produtos e serviços, assim como de mecanismos alternativos de solução de conflitos de consumo;

VI - coibição e repressão eficientes de todos os abusos praticados no mercado de consumo, inclusive a concorrência desleal e utilização indevida de inventos e criações industriais das marcas e nomes comerciais e signos distintivos, que possam causar prejuízos aos consumidores;

VII - racionalização e melhoria dos serviços públicos;

VIII - estudo constante das modificações do mercado de consumo.`,
  "5": `Art. 5° Para a execução da Política Nacional das Relações de Consumo, contará o poder público com os seguintes instrumentos, entre outros:

I - manutenção de assistência jurídica, integral e gratuita para o consumidor carente;

II - instituição de Promotorias de Justiça de Defesa do Consumidor, no âmbito do Ministério Público;

III - criação de delegacias de polícia especializadas no atendimento de consumidores vítimas de infrações penais de consumo;

IV - criação de Juizados Especiais de Pequenas Causas e Varas Especializadas para a solução de litígios de consumo;

V - concessão de estímulos à criação e desenvolvimento das Associações de Defesa do Consumidor.`,
  "6": `Art. 6º São direitos básicos do consumidor:

I - a proteção da vida, saúde e segurança contra os riscos provocados por práticas no fornecimento de produtos e serviços considerados perigosos ou nocivos;

II - a educação e divulgação sobre o consumo adequado dos produtos e serviços, asseguradas a liberdade de escolha e a igualdade nas contratações;

III - a informação adequada e clara sobre os diferentes produtos e serviços, com especificação correta de quantidade, características, composição, qualidade, tributos incidentes e preço, bem como sobre os riscos que apresentem; (Redação dada pela Lei nº 12.741, de 2012)   Vigência

IV - a proteção contra a publicidade enganosa e abusiva, métodos comerciais coercitivos ou desleais, bem como contra práticas e cláusulas abusivas ou impostas no fornecimento de produtos e serviços;

V - a modificação das cláusulas contratuais que estabeleçam prestações desproporcionais ou sua revisão em razão de fatos supervenientes que as tornem excessivamente onerosas;

VI - a efetiva prevenção e reparação de danos patrimoniais e morais, individuais, coletivos e difusos;

VII - o acesso aos órgãos judiciários e administrativos com vistas à prevenção ou reparação de danos patrimoniais e morais, individuais, coletivos ou difusos, assegurada a proteção Jurídica, administrativa e técnica aos necessitados;

VIII - a facilitação da defesa de seus direitos, inclusive com a inversão do ônus da prova, a seu favor, no processo civil, quando, a critério do juiz, for verossímil a alegação ou quando for ele hipossuficiente, segundo as regras ordinárias de experiências;

IX - (Vetado);

X - a adequada e eficaz prestação dos serviços públicos em geral.

Parágrafo único.  A informação de que trata o inciso III do caput deste artigo deve ser acessível à pessoa com deficiência, observado o disposto em regulamento.  (Incluído pela Lei nº 13.146, de 2015)(Vigência)`,
  "7": ` 
Art. 7° Os direitos previstos neste código não excluem outros decorrentes de tratados ou convenções internacionais de que o Brasil seja signatário, da legislação interna ordinária, de regulamentos expedidos pelas autoridades administrativas competentes, bem como dos que derivem dos princípios gerais do direito, analogia, costumes e eqüidade.

Parágrafo único. Tendo mais de um autor a ofensa, todos responderão solidariamente pela reparação dos danos previstos nas normas de consumo.`,
  "8": `
Art. 8° Os produtos e serviços colocados no mercado de consumo não acarretarão riscos à saúde ou segurança dos consumidores, exceto os considerados normais e previsíveis em decorrência de sua natureza e fruição, obrigando-se os fornecedores, em qualquer hipótese, a dar as informações necessárias e adequadas a seu respeito.

§ 1º  Em se tratando de produto industrial, ao fabricante cabe prestar as informações a que se refere este artigo, através de impressos apropriados que devam acompanhar o produto.   (Redação dada pela Lei nº 13.486, de 2017)

§ 2º  O fornecedor deverá higienizar os equipamentos e utensílios utilizados no fornecimento de produtos ou serviços, ou colocados à disposição do consumidor, e informar, de maneira ostensiva e adequada, quando for o caso, sobre o risco de contaminação.   (Incluído pela Lei nº 13.486, de 2017)`, 
  "9":`
Art. 9° O fornecedor de produtos e serviços potencialmente nocivos ou perigosos à saúde ou segurança deverá informar, de maneira ostensiva e adequada, a respeito da sua nocividade ou periculosidade, sem prejuízo da adoção de outras medidas cabíveis em cada caso concreto.
`, 
  "10": `
Art. 10. O fornecedor não poderá colocar no mercado de consumo produto ou serviço que sabe ou deveria saber apresentar alto grau de nocividade ou periculosidade à saúde ou segurança.

§ 1° O fornecedor de produtos e serviços que, posteriormente à sua introdução no mercado de consumo, tiver conhecimento da periculosidade que apresentem, deverá comunicar o fato imediatamente às autoridades competentes e aos consumidores, mediante anúncios publicitários.

§ 2° Os anúncios publicitários a que se refere o parágrafo anterior serão veiculados na imprensa, rádio e televisão, às expensas do fornecedor do produto ou serviço.

§ 3° Sempre que tiverem conhecimento de periculosidade de produtos ou serviços à saúde ou segurança dos consumidores, a União, os Estados, o Distrito Federal e os Municípios deverão informá-los a respeito.
`, 
  "11": `
Art. 11. (Vetado).
`, 
  "12": `
Art. 12. O fabricante, o produtor, o construtor, nacional ou estrangeiro, e o importador respondem, independentemente da existência de culpa, pela reparação dos danos causados aos consumidores por defeitos decorrentes de projeto, fabricação, construção, montagem, fórmulas, manipulação, apresentação ou acondicionamento de seus produtos, bem como por informações insuficientes ou inadequadas sobre sua utilização e riscos.

§ 1° O produto é defeituoso quando não oferece a segurança que dele legitimamente se espera, levando-se em consideração as circunstâncias relevantes, entre as quais:

I - sua apresentação;

II - o uso e os riscos que razoavelmente dele se esperam;

III - a época em que foi colocado em circulação.

§ 2º O produto não é considerado defeituoso pelo fato de outro de melhor qualidade ter sido colocado no mercado.

§ 3° O fabricante, o construtor, o produtor ou importador só não será responsabilizado quando provar:

I - que não colocou o produto no mercado;

II - que, embora haja colocado o produto no mercado, o defeito inexiste;

III - a culpa exclusiva do consumidor ou de terceiro.`, 
  "13": `
Art. 13. O comerciante é igualmente responsável, nos termos do artigo anterior, quando:

I - o fabricante, o construtor, o produtor ou o importador não puderem ser identificados;

II - o produto for fornecido sem identificação clara do seu fabricante, produtor, construtor ou importador;

III - não conservar adequadamente os produtos perecíveis.

Parágrafo único. Aquele que efetivar o pagamento ao prejudicado poderá exercer o direito de regresso contra os demais responsáveis, segundo sua participação na causação do evento danoso.
`, 
  "14": `
Art. 14. O fornecedor de serviços responde, independentemente da existência de culpa, pela reparação dos danos causados aos consumidores por defeitos relativos à prestação dos serviços, bem como por informações insuficientes ou inadequadas sobre sua fruição e riscos.

§ 1° O serviço é defeituoso quando não fornece a segurança que o consumidor dele pode esperar, levando-se em consideração as circunstâncias relevantes, entre as quais:

I - o modo de seu fornecimento;

II - o resultado e os riscos que razoavelmente dele se esperam;

III - a época em que foi fornecido.

§ 2º O serviço não é considerado defeituoso pela adoção de novas técnicas.

§ 3° O fornecedor de serviços só não será responsabilizado quando provar:

I - que, tendo prestado o serviço, o defeito inexiste;

II - a culpa exclusiva do consumidor ou de terceiro.

§ 4° A responsabilidade pessoal dos profissionais liberais será apurada mediante a verificação de culpa.
`,
  "15": `
Art. 15. (Vetado).
`, 
  "16": `
Art. 16. (Vetado).
`, 
  "17": `
Art. 17. Para os efeitos desta Seção, equiparam-se aos consumidores todas as vítimas do evento.
`, 
  "18": `
Art. 18. Os fornecedores de produtos de consumo duráveis ou não duráveis respondem solidariamente pelos vícios de qualidade ou quantidade que os tornem impróprios ou inadequados ao consumo a que se destinam ou lhes diminuam o valor, assim como por aqueles decorrentes da disparidade, com a indicações constantes do recipiente, da embalagem, rotulagem ou mensagem publicitária, respeitadas as variações decorrentes de sua natureza, podendo o consumidor exigir a substituição das partes viciadas.

§ 1° Não sendo o vício sanado no prazo máximo de trinta dias, pode o consumidor exigir, alternativamente e à sua escolha:

I - a substituição do produto por outro da mesma espécie, em perfeitas condições de uso;

II - a restituição imediata da quantia paga, monetariamente atualizada, sem prejuízo de eventuais perdas e danos;

III - o abatimento proporcional do preço.

§ 2° Poderão as partes convencionar a redução ou ampliação do prazo previsto no parágrafo anterior, não podendo ser inferior a sete nem superior a cento e oitenta dias. Nos contratos de adesão, a cláusula de prazo deverá ser convencionada em separado, por meio de manifestação expressa do consumidor.

§ 3° O consumidor poderá fazer uso imediato das alternativas do § 1° deste artigo sempre que, em razão da extensão do vício, a substituição das partes viciadas puder comprometer a qualidade ou características do produto, diminuir-lhe o valor ou se tratar de produto essencial.

§ 4° Tendo o consumidor optado pela alternativa do inciso I do § 1° deste artigo, e não sendo possível a substituição do bem, poderá haver substituição por outro de espécie, marca ou modelo diversos, mediante complementação ou restituição de eventual diferença de preço, sem prejuízo do disposto nos incisos II e III do § 1° deste artigo.

§ 5° No caso de fornecimento de produtos in natura, será responsável perante o consumidor o fornecedor imediato, exceto quando identificado claramente seu produtor.

§ 6° São impróprios ao uso e consumo:

I - os produtos cujos prazos de validade estejam vencidos;

II - os produtos deteriorados, alterados, adulterados, avariados, falsificados, corrompidos, fraudados, nocivos à vida ou à saúde, perigosos ou, ainda, aqueles em desacordo com as normas regulamentares de fabricação, distribuição ou apresentação;

III - os produtos que, por qualquer motivo, se revelem inadequados ao fim a que se destinam.
`, 
  "19": `
Art. 19. Os fornecedores respondem solidariamente pelos vícios de quantidade do produto sempre que, respeitadas as variações decorrentes de sua natureza, seu conteúdo líquido for inferior às indicações constantes do recipiente, da embalagem, rotulagem ou de mensagem publicitária, podendo o consumidor exigir, alternativamente e à sua escolha:

I - o abatimento proporcional do preço;

II - complementação do peso ou medida;

III - a substituição do produto por outro da mesma espécie, marca ou modelo, sem os aludidos vícios;

IV - a restituição imediata da quantia paga, monetariamente atualizada, sem prejuízo de eventuais perdas e danos.

§ 1° Aplica-se a este artigo o disposto no § 4° do artigo anterior.

§ 2° O fornecedor imediato será responsável quando fizer a pesagem ou a medição e o instrumento utilizado não estiver aferido segundo os padrões oficiais.
`, 
  "20": `
Art. 20. O fornecedor de serviços responde pelos vícios de qualidade que os tornem impróprios ao consumo ou lhes diminuam o valor, assim como por aqueles decorrentes da disparidade com as indicações constantes da oferta ou mensagem publicitária, podendo o consumidor exigir, alternativamente e à sua escolha:

I - a reexecução dos serviços, sem custo adicional e quando cabível;

II - a restituição imediata da quantia paga, monetariamente atualizada, sem prejuízo de eventuais perdas e danos;

III - o abatimento proporcional do preço.

§ 1° A reexecução dos serviços poderá ser confiada a terceiros devidamente capacitados, por conta e risco do fornecedor.

§ 2° São impróprios os serviços que se mostrem inadequados para os fins que razoavelmente deles se esperam, bem como aqueles que não atendam as normas regulamentares de prestabilidade.
`,
  "21": `
Art. 21. No fornecimento de serviços que tenham por objetivo a reparação de qualquer produto considerar-se-á implícita a obrigação do fornecedor de empregar componentes de reposição originais adequados e novos, ou que mantenham as especificações técnicas do fabricante, salvo, quanto a estes últimos, autorização em contrário do     consumidor.
`,
  "22": `
Art. 22. Os órgãos públicos, por si ou suas empresas, concessionárias, permissionárias ou sob qualquer outra forma de empreendimento, são obrigados a fornecer serviços adequados, eficientes, seguros e, quanto aos essenciais, contínuos.

Parágrafo único. Nos casos de descumprimento, total ou parcial, das obrigações referidas neste artigo, serão as pessoas jurídicas compelidas a cumpri-las e a reparar os danos causados, na forma prevista neste código.
`,
  "23": `
Art. 23. A ignorância do fornecedor sobre os vícios de qualidade por inadequação dos produtos e serviços não o exime de responsabilidade.
`,
  "24": `
Art. 24. A garantia legal de adequação do produto ou serviço independe de termo expresso, vedada a exoneração contratual do fornecedor.
`,
  "25": `
Art. 25. É vedada a estipulação contratual de cláusula que impossibilite, exonere ou atenue a obrigação de indenizar prevista nesta e nas seções anteriores.

§ 1° Havendo mais de um responsável pela causação do dano, todos responderão solidariamente pela reparação prevista nesta e nas seções anteriores.

§ 2° Sendo o dano causado por componente ou peça incorporada ao produto ou serviço, são responsáveis solidários seu fabricante, construtor ou importador e o que realizou a incorporação.
`,
  "26": `
Art. 26. O direito de reclamar pelos vícios aparentes ou de fácil constatação caduca em:

I - trinta dias, tratando-se de fornecimento de serviço e de produtos não duráveis;

II - noventa dias, tratando-se de fornecimento de serviço e de produtos duráveis.

§ 1° Inicia-se a contagem do prazo decadencial a partir da entrega efetiva do produto ou do término da execução dos serviços.

§ 2° Obstam a decadência:

I - a reclamação comprovadamente formulada pelo consumidor perante o fornecedor de produtos e serviços até a resposta negativa correspondente, que deve ser transmitida de forma inequívoca;

II - (Vetado).

III - a instauração de inquérito civil, até seu encerramento.

§ 3° Tratando-se de vício oculto, o prazo decadencial inicia-se no momento em que ficar evidenciado o defeito.
`,
  "27": `
Art. 27. Prescreve em cinco anos a pretensão à reparação pelos danos causados por fato do produto ou do serviço prevista na Seção II deste Capítulo, iniciando-se a contagem do prazo a partir do conhecimento do dano e de sua autoria.
Parágrafo único. (Vetado).
`,
  "28": `
Art. 28. O juiz poderá desconsiderar a personalidade jurídica da sociedade quando, em detrimento do consumidor, houver abuso de direito, excesso de poder, infração da lei, fato ou ato ilícito ou violação dos estatutos ou contrato social. A desconsideração também será efetivada quando houver falência, estado de insolvência, encerramento ou inatividade da pessoa jurídica provocados por má administração.

§ 1° (Vetado).

§ 2° As sociedades integrantes dos grupos societários e as sociedades controladas, são subsidiariamente responsáveis pelas obrigações decorrentes deste código.

§ 3° As sociedades consorciadas são solidariamente responsáveis pelas obrigações decorrentes deste código.

§ 4° As sociedades coligadas só responderão por culpa.

§ 5° Também poderá ser desconsiderada a pessoa jurídica sempre que sua personalidade for, de alguma forma, obstáculo ao ressarcimento de prejuízos causados aos consumidores.
`,
  "29": `
Art. 29. Para os fins deste Capítulo e do seguinte, equiparam-se aos consumidores todas as pessoas determináveis ou não, expostas às práticas nele previstas.
`, 
  "30": `
Art. 30. Toda informação ou publicidade, suficientemente precisa, veiculada por qualquer forma ou meio de comunicação com relação a produtos e serviços oferecidos ou apresentados, obriga o fornecedor que a fizer veicular ou dela se utilizar e integra o contrato que vier a ser celebrado.
`,
  "31": `
Art. 31. A oferta e apresentação de produtos ou serviços devem assegurar informações corretas, claras, precisas, ostensivas e em língua portuguesa sobre suas características, qualidades, quantidade, composição, preço, garantia, prazos de validade e origem, entre outros dados, bem como sobre os riscos que apresentam à saúde e segurança dos consumidores.

Parágrafo único.  As informações de que trata este artigo, nos produtos refrigerados oferecidos ao consumidor, serão gravadas de forma indelével. (Incluído pela Lei nº 11.989, de 2009)
`,
  "32": `
Art. 32. Os fabricantes e importadores deverão assegurar a oferta de componentes e peças de reposição enquanto não cessar a fabricação ou importação do produto.

Parágrafo único. Cessadas a produção ou importação, a oferta deverá ser mantida por período razoável de tempo, na forma da lei.
`,
  "33": `
Art. 33. Em caso de oferta ou venda por telefone ou reembolso postal, deve constar o nome do fabricante e endereço na embalagem, publicidade e em todos os impressos utilizados na transação comercial.

Parágrafo único.  É proibida a publicidade de bens e serviços por telefone, quando a chamada for onerosa ao consumidor que a origina. (Incluído pela Lei nº 11.800, de 2008).
`,
  "34": `
Art. 34. O fornecedor do produto ou serviço é solidariamente responsável pelos atos de seus prepostos ou representantes autônomos.
`,
  "35": `
Art. 35. Se o fornecedor de produtos ou serviços recusar cumprimento à oferta, apresentação ou publicidade, o consumidor poderá, alternativamente e à sua livre escolha:

I - exigir o cumprimento forçado da obrigação, nos termos da oferta, apresentação ou publicidade;

II - aceitar outro produto ou prestação de serviço equivalente;

III - rescindir o contrato, com direito à restituição de quantia eventualmente antecipada, monetariamente atualizada, e a perdas e danos.
`,
  "36": `
Art. 36. A publicidade deve ser veiculada de tal forma que o consumidor, fácil e imediatamente, a identifique como tal.

Parágrafo único. O fornecedor, na publicidade de seus produtos ou serviços, manterá, em seu poder, para informação dos legítimos interessados, os dados fáticos, técnicos e científicos que dão sustentação à mensagem.
`,
  "37": `
Art. 37. É proibida toda publicidade enganosa ou abusiva.

§ 1° É enganosa qualquer modalidade de informação ou comunicação de caráter publicitário, inteira ou parcialmente falsa, ou, por qualquer outro modo, mesmo por omissão, capaz de induzir em erro o consumidor a respeito da natureza, características, qualidade, quantidade, propriedades, origem, preço e quaisquer outros dados sobre produtos e serviços.

§ 2° É abusiva, dentre outras a publicidade discriminatória de qualquer natureza, a que incite à violência, explore o medo ou a superstição, se aproveite da deficiência de julgamento e experiência da criança, desrespeita valores ambientais, ou que seja capaz de induzir o consumidor a se comportar de forma prejudicial ou perigosa à sua saúde ou segurança.

§ 3° Para os efeitos deste código, a publicidade é enganosa por omissão quando deixar de informar sobre dado essencial do produto ou serviço.

§ 4° (Vetado).
`,
  "38": ` 
Art. 38. O ônus da prova da veracidade e correção da informação ou comunicação publicitária cabe a quem as patrocina.
`,
  "39": `
Art. 39. É vedado ao fornecedor de produtos ou serviços, dentre outras práticas abusivas: (Redação dada pela Lei nº 8.884, de 11.6.1994)

I - condicionar o fornecimento de produto ou de serviço ao fornecimento de outro produto ou serviço, bem como, sem justa causa, a limites quantitativos;

II - recusar atendimento às demandas dos consumidores, na exata medida de suas disponibilidades de estoque, e, ainda, de conformidade com os usos e costumes;

III - enviar ou entregar ao consumidor, sem solicitação prévia, qualquer produto, ou fornecer qualquer serviço;

IV - prevalecer-se da fraqueza ou ignorância do consumidor, tendo em vista sua idade, saúde, conhecimento ou condição social, para impingir-lhe seus produtos ou serviços;

V - exigir do consumidor vantagem manifestamente excessiva;

VI - executar serviços sem a prévia elaboração de orçamento e autorização expressa do consumidor, ressalvadas as decorrentes de práticas anteriores entre as partes;

VII - repassar informação depreciativa, referente a ato praticado pelo consumidor no exercício de seus direitos;

VIII - colocar, no mercado de consumo, qualquer produto ou serviço em desacordo com as normas expedidas pelos órgãos oficiais competentes ou, se normas específicas não existirem, pela Associação Brasileira de Normas Técnicas ou outra entidade credenciada pelo Conselho Nacional de Metrologia, Normalização e Qualidade Industrial (Conmetro);

IX - recusar a venda de bens ou a prestação de serviços, diretamente a quem se disponha a adquiri-los mediante pronto pagamento, ressalvados os casos de intermediação regulados em leis especiais;                  (Redação dada pela Lei nº 8.884, de 11.6.1994)

X - elevar sem justa causa o preço de produtos ou serviços.                (Incluído pela Lei nº 8.884, de 11.6.1994)

XI -  Dispositivo  incluído pela MPV  nº 1.890-67, de 22.10.1999, transformado em inciso  XIII, quando da conversão na Lei nº 9.870, de 23.11.1999

XII - deixar de estipular prazo para o cumprimento de sua obrigação ou deixar a fixação de seu termo inicial a seu exclusivo critério.              (Incluído pela Lei nº 9.008, de 21.3.1995)

XIII - aplicar fórmula ou índice de reajuste diverso do legal ou contratualmente estabelecido.            (Incluído pela Lei nº 9.870, de 23.11.1999)

XIV - permitir o ingresso em estabelecimentos comerciais ou de serviços de um número maior de consumidores que o fixado pela autoridade administrativa como máximo.                   (Incluído pela Lei nº 13.425, de 2017)
`,
  "40": `
Art. 40. O fornecedor de serviço será obrigado a entregar ao consumidor orçamento prévio discriminando o valor da mão-de-obra, dos materiais e equipamentos a serem empregados, as condições de pagamento, bem como as datas de início e término dos serviços.

§ 1º Salvo estipulação em contrário, o valor orçado terá validade pelo prazo de dez dias, contado de seu recebimento pelo consumidor.

§ 2° Uma vez aprovado pelo consumidor, o orçamento obriga os contraentes e somente pode ser alterado mediante livre negociação das partes.

§ 3° O consumidor não responde por quaisquer ônus ou acréscimos decorrentes da contratação de serviços de terceiros não previstos no orçamento prévio.
`,
  "41": `
Art. 41. No caso de fornecimento de produtos ou de serviços sujeitos ao regime de controle ou de tabelamento de preços, os fornecedores deverão respeitar os limites oficiais sob pena de não o fazendo, responderem pela restituição da quantia recebida em excesso, monetariamente atualizada, podendo o consumidor exigir à sua escolha, o desfazimento do negócio, sem prejuízo de outras sanções cabíveis.
`,
  "42": `
Art. 42. Na cobrança de débitos, o consumidor inadimplente não será exposto a ridículo, nem será submetido a qualquer tipo de constrangimento ou ameaça.

Parágrafo único. O consumidor cobrado em quantia indevida tem direito à repetição do indébito, por valor igual ao dobro do que pagou em excesso, acrescido de correção monetária e juros legais, salvo hipótese de engano justificável.

Art. 42-A.  Em todos os documentos de cobrança de débitos apresentados ao consumidor, deverão constar o nome, o endereço e o número de inscrição no Cadastro de Pessoas Físicas – CPF ou no Cadastro Nacional de Pessoa Jurídica – CNPJ do fornecedor do produto ou serviço correspondente.             (Incluído pela Lei nº 12.039, de 2009)
`,
  "43": `
Art. 43. O consumidor, sem prejuízo do disposto no art. 86, terá acesso às informações existentes em cadastros, fichas, registros e dados pessoais e de consumo arquivados sobre ele, bem como sobre as suas respectivas fontes.

§ 1° Os cadastros e dados de consumidores devem ser objetivos, claros, verdadeiros e em linguagem de fácil compreensão, não podendo conter informações negativas referentes a período superior a cinco anos.

§ 2° A abertura de cadastro, ficha, registro e dados pessoais e de consumo deverá ser comunicada por escrito ao consumidor, quando não solicitada por ele.

§ 3° O consumidor, sempre que encontrar inexatidão nos seus dados e cadastros, poderá exigir sua imediata correção, devendo o arquivista, no prazo de cinco dias úteis, comunicar a alteração aos eventuais destinatários das informações incorretas.

§ 4° Os bancos de dados e cadastros relativos a consumidores, os serviços de proteção ao crédito e congêneres são considerados entidades de caráter público.

§ 5° Consumada a prescrição relativa à cobrança de débitos do consumidor, não serão fornecidas, pelos respectivos Sistemas de Proteção ao Crédito, quaisquer informações que possam impedir ou dificultar novo acesso ao crédito junto aos fornecedores.

§ 6° Todas as informações de que trata o caput deste artigo devem ser disponibilizadas em formatos acessíveis, inclusive para a pessoa com deficiência, mediante solicitação do consumidor.            (Incluído pela Lei nº 13.146, de 2015)    (Vigência)
`,
  "44": `
Art. 44. Os órgãos públicos de defesa do consumidor manterão cadastros atualizados de reclamações fundamentadas contra fornecedores de produtos e serviços, devendo divulgá-lo pública e anualmente. A divulgação indicará se a reclamação foi atendida ou não pelo fornecedor.

§ 1° É facultado o acesso às informações lá constantes para orientação e consulta por qualquer interessado.

§ 2° Aplicam-se a este artigo, no que couber, as mesmas regras enunciadas no artigo anterior e as do parágrafo único do art. 22 deste código.
`,
  "45": `
Art. 45. (Vetado).
`,
  "46": `
Art. 46. Os contratos que regulam as relações de consumo não obrigarão os consumidores, se não lhes for dada a oportunidade de tomar conhecimento prévio de seu conteúdo, ou se os respectivos instrumentos forem redigidos de modo a dificultar a compreensão de seu sentido e alcance.
`,
  "47": `
Art. 47. As cláusulas contratuais serão interpretadas de maneira mais favorável ao consumidor.
`,
  "48": `
Art. 48. As declarações de vontade constantes de escritos particulares, recibos e pré-contratos relativos às relações de consumo vinculam o fornecedor, ensejando inclusive execução específica, nos termos do art. 84 e parágrafos.
`,
  "49": `
Art. 49. O consumidor pode desistir do contrato, no prazo de 7 dias a contar de sua assinatura ou do ato de recebimento do produto ou serviço, sempre que a contratação de fornecimento de produtos e serviços ocorrer fora do estabelecimento comercial, especialmente por telefone ou a domicílio.

Parágrafo único. Se o consumidor exercitar o direito de arrependimento previsto neste artigo, os valores eventualmente pagos, a qualquer título, durante o prazo de reflexão, serão devolvidos, de imediato, monetariamente atualizados.
`,
  "50": `
Art. 50. A garantia contratual é complementar à legal e será conferida mediante termo escrito.

Parágrafo único. O termo de garantia ou equivalente deve ser padronizado e esclarecer, de maneira adequada em que consiste a mesma garantia, bem como a forma, o prazo e o lugar em que pode ser exercitada e os ônus a cargo do consumidor, devendo ser-lhe entregue, devidamente preenchido pelo fornecedor, no ato do fornecimento, acompanhado de manual de instrução, de instalação e uso do produto em linguagem didática, com ilustrações.
`,
  "51": `
Art. 51. São nulas de pleno direito, entre outras, as cláusulas contratuais relativas ao fornecimento de produtos e serviços que:

I - impossibilitem, exonerem ou atenuem a responsabilidade do fornecedor por vícios de qualquer natureza dos produtos e serviços ou impliquem renúncia ou disposição de direitos. Nas relações de consumo entre o fornecedor e o consumidor pessoa jurídica, a indenização poderá ser limitada, em situações justificáveis;

II - subtraiam ao consumidor a opção de reembolso da quantia já paga, nos casos previstos neste código;

III - transfiram responsabilidades a terceiros;

IV - estabeleçam obrigações consideradas iníquas, abusivas, que coloquem o consumidor em desvantagem exagerada, ou sejam incompatíveis com a boa-fé ou a eqüidade;

V - (Vetado);

VI - estabeleçam inversão do ônus da prova em prejuízo do consumidor;

VII - determinem a utilização compulsória de arbitragem;

VIII - imponham representante para concluir ou realizar outro negócio jurídico pelo consumidor;

IX - deixem ao fornecedor a opção de concluir ou não o contrato, embora obrigando o consumidor;

X - permitam ao fornecedor, direta ou indiretamente, variação do preço de maneira unilateral;

XI - autorizem o fornecedor a cancelar o contrato unilateralmente, sem que igual direito seja conferido ao consumidor;

XII - obriguem o consumidor a ressarcir os custos de cobrança de sua obrigação, sem que igual direito lhe seja conferido contra o fornecedor;

XIII - autorizem o fornecedor a modificar unilateralmente o conteúdo ou a qualidade do contrato, após sua celebração;

XIV - infrinjam ou possibilitem a violação de normas ambientais;

XV - estejam em desacordo com o sistema de proteção ao consumidor;

XVI - possibilitem a renúncia do direito de indenização por benfeitorias necessárias.

§ 1º Presume-se exagerada, entre outros casos, a vantagem que:

I - ofende os princípios fundamentais do sistema jurídico a que pertence;

II - restringe direitos ou obrigações fundamentais inerentes à natureza do contrato, de tal modo a ameaçar seu objeto ou equilíbrio contratual;

III - se mostra excessivamente onerosa para o consumidor, considerando-se a natureza e conteúdo do contrato, o interesse das partes e outras circunstâncias peculiares ao caso.

§ 2° A nulidade de uma cláusula contratual abusiva não invalida o contrato, exceto quando de sua ausência, apesar dos esforços de integração, decorrer ônus excessivo a qualquer das partes.

§ 3° (Vetado).

§ 4° É facultado a qualquer consumidor ou entidade que o represente requerer ao Ministério Público que ajuíze a competente ação para ser declarada a nulidade de cláusula contratual que contrarie o disposto neste código ou de qualquer forma não assegure o justo equilíbrio entre direitos e obrigações das partes.
`,
  "52": `
Art. 52. No fornecimento de produtos ou serviços que envolva outorga de crédito ou concessão de financiamento ao consumidor, o fornecedor deverá, entre outros requisitos, informá-lo prévia e adequadamente sobre:

I - preço do produto ou serviço em moeda corrente nacional;

II - montante dos juros de mora e da taxa efetiva anual de juros;

III - acréscimos legalmente previstos;

IV - número e periodicidade das prestações;

V - soma total a pagar, com e sem financiamento.

§ 1° As multas de mora decorrentes do inadimplemento de obrigações no seu termo não poderão ser superiores a dois por cento do valor da prestação.           (Redação dada pela Lei nº 9.298, de 1º.8.1996)

§ 2º É assegurado ao consumidor a liquidação antecipada do débito, total ou parcialmente, mediante redução proporcional dos juros e demais acréscimos.

§ 3º (Vetado).
`,
  "53": `
Art. 53. Nos contratos de compra e venda de móveis ou imóveis mediante pagamento em prestações, bem como nas alienações fiduciárias em garantia, consideram-se nulas de pleno direito as cláusulas que estabeleçam a perda total das prestações pagas em benefício do credor que, em razão do inadimplemento, pleitear a resolução do contrato e a retomada do produto alienado.

§ 1° (Vetado).

§ 2º Nos contratos do sistema de consórcio de produtos duráveis, a compensação ou a restituição das parcelas quitadas, na forma deste artigo, terá descontada, além da vantagem econômica auferida com a fruição, os prejuízos que o desistente ou inadimplente causar ao grupo.

§ 3° Os contratos de que trata o caput deste artigo serão expressos em moeda corrente nacional.
`,
  "54": `
Art. 54. Contrato de adesão é aquele cujas cláusulas tenham sido aprovadas pela autoridade competente ou estabelecidas unilateralmente pelo fornecedor de produtos ou serviços, sem que o consumidor possa discutir ou modificar substancialmente seu conteúdo. 

§ 1° A inserção de cláusula no formulário não desfigura a natureza de adesão do contrato.

§ 2° Nos contratos de adesão admite-se cláusula resolutória, desde que a alternativa, cabendo a escolha ao consumidor, ressalvando-se o disposto no § 2° do artigo anterior.

§ 3° Os contratos de adesão escritos serão redigidos em termos claros e com caracteres ostensivos e legíveis, cujo tamanho da fonte não será inferior ao corpo doze, de modo a facilitar sua compreensão pelo consumidor.            (Redação dada pela nº 11.785, de 2008)

§ 4° As cláusulas que implicarem limitação de direito do consumidor deverão ser redigidas com destaque, permitindo sua imediata e fácil compreensão.

§ 5° (Vetado)`
};

var subjects = {
  "1":`Papéis do Consumidor e Fornecedor`,
  "2":`Papéis do Consumidor e Fornecedor`,
  "3":`Papéis do Consumidor e Fornecedor`,
  "4":`Princípios das Relações de Consumo`,
  "5":`Princípios das Relações de Consumo`,
  "6":`Direitos Básicos do Consumidor`,
  "7":`Direitos Básicos do Consumidor`,
  "8":`Periculosidade e Riscos ligado a Produtos e Serviços`,
  "9":`Periculosidade e Riscos ligado a Produtos e Serviços`,
  "10":`Periculosidade e Riscos ligado a Produtos e Serviços`,
  "11":`--`,
  "12":`Responsabilidade do Fato do Produto ou Serviço`,
  "13":`Responsabilidade do Fato do Produto ou Serviço`,
  "14":`Responsabilidade do Fato do Produto ou Serviço`,
  "15":`Responsabilidade do Fato do Produto ou Serviço`,
  "16":`Responsabilidade do Fato do Produto ou Serviço`,
  "17":`Responsabilidade do Fato do Produto ou Serviço`,
  "18":`Responsabilidade do Vício do Produto ou Serviço`,
  "19":`Responsabilidade do Vício do Produto ou Serviço`,
  "20":`Responsabilidade do Vício do Produto ou Serviço`,
  "21":`Responsabilidade do Vício do Produto ou Serviço`,
  "22":`Responsabilidade do Vício do Produto ou Serviço`,
  "23":`Responsabilidade do Vício do Produto ou Serviço`,
  "24":`Responsabilidade do Vício do Produto ou Serviço`,
  "25":`Responsabilidade do Vício do Produto ou Serviço`,
  "26":`Decadência de Produtos e Serviços e Da Preescrição`,
  "27":`Decadência de Produtos e Serviços e Da Preescrição`,
  "28":`Desconsideração da Responsabilidade Jurídica`,
  "29":`Equidade dos Consumidores às Pessoas Determináveis`,
  "30":`Recusa a Cumprimento da Oferta`,
  "31":`Informação Insuficiente ou Incorreta do Produto ou Serviço`,
  "32":`Garantia do Fornecimento de Peças`,
  "33":`Publicidade via Telefone`,
  "34":`Responsabildiade de Serviço da Fornecedora`,
  "35":`Recusa a Cumprimento da Oferta`,
  "36":`Visualização Indevida ou Ineficiente da Oferta, Propaganda Enganosa ou Abusiva`,
  "37":`Visualização Indevida ou Ineficiente da Oferta, Propaganda Enganosa ou Abusiva`,
  "38":`Visualização Indevida ou Ineficiente da Oferta, Propaganda Enganosa ou Abusiva`,
  "39":`Práticas Abusivas de Publicidade`,
  "40":`Obrigação de Orçamento no Fornecimento de Serviços`,
  "41":`Extravio de Tabelamento de Preço`,
  "42":`Exposição ao ridículo e ameaça por Inadimplência`,
  "43":`Garantia de Informações pessoais no banco de dados do fornecedor`,
  "44":`Cadastro de reclamações de Orgãos Públicos`,
  "45":`-`,
  "46":`Das Clausulas Contratuais e Desistência`,
  "47":`Das Clausulas Contratuais e Desistência`,
  "48":`Das Clausulas Contratuais e Desistência`,
  "49":`Das Clausulas Contratuais e Desistência`,
  "50":`Das Clausulas Contratuais e Desistência`,
  "51":`Das Clausulas Abusivas`,
  "52":`Informação Prévia de Montante e Taxas associada a produtos ou serviços`,
  "53":`Das Clausulas sobre Prestações e Consórcios`,
  "54":`Dos Contratos de Adesão`,
};

var sqlInsert = ``;
//console.log(articles);
insertArticle(1);

function insertArticle(art_id){
  if(art_id == 55){
    process.exit();
    return;
  }
  console.log(`Inserting Article ${art_id}`);
  console.log("requesting connection");

  db.getConnection(function(err, connection) {
    console.log(`adding article number ${art_id} `);

    sqlInsert = `INSERT INTO articles (
      art_id,
      subject,
      text
    )VALUES (
    ${art_id},
    '${subjects[art_id]}',
    '${articles[art_id]}'
    )`;

    connection.query(sqlInsert, function(err, results) {
      console.log(results);
      insertArticle(art_id+1);
    }).on('enqueue', function () {
      console.log('Waiting for available connection slot');
    }).on('error', function(err) {
      console.log("[mysql error]",err);
    }).on('end', function() {
      // all rows have been received
      console.log(`Command of insert executed ${art_id}`);
    });

    // And done with the connection.
    connection.release();
  });
  console.log("ENDed request");
  //console.log(sqlInsert);
}


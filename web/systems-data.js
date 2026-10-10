'use strict';
const SYSTEM_SOURCES={
 craft:['Craft & coleta · referência Global','https://aion2maps.com/guides/crafting/'],prof:['Profissões · banco de dados Global','https://aion2.gaming.tools/guides/crafting'],sys:['Sistemas · banco de dados Global','https://aion2.gaming.tools/pt-br/progression/systems'],
 bind:['Vinculação de alma · guia comunitário','https://aion2maps.com/guides/soul-binding/'],pot:['Potencial · comparação Global','https://aion2maps.com/guides/potential/'],stones:['Pedras · guia comunitário','https://aion2maps.com/guides/manastones/'],slots:['Slots especiais · guia comunitário','https://aion2maps.com/guides/special-slots/'],gear:['Equipamento · guia de referência Global','https://expcarry.com/aion2-gear-progression'],
 collections:['Coleções · referência Global','https://corpus.gg/blog/aion-2/collections-guide'],pantheon:['Panteão · guia comunitário','https://aion2maps.com/guides/pantheon-stats/'],closet:['Closet · guia comunitário','https://aion2maps.com/guides/closet/'],
 routine:['Rotina · dados Global e adaptações identificadas','https://aion2maps.com/guides/daily-and-weekly/'],exp:['Expedições · referência Global','https://aion2maps.com/guides/expeditions-and-odyle/'],arena:['Arena e campo de batalha · referência Global','https://aion2maps.com/guides/arenas-and-battlegrounds/'],combat:['Combate · guia comunitário','https://aion2maps.com/guides/combat-basics/'],bank:['Armazenamento · referência comunitária','https://aion2maps.com/guides/storage/'],legion:['Legião · referência comunitária','https://aion2maps.com/guides/legions/'],shop:['Mercado e membership · comparação Global','https://aion2maps.com/guides/membership-and-shop/'],season:['Temporadas · referência Global','https://aion2maps.com/guides/seasons-and-chapters/'],
 index:['Índice de sistemas do Global','https://aion2maps.com/guides/'],diff:['Diferenças do Global · conferir patch','https://aion2maps.com/guides/global-differences/'],levels:['Habilidades · referência Global','https://aion2maps.com/guides/skills-and-stigma/'],boards:['Daevanion · referência Global','https://aion2maps.com/guides/daevanion-boards/'],cards:['Arcana · referência Global','https://aion2maps.com/guides/arcana/'],pets:['Pets e Genus · dados Global','https://raidrelay.com/aion-2-pets-genus-guide'],raid:['NC · aviso do Santuário','https://aion2.plaync.com/en-us/board/notice/view?articleId=6ac39140d97eae18cc40e294']
};
// id, título, termo de busca, pergunta de estudo, fonte, prioridade (1 agora / 2 depois / 3 referência), disponibilidade
const SYSTEM_GROUPS=[
 {id:'producao',title:'Produção & materiais',desc:'Como obter e transformar recursos; as cinco profissões ficam separadas.',items:[
 ['coleta','Coleta / Extração de Essência','Gathering Essence Extraction','Quais recursos coletar e qual rota combina com o material que preciso?','craft',1],
 ['coleta-skills','Maestria e passivas de coleta','Gathering Mastery Specialty','Como subir proficiência e distribuir pontos entre quantidade e qualidade?','sys',2],
 ['od-coleta','Extração de Od','Odyle Extraction','Onde coletar Od e para quais receitas vale reservá-lo?','craft',2],
 ['armaria','Armaria','Blacksmithing','Profissão de maças e guarda-braços: quanto custa produzir uma melhoria para meu Clérigo?','prof',1],
 ['armoraria','Armoraria','Armorsmithing','Quando produzir armadura é melhor que continuar farmando uma peça?','prof',2],
 ['artesanato','Artesanato','Handicrafting','Anéis e outros acessórios: qual receita pode completar meus níveis de skill?','prof',1],
 ['alquimia','Alquimia','Alchemy','Quais consumíveis e pedras compensa fabricar em vez de comprar?','prof',2],
 ['culinaria','Culinária','Cooking','Qual comida usar em boss, farm e PvP; quanto custa manter o buff?','prof',2],
 ['craft-mastery','Proficiência, receitas e promoção de craft','Crafting Mastery Professional','Qual caminho de receitas sobe a profissão com menor desperdício?','sys',2],
 ['transmutacao','Transmutação / conversão de substâncias','Substance Morph morphing','Qual receita transforma meu excedente em um recurso que realmente falta?','craft',1],
 ['craft-upgrade','Craft de evolução / upcraft','Transfer Crafting Dragon Lord Splendent','O que a receita preserva do item anterior e o que será consumido?','craft',2]
 ]},
 {id:'equipamento',title:'Equipamento & otimização',desc:'Sistemas diferentes de melhoria; estudar a prévia antes de gastar.',items:[
 ['gs-cp','GS, nível da peça e Poder de Combate','Item Level Combat Power','Qual indicador limita minha entrada e qual mede a força mais ampla?','gear',1],
 ['encantar','Aprimoramento / encantamento','Enhancement Enchant','Qual peça merece investimento agora e qual será substituída?','gear',1],
 ['amplificar','Amplificação','Amp Amplified Enhancement','Quando abrir esse investimento e o que acontece numa troca de tier?','gear',2],
 ['transferir','Transferência de equipamento','Gear Transfer','Quais melhorias passam, quais se perdem e qual item será consumido?','gear',1],
 ['desmontar','Desmontagem versus conversão de item','Dismantle salvage Substance Morph','Vender, guardar, desmontar ou converter: qual uso tem mais valor para esta peça?','bind',1],
 ['soul-bind','Vinculação de alma','Soul Binding Bind','Como desenvolver os valores das linhas que já são boas?','bind',1],
 ['soul-sync','Sincronização de alma / reroll de linha','Soul Sync Sync Stone','Qual linha ruim vale trocar e onde obter a pedra adequada?','bind',2],
 ['soul-reset','Redefinição de alma / reroll completo','Soul Codex Reset Rebind','Quando faz sentido refazer todas as linhas em vez de uma só?','bind',2],
 ['soul-fuse','Fusão de alma','Soul Fuse','Quando acrescentar a linha extra e o que acontece com ela na transferência?','bind',3],
 ['manastones','Pedras de mana e encaixes','Manastones sockets','Qual atributo falta para meu conteúdo e qual pedra resolve isso?','stones',1],
 ['theostones','Pedras divinas / gravação','Theostone Godstone Engraving','Qual efeito é útil ao Clérigo e como aplicar ou substituir a pedra?','stones',2],
 ['pedras-fusao','Fusão / síntese de pedras divinas','Godstone Combining Synthesis','Quais pedras entram na síntese e qual resultado a prévia permite?','sys',3],
 ['potencial','Potencial de equipamento','Potential PvP','O bônus é para PvP? Vale investir na peça que vou usar na luta?','pot',2],
 ['cinto','Cinto e sua melhoria própria','Belt Noble Belt','Onde obter pergaminhos e qual melhoria cabe no orçamento?','slots',1],
 ['amuleto','Amuleto e sua melhoria própria','Amulet Revelation Fierce Battle','Qual versão atende meu objetivo e como elevar seu nível?','slots',1],
 ['stat-conversion','Conversão de atributos','Stat Conversion','Em qual menu ocorre e quais atributos podem ser convertidos no Global?','sys',3,'Conferir no cliente'],
 ['runas','Runas de equipamento','Rune Clash Rune','Qual é o risco de perda e como calcular o custo de reposição?','slots',2]
 ]},
 {id:'personagem',title:'Habilidades & crescimento',desc:'Nível base, níveis extras e especializações não são a mesma coisa.',items:[
 ['nivel','Nível do personagem e progressão de combate','Character Level Combat Level','O que ainda progride após o nível 45 e quais recompensas isso libera?','index',2],
 ['maestria','Maestria das habilidades ativas','Skill Mastery','Quais pontos redistribuir para alcançar o próximo marco do meu combo?','levels',1],
 ['passivas','Habilidades passivas','Passive Skills','Quais passivas ajudam meu dano, mana e cura; de onde vêm níveis extras?','levels',1],
 ['especializar','Especializações por habilidade','Specialty Shards 8 12 16 20','Quais opções equipar para masmorra, solo e PvP nos espaços disponíveis?','levels',1],
 ['estigmas','Estigmas / habilidades DP','Stigma DP Skills','Quais quatro levar, qual subir primeiro e que troca a composição exige?','levels',1],
 ['daevanion','Tabuleiros Daevanion','Daevanion Boards Crystals','Já comprei os nós de nível de skill? Qual caminho traz o próximo ganho útil?','boards',1],
 ['arcana','Arcana: equipar, evoluir e fabricar','Arcana Cards','Quais cartas completam um nível 16/20 sem gastar em linhas inúteis?','cards',1]
 ]},
 {id:'colecoes',title:'Coleções & atributos permanentes',desc:'Ganhos que não aparecem apenas na arma ou na armadura.',items:[
 ['pets','Pets: almas, coleção e níveis','Pet Souls Pet Insight','Qual pet falta, onde obter suas almas e qual marco de coleção desbloqueio?','pets',1],
 ['genus','Genus: análise, linhas e travas','Genus Insight Soul Crystal Analyze','Qual família desenvolver e quando vale travar uma linha?','pets',1],
 ['asas','Asas: equipadas e possuídas','Wings collection','Qual par usar e quais asas acrescentam efeitos de coleção?','collections',2],
 ['titulos','Títulos: coleção e equipados','Titles achievements','Quais três títulos combinam melhor com meu conteúdo atual?','collections',1],
 ['conqueror','Ranks de conquistador','Conqueror Ranks','Qual atividade eleva o rank e quais recompensas estão disponíveis?','sys',2],
 ['conquistas','Conquistas e recompensas','Achievements','Qual objetivo próximo dá um título, recurso ou melhoria útil?','collections',2],
 ['closet','Guarda-roupa / coleção de aparências','Closet Transmog skins','Como registrar aparência, elevar a coleção e escolher o visual?','closet',2],
 ['monolito','Monólitos e rastros / penas','Monolith Empyrean Traces feathers','Quais rastros faltam em Altgard e qual recompensa vem no próximo nível?','collections',1],
 ['panteao','Panteão: estátuas, obras e atributos','Pantheon statues artworks','Quais fontes aumentam os atributos dos deuses que importam para minha build?','pantheon',2]
 ]},
 {id:'pve',title:'Atividades PvE & exploração',desc:'Separar a atividade, a entrada e o recurso necessário para retirar recompensa.',items:[
 ['campanha','Campanha, ascensão e desbloqueios','Campaign Ascension story','Qual cadeia de missão ainda bloqueia um sistema ou recompensa?','index',1],
 ['regional','Missões regionais e fortalezas','Regional quests Strongholds','Quais recompensas permanentes ou materiais ainda deixei no mapa?','routine',1],
 ['seladas','Masmorras seladas do mundo','Sealed dungeons','Quais faltam concluir e quais ganhos de primeira conclusão dão?','index',1],
 ['exploration','Expedições: Exploração','Expedition Exploration','Quando essa modalidade serve para aprender ou obter uma recompensa específica?','exp',2],
 ['conquest','Expedições: Conquista','Expedition Conquest','Qual dungeon resolve o slot que falta e como funciona sua garantia?','exp',1],
 ['transcend','Transcendência','Transcendence Deus Arkanis','Qual estágio consigo limpar e quais tipos de Arcana ele cobre?','cards',1],
 ['ascension','Prova de Ascensão','Ascension Trial','Qual dificuldade compensa usar nas minhas entradas desta semana?','routine',1],
 ['nightmare','Pesadelo','Nightmare','Qual boss consigo vencer e em que gastar a moeda da loja?','routine',1],
 ['daily-dungeon','Masmorras diárias de recursos','Daily Dungeon','Qual recurso falta e como obter uma pontuação melhor?','routine',2],
 ['unknown-fissure','Fissura Desconhecida','Unknown Fissure','Como obter o ingresso e qual é a recompensa no meu cliente?','routine',2,'Conferir no cliente'],
 ['dimensional','Invasão Dimensional','Dimensional Invasion','Qual janela, chave e objetivo estão disponíveis no Global?','routine',2,'Conferir no cliente'],
 ['bosses','Chefes de campo / mundo','Field Boss World Boss','Onde ver o aparecimento e qual recompensa interessa à minha progressão?','routine',2],
 ['cubos','Cubos ocultos e chaves','Hidden Cubes','Quais cubos posso abrir agora e onde obter as chaves?','index',2],
 ['shugo','Festival Shugo e loja','Shugo Festa Festival','Qual atividade usar antes de atingir o limite de chaves?','routine',1],
 ['raid','Santuário / raid Ludra','Sanctuary Abyssal Forge Ludra','A NC já reabriu o conteúdo? Qual será a preparação quando voltar?','raid',3,'Suspenso na referência de 09/10']
 ]},
 {id:'pvp',title:'PvP & Abismo',desc:'Estudar cada formato e adaptar cura, controle e sobrevivência.',items:[
 ['abyss','Abismo / Reshanta','Abyss Lower Reshanta','Qual objetivo, tempo de acesso e rota de recursos cabem no meu grupo?','index',2],
 ['rifts','Fendas entre facções','Rifts','Quando abrem, para onde levam e como preparar uma incursão?','index',2],
 ['arena1','Arena 1 × 1','Arena duel ranked','Como montar um preset de duelo e responder ao cleanse inimigo?','arena',2],
 ['arena5','Arena 5 × 5','Arena ranked group','Qual papel do Clérigo e como priorizar alvos e cura?','arena',2],
 ['battlefield','Campo de batalha 10 × 10','Battleground Arena of Tactics','Qual objetivo vence a partida e quais condições são equalizadas?','arena',2],
 ['ap','Pontos do Abismo, medalhas e loja','Abyss Points AP Medals','Qual compra ajuda mais agora: equipamento, pedras ou material?','arena',2]
 ]},
 {id:'economia',title:'Economia & rotina',desc:'Não misturar moedas, limites por personagem e limites compartilhados.',items:[
 ['od-energy','Energia de Od e retirada de recompensas','Odyle Energy Odal','Onde gastar a energia e quando a regeneração para por atingir o limite?','exp',1],
 ['kinah','Kinah vinculada e negociável','Kina Kinah bound tradable','Qual saldo paga cada ação e quais fontes têm limite?','bank',1],
 ['market','Mercado / casa de leilões','Market Auction','Comparando receita e material, vale fabricar, comprar ou vender?','shop',2],
 ['duties','Deveres / missões diárias','Duties Daily quests','Quais recompensas buscar e quanto custa renovar a oferta?','routine',1],
 ['commands','Ordens / contratos','Commands Contracts','Onde comprar, quais recompensas buscar e que limites são compartilhados?','routine',2],
 ['supply','Pedidos de suprimentos','Supply Requests Craft requests','Qual item excedente posso entregar e qual recompensa recebo?','craft',2],
 ['season-shop','Temporada, capítulos e lojas','Season Chapter Season Shop','Que moeda expira, qual loja visitar e o que priorizar antes do fim?','season',2],
 ['passes','Passe Daeva, presença e eventos','Daeva Pass Attendance events','Quais recompensas gratuitas e objetivos ainda estão pendentes?','season',2],
 ['membership','Membership e benefícios','Membership Quna Shop','Quais diferenças de recompensa e mercado se aplicam à minha conta?','shop',3]
 ]},
 {id:'social',title:'Combate, interface & grupo',desc:'Dominar execução e organização também faz parte da progressão.',items:[
 ['combate','Alvo, movimentação, voo e esquiva','Targeting Movement Flight Dodge','Como evitar dano sem perder alcance de cura ou janela de ataque?','combat',1],
 ['cc','Controle, interrupção e quebra de impacto','Crowd Control CC Stagger Break','Qual habilidade interrompe o boss e quando guardar a quebra de controle?','combat',1],
 ['macros','Barras, presets e macros nativos','Macro keybind preset','Que ações automatizar por prioridade e quais precisam ficar manuais?','combat',1],
 ['inventory','Inventário, banco e armazenamento compartilhado','Inventory Storage Server Storage','O que guardar, mover para outro personagem ou organizar para craft?','bank',2],
 ['legions','Legião: funções, tarefas e coordenação','Legion guild grupo','Quais funções e objetivos da sua legião ajudam o grupo a progredir?','legion',2],
 ['party','Grupo, recrutamento e comunicação','Party Chat matchmaking','Como combinar cleanse, ressurreição, interrupções e rota antes do boss?','legion',1]
 ]},
 {id:'reserva',title:'Reserva: disponibilidade a conferir',desc:'Assuntos encontrados em guias ou dados que não viram tarefa ativa por padrão.',items:[
 ['hard','Modos Hard / Ordeal das expedições','Hard Mode Ordeal','Esse modo já está disponível no patch Global?','exp',3,'Indisponível no lançamento descrito'],
 ['newclass','Classes e sistemas de temporadas asiáticas','Brawler KR TW future','Qual anúncio do Global confirma a chegada, antes de importar a build?','diff',3,'Referência de outras versões']
 ]}
];
const SYSTEMS=SYSTEM_GROUPS.flatMap(g=>g.items.map(([id,name,en,question,source,priority,availability])=>({id,name,en,question,source,priority,availability:availability||'Referência Global',group:g.id})));

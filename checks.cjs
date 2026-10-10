const fs=require('fs');const vm=require('vm');const assert=require('assert');
const elements=new Map();const get=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',classList:{add(){},remove(){},toggle(){return true}},setAttribute(){},focus(){},showModal(){},close(){}});return elements.get(id)};
const storage=new Map();const context={URLSearchParams,document:{getElementById:get,querySelectorAll:()=>[],body:{classList:{remove(){},toggle(){return true}}},addEventListener(){},activeElement:{tagName:'BODY'}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},location:{hash:'',origin:'https://example.test',pathname:'/'},window:{addEventListener(){},scrollTo(){}},setTimeout:()=>0,navigator:{},console};vm.createContext(context);
vm.runInContext(fs.readFileSync('web/data.js','utf8'),context);vm.runInContext(fs.readFileSync('web/profile-data.js','utf8'),context);vm.runInContext(fs.readFileSync('web/profile.js','utf8'),context);vm.runInContext(fs.readFileSync('web/systems-data.js','utf8'),context);vm.runInContext(fs.readFileSync('web/systems.js','utf8'),context);vm.runInContext(fs.readFileSync('web/class-guides.js','utf8'),context);vm.runInContext(fs.readFileSync('web/classes.js','utf8'),context);vm.runInContext(fs.readFileSync('web/compare.js','utf8'),context);vm.runInContext(fs.readFileSync('web/handbook-data.js','utf8'),context);vm.runInContext(fs.readFileSync('web/handbook.js','utf8'),context);vm.runInContext(fs.readFileSync('web/app.js','utf8'),context);
for(const id of ['rush','pets','craft','equipamento','asas','conquistas','panteao','classes','sistemas','inicio','progressao','builds','macros','habilidades','arcana','rotina','fontes']){context.location.hash='#'+id;vm.runInContext('render()',context);assert(get('main').innerHTML.length>1000,id);assert(!get('main').innerHTML.includes('undefined'),id);}
for(const b of ['dungeon','solo','pvp']){vm.runInContext(`build='${b}'; clericBuildDetails()`,context);}
assert(vm.runInContext("search('condenacao').some(x=>x.title==='Condenação')",context));assert(vm.runInContext("search('solo').length>0",context));
assert(vm.runInContext("gsResult().includes('200')",context));
context.location.hash='#macros';vm.runInContext('render()',context);assert(vm.runInContext("macroText().includes('A → A → A → B')",context));
for(const macro of ['whelps','lucia','farm'])assert(vm.runInContext(`state.macro='${macro}';clericMacros().includes('PRIMEIRA PRIORIDADE')`,context));
assert(vm.runInContext("esc('<img onerror=1>')==='&lt;img onerror=1&gt;'",context));
const manifest=JSON.parse(fs.readFileSync('.openai/hosting.json'));assert(!manifest.static);assert(fs.existsSync('dist/server/index.js'));
for(const name of ['app.js','data.js','styles.css'])assert(fs.readFileSync('web/index.html','utf8').includes(name));
context.location.hash='#personagem';vm.runInContext('render()',context);assert(get('main').innerHTML.includes('Encontre seu personagem'));assert(!get('main').innerHTML.includes('Maça da Alma'));
vm.runInContext('lastAttempt=Date.now();selectedCharacter=CAPETA;liveProfile=INITIAL_PROFILE;render()',context);assert(get('main').innerHTML.includes('Marchutan'));assert(get('main').innerHTML.includes('1507'));
context.location.hash='#inicio';vm.runInContext('state.notes="capeta notes";save();selectCharacter({characterId:"friend123",serverId:2403,region:"la",name:"amigo"});',context);assert(vm.runInContext('state.notes===""',context));vm.runInContext('state.notes="friend notes";save();selectCharacter(CAPETA)',context);assert(vm.runInContext('state.notes==="capeta notes"',context));
assert(vm.runInContext('CLASS_LIST.length===8&&CLASS_LIST.every(c=>CLASS_BUILDS.filter(b=>b.c===c[0]).length>=2)',context));vm.runInContext('classFilter="cleric";contentFilter="PvP"',context);assert(vm.runInContext('filteredClassBuilds().length===2',context));context.location.hash='#personagem?region=la';assert(vm.runInContext('route()==="personagem"',context));
assert(vm.runInContext("SYSTEMS.length>=70",context));assert(vm.runInContext("new Set(SYSTEMS.map(s=>s.id)).size===SYSTEMS.length",context));assert(vm.runInContext("SYSTEMS.every(s=>SYSTEM_SOURCES[s.source])",context));
assert(vm.runInContext("studyQuery='transmutacao'; filteredSystems()[0].id==='transmutacao'",context));assert(vm.runInContext("studyQuery='';studyGroup='producao';filteredSystems().length===11",context));assert(vm.runInContext("studyGroup='all';state.study={coleta:{status:'done',note:'test'}};studyFilter='done';filteredSystems().length===1 && studyCount()===1",context));assert(vm.runInContext("studyFilter='priority';filteredSystems().every(s=>s.priority===1)",context));assert(vm.runInContext("search('transmutacao').some(s=>s.id==='sistemas')",context));
assert(vm.runInContext('GUIDE.nav.filter(n=>n[0]==="builds").length===1&&!GUIDE.nav.some(n=>n[0]==="classes"||n[2].includes("Clérigo"))',context));
for(const c of ['gladiator','templar','assassin','ranger','sorcerer','elementalist','cleric','chanter']){
 for(const mode of ['dungeon','solo','pvp']){context.location.hash='#builds';vm.runInContext(`state.guideClass='${c}';build='${mode}';render()`,context);const html=get('main').innerHTML;assert(html.includes('01 / Estigmas'));assert(html.includes('PRESET SUGERIDO'));assert(!html.includes('undefined'),c+mode);assert(vm.runInContext(`CLASS_GUIDES.${c}.modes.${mode}.stigma.length===4`,context));get('savePreset').onclick();assert(vm.runInContext(`state.savedPreset==='${c}:${mode}'`,context));}
 context.location.hash='#macros';vm.runInContext('render()',context);assert(!get('main').innerHTML.includes('undefined'));if(c!=='cleric'){get('classMacroNotes').oninput({target:{value:'macro '+c}});assert(vm.runInContext(`state.classMacros.${c}==='macro ${c}'`,context));}
 context.location.hash='#habilidades';vm.runInContext('render()',context);assert(get('main').innerHTML.includes(vm.runInContext(`CLASS_GUIDES.${c}.skills[0][0]`,context)));
}
assert(vm.runInContext('search("mago").some(x=>x.id==="builds")',context));assert(vm.runInContext('search("insignia").some(x=>x.id==="builds")',context));
context.location.hash='#inicio';vm.runInContext('render()',context);assert(get('main').innerHTML.includes('Jogue junto.'));assert(get('main').innerHTML.includes('data-go-class="templar"'));
console.log('PASS: all routes, 24 presets, 8 class macro pages, saved presets, macro notes, character isolation, search, backup infrastructure and assets.');

context.location.hash='#ajustes';vm.runInContext('lastAttempt=Date.now();liveProfile=INITIAL_PROFILE;selectedCharacter=CAPETA;state.compareMode="dungeon";render()',context);assert(get('main').innerHTML.includes('ATIVAS ABAIXO DO MARCO'));assert(!get('main').innerHTML.includes('undefined'));
assert(vm.runInContext('profileClass()==="cleric"',context));assert(vm.runInContext('currentComparison().gs===1507',context));
vm.runInContext('updateCompareGoal("stats",{STR:35,DEX:0});render()',context);assert(vm.runInContext('currentComparison().stats.find(s=>s.type==="STR").gap===10',context));assert(vm.runInContext('currentComparison().stats.find(s=>s.type==="DEX").gap===-1',context));get('saveBaseline').onclick();
vm.runInContext('liveProfile=JSON.parse(JSON.stringify(INITIAL_PROFILE));liveProfile.info.stat.statList.find(s=>s.type==="STR").value=30;render()',context);assert(vm.runInContext('currentComparison().stats.find(s=>s.type==="STR").delta===5',context));
get('saveComparisonNote').onclick();assert(vm.runInContext('state.notes.includes("análise automática")',context));get('prepareAI').onclick();assert(vm.runInContext('aiComparisonPrompt(currentComparison()).includes("Não confunda atributos básicos")',context));
context.location.hash='#inicio';vm.runInContext('selectCharacter({characterId:"other123",serverId:2403,region:"la",name:"outro"})',context);assert(vm.runInContext('!state.compareBaseline&&!state.compareGoals',context));context.location.hash='#ajustes';vm.runInContext('liveProfile=null;render()',context);assert(get('main').innerHTML.includes('Buscar personagem'));
assert(vm.runInContext('computeComparison(INITIAL_PROFILE,"cleric","invalid",{},null)===null',context));
assert(!fs.readFileSync('web/index.html','utf8').toLowerCase().includes('smk'));assert(!vm.runInContext('home()',context).toLowerCase().includes('smk'));
console.log('PASS: comparison gaps, zero targets, historical deltas, notes, AI context, missing profiles, invalid modes and independent character goals.');
for(const routeId of ['pets','craft','equipamento','asas','conquistas','panteao']){
 context.location.hash='#'+routeId;vm.runInContext('render()',context);
 assert(get('main').innerHTML.includes('data-guide-task'),routeId);
 assert(vm.runInContext(`HANDBOOK.${routeId}.sections.every(s=>s.sources.length&&s.sources.every(id=>HANDBOOK_SOURCES[id]))`,context));
 assert(vm.runInContext(`new Set(HANDBOOK.${routeId}.sections.map(s=>s.id)).size===HANDBOOK.${routeId}.sections.length`,context));
}
assert(vm.runInContext("search('bakarma').some(s=>s.id.startsWith('panteao?section='))",context));
context.location.hash='#craft?section=cooking';assert(vm.runInContext('route()==="craft"',context));vm.runInContext('render()',context);
assert(vm.runInContext('validGuideTasks({"craft:0":true,"craft:1":"true","bad:0":true})["craft:0"]===true&&validGuideTasks({"craft:1":"true"})["craft:1"]===false',context));
vm.runInContext('state.guideTasks={"pets:0":true};save();selectCharacter({characterId:"checklistfriend",serverId:2403,region:"la",name:"teste"})',context);
assert(vm.runInContext('!state.guideTasks?.["pets:0"]',context));
assert(fs.readFileSync('web/app.js','utf8').includes('state.guideTasks=validGuideTasks(x.guideTasks)'));
console.log('PASS: six handbook routes, section links, source coverage, task validation and character checklist isolation.');

/* Rdzeń Zaawansowanego Kreatora Postaci / Advanced Character Creator core */
(function installAdvancedCreatorCore() {
  'use strict';

  const ATTRIBUTE_COSTS = {1:0,2:4,3:10,4:20,5:35,6:55,7:80,8:110,9:145,10:185,11:230,12:280};
  const SKILL_COSTS = {0:0,1:2,2:6,3:12,4:20,5:30,6:42,7:56,8:72};
  const ATTRIBUTES = [
    {key:'S',label:'S'},{key:'Wt',label:'Wt'},{key:'Zr',label:'Zr'},{key:'I',label:'I'},
    {key:'SW',label:'SW'},{key:'Int',label:'Int'},{key:'Ogd',label:'Ogd'},{key:'Speed',label:'Szybkość'}
  ];
  const SKILLS = [
    {key:'analysis',label:'Analiza (Int)',attr:'Int',pdf:'Analiza',sum:'AnalizaSuma'},
    {key:'athletics',label:'Atletyka (S)',attr:'S',pdf:'Atletyka',sum:'AtletykaSuma'},
    {key:'awareness',label:'Czujność (Int)',attr:'Int',pdf:'Czujność',sum:'CzujnośćSuma'},
    {key:'leadership',label:'Dowodzenie (SW)',attr:'SW',pdf:'Dowodzenie',sum:'DowodzenieSuma'},
    {key:'insight',label:'Intuicja (Ogd)',attr:'Ogd',pdf:'Intuicja',sum:'IntuicjaSuma'},
    {key:'tech',label:'Korzystanie z technologii (Int)',attr:'Int',pdf:'Technologia',sum:'TechnologiaSuma'},
    {key:'medicae',label:'Medycyna (Int)',attr:'Int',pdf:'Medycyna',sum:'MedycynaSuma'},
    {key:'psychicMastery',label:'Mistrzostwo psioniczne (SW)',attr:'SW',pdf:'Psionika',sum:'PsionikaSuma'},
    {key:'deception',label:'Oszukiwanie (Ogd)',attr:'Ogd',pdf:'Oszukiwanie',sum:'OszukiwanieSuma'},
    {key:'persuasion',label:'Perswazja (Ogd)',attr:'Ogd',pdf:'Perswazja',sum:'PerswazjaSuma'},
    {key:'pilot',label:'Pilotaż (Zr)',attr:'Zr',pdf:'Pilotaż',sum:'PilotażSuma'},
    {key:'cunning',label:'Przebiegłość (Ogd)',attr:'Ogd',pdf:'Przebiegłość',sum:'PrzebiegłośćSuma'},
    {key:'survival',label:'Przetrwanie (SW)',attr:'SW',pdf:'Przetrwanie',sum:'PrzetrwanieSuma'},
    {key:'stealth',label:'Ukrywanie się (Zr)',attr:'Zr',pdf:'Ukrywanie się',sum:'Ukrywanie sięSuma'},
    {key:'ballisticSkill',label:'Umiejętności strzeleckie (Zr)',attr:'Zr',pdf:'Umiejętności strzeleckie',sum:'Umiejętności StrzeleckieSuma'},
    {key:'weaponSkill',label:'Walka wręcz (I)',attr:'I',pdf:'Walka Wręcz',sum:'Walka WręczSuma'},
    {key:'scholar',label:'Wiedza ogólna (Int)',attr:'Int',pdf:'Wiedza ogólna',sum:'Wiedza ogólnaSuma'},
    {key:'intimidation',label:'Zastraszanie (SW)',attr:'SW',pdf:'Zastraszanie',sum:'ZastraszanieSuma'}
  ];
  const SPECIES_MAX = [
    ['Człowiek',8,8,8,8,8,8,8,8],['Ork',12,12,7,7,8,7,7,7],['Aeldari',8,7,12,12,12,10,6,10],
    ['Adeptus Astartes',10,10,9,9,10,10,8,9],['Primaris Astartes',12,12,9,9,10,10,8,9],
    ['Ogryn',12,12,7,4,8,1,4,8],['Szczurak',6,6,10,10,8,8,10,7],['Kroot',12,12,12,12,10,6,6,10],
    ['Drukhari',8,8,12,12,10,10,6,10],['Konstrukt Upiorytowy',12,12,8,8,12,10,4,8],
    ['Kasta powietrza',4,4,10,8,8,8,8,8],['Kasta ziemi',6,6,8,8,8,10,8,6],['Kasta ognia',7,7,8,8,8,8,8,8],
    ['Kasta wody',6,6,8,8,8,8,10,6],['Niebianie',6,6,8,8,10,8,8,6],['Vespidzi',8,8,12,8,8,8,5,'14*']
  ];
  const RULE_TYPES = [
    ['speciesAbility','Zdolności Gatunkowe','np. Honor Zakonu, Orczy, Łasuch, Intensywne emocje'],
    ['archetypeAbility','Zdolność Archetypu','np. Oddane współczucie, Płomienna zachęta, +1 do Wpływów'],
    ['backgroundBonus','Premia z Przeszłości','np. +1 do Żywotności, [DOWOLNE] Słowo Kluczowe'],
    ['keywordBonus','Bonusy Słów Kluczowych','np. Stalowy Legion Armageddonu, Ordo Hereticus, Zakon Uświęconej Tarczy'],
    ['factionBonus','Specjalne Bonusy Frakcji','np. Ścieżki Asuryani (Ścieżka przebudzenia), Mutacja Krootów (Ludojad)'],
    ['other','Inne','np. Zakony Pierwszego Powołania, Homebrew']
  ];
  const DEFAULT_SPECIAL_RULES = [
    {type:'speciesAbility',name:'',target:'none',value:0},
    {type:'archetypeAbility',name:'',target:'none',value:0},
    {type:'backgroundBonus',name:'',target:'none',value:0},
    {type:'keywordBonus',name:'',target:'none',value:0},
    {type:'other',name:'',target:'none',value:0}
  ];
  const RULE_TARGETS = [
    ['none','Opis / brak modyfikatora'],['woundsMax','Żywotność maksymalna'],['shock','Odporność Psychiczna'],
    ['determination','Determinacja'],['defence','Obrona'],['resilience','Odporność'],['resolve','Upór'],
    ['conviction','Odwaga'],['influence','Wpływy'],['wealth','Majątek'],['corruption','Spaczenie'],['speed','Szybkość']
  ];
  const SIZE_DEFENCE_BONUS = {Malutki:2,Mały:1,Średni:0,Duży:0,Ogromny:0,Monstrualny:0};
  let talentCount = 2;

  const byId = id => document.getElementById(id);
  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  const toInt = (value,fallback=0) => { const parsed=parseInt(value,10); return Number.isFinite(parsed)?parsed:fallback; };
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const optionHtml = (items,current) => items.map(([value,label]) => `<option value="${value}"${value===current?' selected':''}>${label}</option>`).join('');

  function renderAttributes() {
    byId('attributesTable').innerHTML = `<thead><tr>${ATTRIBUTES.map(item=>`<th>${item.label}</th>`).join('')}</tr></thead><tbody><tr>${ATTRIBUTES.map(item=>`<td><input type="number" id="attr_${item.key}" value="${item.key==='Speed'?6:1}" min="1" max="12"></td>`).join('')}</tr></tbody>`;
  }

  function renderSkills() {
    const left=SKILLS.slice(0,9), right=SKILLS.slice(9);
    byId('skillsTable').innerHTML = `<thead><tr><th>Umiejętność</th><th>Wartość</th><th>Umiejętność</th><th>Wartość</th></tr></thead><tbody>${left.map((skill,index)=>`<tr><td>${skill.label}</td><td><input type="number" id="skill_${skill.key}" value="0" min="0" max="8"></td><td>${right[index].label}</td><td><input type="number" id="skill_${right[index].key}" value="0" min="0" max="8"></td></tr>`).join('')}</tbody>`;
  }

  function renderTalents(existing=[]) {
    talentCount=clamp(Math.max(2,Math.ceil((existing.length||talentCount)/2)*2),2,100);
    const rows=[];
    for(let index=0;index<talentCount;index+=2){
      const a=existing[index]||{}, b=existing[index+1]||{};
      rows.push(`<tr><td><textarea id="talent_name_${index+1}">${escapeHtml(a.name||'')}</textarea></td><td><input type="number" id="talent_cost_${index+1}" value="${Math.max(0,toInt(a.cost,0))}" min="0"></td><td><textarea id="talent_name_${index+2}">${escapeHtml(b.name||'')}</textarea></td><td><input type="number" id="talent_cost_${index+2}" value="${Math.max(0,toInt(b.cost,0))}" min="0"></td></tr>`);
    }
    byId('talentsTable').innerHTML=`<thead><tr><th>Nazwa</th><th>Koszt</th><th>Nazwa</th><th>Koszt</th></tr></thead><tbody>${rows.join('')}</tbody>`;
    byId('removeTalentRowButton').hidden=talentCount<=2;
  }

  function collectTalents() {
    return Array.from({length:talentCount},(_,index)=>({
      name:byId(`talent_name_${index+1}`)?.value||'',
      cost:Math.max(0,toInt(byId(`talent_cost_${index+1}`)?.value,0))
    }));
  }

  function specialRuleRow(index,rule) {
    return `<tr data-rule-index="${index}"><td><select id="rule_type_${index}">${optionHtml(RULE_TYPES,rule.type||'other')}</select></td><td><textarea id="rule_name_${index}">${escapeHtml(rule.name||'')}</textarea></td><td><select id="rule_target_${index}">${optionHtml(RULE_TARGETS,rule.target||'none')}</select></td><td><input type="number" id="rule_value_${index}" value="${toInt(rule.value,0)}"></td></tr>`;
  }

  function renderSpecialRules(existing=[]) {
    const rules = existing.length ? existing : DEFAULT_SPECIAL_RULES.map(rule=>({...rule}));
    byId('specialRulesTable').innerHTML=`<thead><tr><th>Typ</th><th>Nazwa / opis</th><th>Modyfikuje</th><th>Wartość</th></tr></thead><tbody>${rules.slice(0,100).map((rule,index)=>specialRuleRow(index,rule)).join('')}</tbody>`;
    byId('removeSpecialRuleButton').hidden=rules.length<=1;
    updateRulePlaceholders();
  }

  function collectSpecialRules() {
    return Array.from(document.querySelectorAll('#specialRulesTable tr[data-rule-index]')).map(row=>{
      const i=row.dataset.ruleIndex;
      return {
        type:byId(`rule_type_${i}`)?.value||'other',
        name:byId(`rule_name_${i}`)?.value||'',
        target:byId(`rule_target_${i}`)?.value||'none',
        value:toInt(byId(`rule_value_${i}`)?.value,0)
      };
    });
  }

  function updateRulePlaceholders() {
    document.querySelectorAll('#specialRulesTable tr[data-rule-index]').forEach(row=>{
      const i=row.dataset.ruleIndex;
      const definition=RULE_TYPES.find(item=>item[0]===byId(`rule_type_${i}`)?.value);
      const textarea=byId(`rule_name_${i}`);
      if(textarea) textarea.placeholder=definition?.[2]||'';
    });
  }

  function computeData() {
    const attrs={};
    ATTRIBUTES.forEach(item=>attrs[item.key]=clamp(toInt(byId(`attr_${item.key}`)?.value,item.key==='Speed'?6:1),1,12));
    const skills={}, skillTotals={};
    SKILLS.forEach(item=>{
      skills[item.key]=clamp(toInt(byId(`skill_${item.key}`)?.value,0),0,8);
      skillTotals[item.key]=skills[item.key]+attrs[item.attr];
    });
    const character={
      gameTier:clamp(toInt(byId('character_gameTier')?.value,1),1,5),
      speciesName:(byId('character_speciesName')?.value||'').trim(),
      size:byId('character_size')?.value||'Średni',
      factionName:(byId('character_factionName')?.value||'').trim(),
      archetypeName:(byId('character_archetypeName')?.value||'').trim(),
      keywords:(byId('character_keywords')?.value||'').trim()
    };
    const rules=collectSpecialRules(), bonus={};
    rules.forEach(rule=>{if(rule.target&&rule.target!=='none')bonus[rule.target]=(bonus[rule.target]||0)+Number(rule.value||0);});
    const influenceAttribute=byId('derived_influenceAttribute')?.value||'Ogd';
    const corruptionBase=toInt(byId('derived_corruptionBase')?.value,0);
    const raw={
      woundsMax:attrs.Wt+2*character.gameTier+(bonus.woundsMax||0),
      shock:attrs.SW+character.gameTier+(bonus.shock||0),
      determination:attrs.Wt+(bonus.determination||0),
      defence:attrs.I-1+(SIZE_DEFENCE_BONUS[character.size]||0)+(bonus.defence||0),
      resilience:attrs.Wt+1+(bonus.resilience||0),
      resolve:attrs.SW+(bonus.resolve||0),
      conviction:attrs.SW-1+(bonus.conviction||0),
      influence:(attrs[influenceAttribute]||attrs.Ogd)-1+(bonus.influence||0),
      wealth:character.gameTier+(bonus.wealth||0),
      corruption:corruptionBase+(bonus.corruption||0),
      speed:attrs.Speed+(bonus.speed||0),
      passiveAwareness:Math.ceil(skillTotals.awareness/2)
    };
    const values={};
    Object.entries(raw).forEach(([key,value])=>values[key]=key==='corruption'?Math.max(0,Math.ceil(value)):Math.max(1,Math.ceil(value)));
    return {attrs,skills,skillTotals,character,rules,raw,values,influenceAttribute,corruptionBase,talents:collectTalents()};
  }

  function renderDerivedStats() {
    const rows=[
      ['Żywotność maksymalna','Wt + (2 × Poziom Gry) + bonusy','woundsMax'],
      ['Odporność Psychiczna','SW + Poziom Gry + bonusy','shock'],
      ['Determinacja','Wt + bonusy','determination'],
      ['Obrona','I - 1 + Rozmiar + bonusy','defence'],
      ['Odporność','Wt + 1 + bonusy','resilience'],
      ['Upór','SW + bonusy','resolve'],
      ['Odwaga','SW - 1 + bonusy','conviction'],
      ['Wpływy','Wybrany atrybut - 1 + bonusy','influence'],
      ['Majątek','Poziom Gry + bonusy','wealth'],
      ['Spaczenie','Wartość ręczna + bonusy','corruption'],
      ['Szybkość','Szybkość + bonusy','speed'],
      ['Pasywna Czujność','Suma Czujność (Int) / 2','passiveAwareness']
    ];
    byId('derivedStatsTable').innerHTML=`<thead><tr><th>Cecha</th><th>Podstawa</th><th>Ustawienie</th><th>Wynik</th></tr></thead><tbody>${rows.map(([label,formula,key])=>{
      let setting='—';
      if(key==='influence')setting='<select id="derived_influenceAttribute"><option value="S">S</option><option value="Wt">Wt</option><option value="Zr">Zr</option><option value="I">I</option><option value="SW">SW</option><option value="Int">Int</option><option value="Ogd" selected>Ogd</option></select>';
      if(key==='corruption')setting='<input type="number" id="derived_corruptionBase" value="0" min="0">';
      return `<tr><td>${label}</td><td>${formula}</td><td>${setting}</td><td class="derived-value" id="derived_value_${key}">1</td></tr>`;
    }).join('')}</tbody>`;
  }

  function derivedLabel(key) {
    return ({woundsMax:'Żywotność maksymalna',shock:'Odporność Psychiczna',determination:'Determinacja',defence:'Obrona',resilience:'Odporność',resolve:'Upór',conviction:'Odwaga',influence:'Wpływy',wealth:'Majątek',speed:'Szybkość',passiveAwareness:'Pasywna Czujność'})[key]||key;
  }

  function refreshDerivedStats() {
    if(!byId('derived_value_woundsMax'))return;
    const data=computeData();
    Object.entries(data.values).forEach(([key,value])=>{const cell=byId(`derived_value_${key}`);if(cell)cell.textContent=String(value);});
    const warnings=[];
    Object.entries(data.raw).forEach(([key,value])=>{
      if(key==='corruption'){
        if(value<0)warnings.push('Spaczenie: wartość surowa jest mniejsza niż 0.');
        if(data.values.corruption>25)warnings.push('Spaczenie przekracza 25 pól na karcie PDF.');
      } else if(value<=0) {
        warnings.push(`${derivedLabel(key)}: wartość surowa wynosi ${value}. Zastosowano minimum 1.`);
      }
    });
    byId('derivedWarnings').textContent=warnings.join('\n');
  }

  function isLearningTreeValid(values) {
    for(let rating=2;rating<=8;rating++){
      const atRatingOrHigher=values.filter(value=>value>=rating).length;
      const supports=values.filter(value=>value>=rating-1).length;
      if(atRatingOrHigher>0&&supports<atRatingOrHigher*2)return false;
    }
    return true;
  }

  function recalcXP() {
    let total=0;
    ATTRIBUTES.forEach(item=>{
      const input=byId(`attr_${item.key}`), value=clamp(toInt(input?.value,item.key==='Speed'?6:1),1,12);
      if(input)input.value=value;
      total+=ATTRIBUTE_COSTS[value];
    });
    const skillValues=[];
    SKILLS.forEach(item=>{
      const input=byId(`skill_${item.key}`), value=clamp(toInt(input?.value,0),0,8);
      if(input)input.value=value;
      skillValues.push(value);
      total+=SKILL_COSTS[value];
    });
    collectTalents().forEach(talent=>total+=talent.cost);
    const remaining=toInt(byId('xpPool')?.value,0)-total;
    byId('xpRemaining').textContent=String(remaining);
    const errors=[];
    if(remaining<0)errors.push('Przekroczono dostępną pulę PD!');
    if(!isLearningTreeValid(skillValues))errors.push('Niezgodność z zasadą Drzewa Nauki (str. 26)');
    byId('errorMessage').textContent=errors.join('\n');
    refreshDerivedStats();
  }

  function getState() {
    const data=computeData();
    return {xpPool:Math.max(0,toInt(byId('xpPool')?.value,0)),talentCount,data};
  }

  function applyState(payload) {
    const data=payload?.data||payload||{};
    if(payload?.xpPool!==undefined)byId('xpPool').value=payload.xpPool;
    Object.entries(data.attrs||data.attributes||{}).forEach(([key,value])=>{const input=byId(`attr_${key}`);if(input)input.value=value;});
    Object.entries(data.skills||{}).forEach(([key,value])=>{const input=byId(`skill_${key}`);if(input)input.value=value;});
    const talents=Array.isArray(data.talents)?data.talents:[];
    renderTalents(talents.length?talents:Array.from({length:Math.max(2,toInt(payload?.talentCount,2))},()=>({name:'',cost:0})));
    const character=data.character||{};
    [['character_gameTier',character.gameTier],['character_speciesName',character.speciesName],['character_size',character.size],['character_factionName',character.factionName],['character_archetypeName',character.archetypeName],['character_keywords',character.keywords]].forEach(([id,value])=>{if(value!==undefined&&byId(id))byId(id).value=value;});
    renderSpecialRules(Array.isArray(data.rules)?data.rules:Array.isArray(data.specialRules)?data.specialRules:[]);
    if(data.influenceAttribute&&byId('derived_influenceAttribute'))byId('derived_influenceAttribute').value=data.influenceAttribute;
    if(data.corruptionBase!==undefined&&byId('derived_corruptionBase'))byId('derived_corruptionBase').value=data.corruptionBase;
    recalcXP();
  }

  function toggleModal(id,open) {
    const modal=byId(id);
    if(!modal)return;
    modal.classList.toggle('is-open',open);
    modal.setAttribute('aria-hidden',String(!open));
  }

  function showDialog({title,message,confirm=true,yesText='Tak',noText='Nie'}) {
    return new Promise(resolve=>{
      const modal=byId('confirmModal'), yes=byId('confirmModalYesButton'), no=byId('confirmModalNoButton');
      byId('confirmModalTitle').textContent=title;
      byId('confirmModalMessage').textContent=message;
      yes.textContent=yesText;
      no.textContent=noText;
      no.hidden=!confirm;
      const finish=value=>{
        yes.removeEventListener('click',onYes);
        no.removeEventListener('click',onNo);
        modal.removeEventListener('click',onOverlay);
        document.removeEventListener('keydown',onKey);
        toggleModal('confirmModal',false);
        resolve(value);
      };
      const onYes=()=>finish(true), onNo=()=>finish(false);
      const onOverlay=event=>{if(event.target===modal)finish(confirm?false:true);};
      const onKey=event=>{if(event.key==='Escape')finish(confirm?false:true);};
      yes.addEventListener('click',onYes);
      no.addEventListener('click',onNo);
      modal.addEventListener('click',onOverlay);
      document.addEventListener('keydown',onKey);
      toggleModal('confirmModal',true);
    });
  }

  function renderSpeciesMax() {
    const headers=['Gatunek','Siła','Wytrzymałość','Zręczność','Inicjatywa','Siła Woli','Inteligencja','Ogłada','Szybkość'];
    byId('speciesMaxTable').innerHTML=`<thead><tr>${headers.map(text=>`<th>${text}</th>`).join('')}</tr></thead><tbody>${SPECIES_MAX.map(row=>`<tr>${row.map(value=>`<td>${value}</td>`).join('')}</tr>`).join('')}</tbody>`;
  }

  function initialize() {
    renderAttributes();
    renderSkills();
    renderTalents();
    renderDerivedStats();
    renderSpecialRules();
    renderSpeciesMax();

    document.addEventListener('input',event=>{if(event.target.matches('input,textarea,select'))recalcXP();});
    document.addEventListener('change',event=>{if(event.target.id.startsWith('rule_type_'))updateRulePlaceholders();recalcXP();});
    byId('addTalentRowButton').addEventListener('click',()=>{const current=collectTalents();current.push({name:'',cost:0},{name:'',cost:0});renderTalents(current);recalcXP();});
    byId('removeTalentRowButton').addEventListener('click',()=>{const current=collectTalents();if(current.length>2)current.splice(-2);renderTalents(current);recalcXP();});
    byId('addSpecialRuleButton').addEventListener('click',()=>{const rules=collectSpecialRules();rules.push({type:'other',name:'',target:'none',value:0});renderSpecialRules(rules);refreshDerivedStats();});
    byId('removeSpecialRuleButton').addEventListener('click',()=>{const rules=collectSpecialRules();if(rules.length>1)rules.pop();renderSpecialRules(rules);refreshDerivedStats();});
    byId('openCharacterRulesModalButton').addEventListener('click',()=>toggleModal('characterRulesModal',true));
    byId('closeCharacterRulesModalButton').addEventListener('click',()=>toggleModal('characterRulesModal',false));
    byId('showSpeciesMaxButton').addEventListener('click',()=>toggleModal('speciesMaxModal',true));
    byId('closeSpeciesMaxButton').addEventListener('click',()=>toggleModal('speciesMaxModal',false));
    byId('backToMainButton').addEventListener('click',()=>{window.location.href='../Main/index.html';});
    byId('manualButton').addEventListener('click',()=>{window.open('HowToUse/pl.pdf','_blank','noopener');});
    document.querySelectorAll('.modal').forEach(modal=>modal.addEventListener('click',event=>{if(event.target===modal&&modal.id!=='confirmModal')toggleModal(modal.id,false);}));
    document.addEventListener('keydown',event=>{if(event.key==='Escape')['characterRulesModal','speciesMaxModal'].forEach(id=>toggleModal(id,false));});
    recalcXP();
  }

  window.WNGCreatorV2={
    ATTRIBUTES,SKILLS,getState,applyState,getComputedData:computeData,recalcXP,
    showConfirmation:config=>showDialog({...config,confirm:true}),
    showInfo:config=>showDialog({...config,confirm:false,yesText:'OK'})
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});
  else initialize();
})();

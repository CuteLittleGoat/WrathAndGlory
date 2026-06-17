// Rozszerzenie UI dla dodatkowych arkuszy pojazdów / UI extension for additional vehicle sheets
(function(){
  const EXTRA_VEHICLE_SHEETS = ["Uszkodzenia Pojazdów", "Eksplozje Pojazdów"];
  const ADMIN_ONLY_EXTRA_SHEETS = new Set(["Uszkodzenia Pojazdów"]);
  const EXTRA_BY_TAB_LABEL = new Map(EXTRA_VEHICLE_SHEETS.map((name)=>[name.toUpperCase(), name]));
  const ADMIN_MODE = new URLSearchParams(location.search).get("admin") === "1";

  let syncQueued = false;

  function getVehicleCheckbox(){
    return document.getElementById("toggleVehicleTabs");
  }

  function getTabSheetName(tab){
    const label = String(tab?.textContent || "").trim().toUpperCase();
    return EXTRA_BY_TAB_LABEL.get(label) || null;
  }

  function shouldShowSheet(sheetName){
    const vehicleCheckbox = getVehicleCheckbox();
    const showVehicleTabs = Boolean(vehicleCheckbox && vehicleCheckbox.checked);
    if (!showVehicleTabs) return false;
    if (ADMIN_ONLY_EXTRA_SHEETS.has(sheetName) && !ADMIN_MODE) return false;
    return true;
  }

  function syncExtraVehicleTabs(){
    syncQueued = false;
    const tabsRoot = document.getElementById("tabs");
    if (!tabsRoot) return;

    const tabs = Array.from(tabsRoot.querySelectorAll(".tab"));
    let activeWasHidden = false;

    for (const tab of tabs){
      const sheetName = getTabSheetName(tab);
      if (!sheetName) continue;

      tab.classList.add("tab--vehicle");
      const visible = shouldShowSheet(sheetName);
      tab.hidden = !visible;
      tab.style.display = visible ? "" : "none";

      if (!visible && tab.classList.contains("active")){
        activeWasHidden = true;
      }
    }

    if (activeWasHidden){
      const fallback = tabs.find((tab)=>!tab.hidden && tab.style.display !== "none");
      if (fallback && !fallback.classList.contains("active")){
        fallback.click();
      }
    }
  }

  function queueSync(){
    if (syncQueued) return;
    syncQueued = true;
    if (typeof requestAnimationFrame === "function"){
      requestAnimationFrame(syncExtraVehicleTabs);
    } else {
      setTimeout(syncExtraVehicleTabs, 0);
    }
  }

  function wrapInitUI(){
    if (typeof window.initUI !== "function" || window.initUI.__vehicleExtraWrapped) return;
    const originalInitUI = window.initUI;
    const wrappedInitUI = function(...args){
      const result = originalInitUI.apply(this, args);
      queueSync();
      return result;
    };
    wrappedInitUI.__vehicleExtraWrapped = true;
    window.initUI = wrappedInitUI;
    try {
      initUI = wrappedInitUI;
    } catch (_error) {
      // W starszych lub bardziej restrykcyjnych środowiskach wystarczy przypisanie do window.initUI.
    }
  }

  function install(){
    wrapInitUI();

    const vehicleCheckbox = getVehicleCheckbox();
    if (vehicleCheckbox && !vehicleCheckbox.dataset.vehicleExtraSyncBound){
      vehicleCheckbox.addEventListener("change", queueSync);
      vehicleCheckbox.dataset.vehicleExtraSyncBound = "1";
    }

    const tabsRoot = document.getElementById("tabs");
    if (tabsRoot && !tabsRoot.dataset.vehicleExtraObserverBound && typeof MutationObserver === "function"){
      const observer = new MutationObserver(queueSync);
      observer.observe(tabsRoot, {childList:true, subtree:true, attributes:true, attributeFilter:["class", "hidden", "style"]});
      tabsRoot.dataset.vehicleExtraObserverBound = "1";
    }

    queueSync();
  }

  install();
  document.addEventListener("DOMContentLoaded", install);
  window.addEventListener("load", install);
})();

(()=>{var i="production",r=i=="development"?"http://localhost:1314":"";function a(e){let t=document.querySelector(`input[name=${e}]:checked`);if(!t)throw new Error(`Failed to find a selected input with name ${e}`);return t.value?t.id:""}async function o(){let e=document.querySelector(".js-save-label");if(!e)return;e.addEventListener("click",async t=>{t.preventDefault();let n=t.target;n.disabled=!0;try{await fetch(`${r}/api/labels/presets`,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({imageFilename:a("labelimage"),titleFilename:a("labeltitle"),addressFilename:a("labeladdress")})})}catch(l){console.error("Failed to print: ",l)}finally{n.disabled=!1}}),e.disabled=!1}o();})();

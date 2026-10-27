(function(){
  "use strict";
  var pages=Array.from(document.querySelectorAll(".paper-page"));
  var previous=document.getElementById("prev-leaf");
  var next=document.getElementById("next-leaf");
  var counter=document.getElementById("leaf-counter");
  var fill=document.getElementById("leaf-fill");
  var announcement=document.getElementById("page-announcement");
  if(!pages.length||!previous||!next){return;}
  var current=0, busy=false;
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function label(n){return String(n).padStart(2,"0")+" / "+String(pages.length).padStart(2,"0");}
  function update(){
    previous.disabled=current===0;
    next.disabled=current===pages.length-1;
    next.textContent=current===pages.length-1?"마지막 장":"다음 장 →";
    counter.textContent=label(current+1);
    fill.style.width=((current+1)/pages.length*100)+"%";
    announcement.textContent=pages[current].dataset.title+" · "+(current+1)+" / "+pages.length;
    try{history.replaceState(null,"",location.pathname+(current?"#page-"+(current+1):""));}catch(e){}
  }
  function turn(where){
    var target=current+where;
    if(busy||target<0||target>=pages.length)return;
    busy=true;
    var old=pages[current];
    old.classList.add(where>0?"turn-out-forward":"turn-out-backward");
    window.setTimeout(function(){
      old.hidden=true;
      old.className="paper-page";
      current=target;
      var shown=pages[current];
      shown.hidden=false;
      shown.className="paper-page is-current turn-in";
      update();
      window.setTimeout(function(){
        shown.classList.remove("turn-in");
        busy=false;
      },reduced?10:340);
      if(window.matchMedia("(max-width: 580px)").matches){document.getElementById("case-document").scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});}
    },reduced?0:265);
  }
  previous.addEventListener("click",function(){turn(-1);});
  next.addEventListener("click",function(){turn(1);});
  window.addEventListener("keydown",function(event){
    if(event.altKey||event.ctrlKey||event.metaKey)return;
    if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;
    if(event.key==="ArrowRight"){event.preventDefault();turn(1);}
    if(event.key==="ArrowLeft"){event.preventDefault();turn(-1);}
  });
  var match=location.hash.match(/^#page-(\d+)$/);
  if(match){var number=Number(match[1]);if(number>=1&&number<=pages.length){current=number-1;pages.forEach(function(page,index){page.hidden=index!==current;page.className=index===current?"paper-page is-current":"paper-page";});}}
  update();
})();
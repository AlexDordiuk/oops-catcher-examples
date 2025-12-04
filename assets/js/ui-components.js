class d{notificationContainer=null;constructor(){this.createNotificationContainer()}createNotificationContainer(){if(document.getElementById("notification-container"))return;this.notificationContainer=document.createElement("div"),this.notificationContainer.id="notification-container",this.notificationContainer.className="fixed top-4 right-4 z-50 flex flex-col gap-2",document.body.appendChild(this.notificationContainer)}showNotification(o,e={}){let{type:t="info",duration:r=3000}=e,n=document.createElement("div");n.className=`
      p-4 rounded-lg shadow-lg max-w-sm
      transform transition-all duration-300
      flex items-center gap-3
      ${this.getNotificationClasses(t)}
    `;let i=this.getNotificationIcon(t);n.innerHTML=`
      <span class="text-xl">${i}</span>
      <span class="flex-1">${o}</span>
      <button class="text-current opacity-50 hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
        ×
      </button>
    `,this.notificationContainer?.appendChild(n),setTimeout(()=>{n.style.transform="translateX(0)",n.style.opacity="1"},10),setTimeout(()=>{n.style.opacity="0",n.style.transform="translateX(100%)",setTimeout(()=>n.remove(),300)},r)}getNotificationClasses(o){let e={success:"bg-green-50 text-green-800 border border-green-200",error:"bg-red-50 text-red-800 border border-red-200",warning:"bg-yellow-50 text-yellow-800 border border-yellow-200",info:"bg-blue-50 text-blue-800 border border-blue-200"};return e[o]||e.info}getNotificationIcon(o){let e={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};return e[o]||e.info}showModal(o,e){let t=document.createElement("div");t.className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",t.innerHTML=`
      <div class="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        ${e?`
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-xl font-semibold text-gray-900">${e}</h3>
          </div>
        `:""}
        <div class="px-6 py-4 overflow-y-auto max-h-[60vh]">
          ${o}
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" onclick="this.closest('.fixed').remove()">
            Close
          </button>
        </div>
      </div>
    `,document.body.appendChild(t),t.addEventListener("click",(r)=>{if(r.target===t)t.remove()})}formatJSON(o){return`<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>${JSON.stringify(o,null,2)}</code></pre>`}addCustomField(o){let e=document.getElementById(o);if(!e)return;let t=document.createElement("div");t.className="flex gap-2 items-center",t.innerHTML=`
      <input type="text" placeholder="Key" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent custom-key">
      <input type="text" placeholder="Value" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent custom-value">
      <button type="button" class="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" onclick="this.parentElement.remove()">
        ×
      </button>
    `,e.appendChild(t)}collectCustomFields(o){let e=document.getElementById(o);if(!e)return{};let t=e.querySelectorAll(".flex"),r={};return t.forEach((n)=>{let i=n.querySelector(".custom-key"),a=n.querySelector(".custom-value");if(i&&a){let c=i.value.trim(),s=a.value.trim();if(c&&s){let l=Number(s);r[c]=isNaN(l)?s:l}}}),r}}var u=new d;export{u as ui,d as UIComponents};

//# debugId=2E07C0E4555D397F64756E2164756E21

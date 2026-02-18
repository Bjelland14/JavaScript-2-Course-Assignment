(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();const q="token",T="profileName",M="apiKey";function U(){try{const t="__test__";return localStorage.setItem(t,"1"),localStorage.removeItem(t),localStorage}catch{try{const t="__test__";return sessionStorage.setItem(t,"1"),sessionStorage.removeItem(t),sessionStorage}catch{return null}}}function w(t,e){const o=U();if(o)try{o.setItem(t,e)}catch{}}function S(t){const e=U();if(!e)return null;try{return e.getItem(t)}catch{return null}}function _(t){w(q,t)}function A(){return S(q)}function I(t){w(T,t)}function N(){return S(T)}function B(t){w(M,t)}function F(){return S(M)}const K="https://v2.api.noroff.dev";async function f(t,e={}){const o=A(),a=F(),r={"Content-Type":"application/json",...e.headers??{}};o&&(r.Authorization=`Bearer ${o}`),a&&(r["X-Noroff-API-Key"]=a);const n=await fetch(`${K}${t}`,{...e,headers:r,body:e.body?JSON.stringify(e.body):void 0}),s=await n.text(),i=s?JSON.parse(s):null;if(!n.ok){const c=i&&(i.message||i.errors?.[0]?.message)||"API error";throw new Error(`${n.status}: ${c}`)}return i}function D(t){return f("/auth/login",{method:"POST",body:t})}function j(t){return f("/auth/register",{method:"POST",body:t})}function G(t){return f("/auth/create-api-key",{method:"POST",body:{name:t}})}function C(t){t.innerHTML=`
    <div class="container">
      <h1>Login</h1>

      <section class="card">
        <form id="login-form" class="form">
          <label>Email
            <input name="email" type="email" required />
          </label>

          <label>Password
            <input name="password" type="password" required />
          </label>

          <button class="btn" type="submit">Login</button>
        </form>

        <p id="login-error" class="error"></p>
      </section>

      <p class="muted">No user? <a href="#/register">Register</a></p>
    </div>
  `;const e=t.querySelector("#login-form"),o=t.querySelector("#login-error");!e||!o||e.addEventListener("submit",async a=>{a.preventDefault(),o.textContent="";const r=new FormData(e),n=String(r.get("email")??""),s=String(r.get("password")??"");try{const i=await D({email:n,password:s});if(_(i.data.accessToken),I(i.data.name),!F()){const l=await G("fed2-js2-ca");B(l.data.key)}location.hash="#/feed"}catch(i){o.textContent=i instanceof Error?i.message:"Login failed"}})}function W(t){t.innerHTML=`
    <div class="container">
      <h1>Register</h1>

      <section class="card">
        <form id="register-form" class="form">
          <label>Name
            <input name="name" type="text" required />
          </label>

          <label>Email
            <input name="email" type="email" required />
          </label>

          <label>Password
            <input name="password" type="password" required />
          </label>

          <button class="btn" type="submit">Register</button>
        </form>

        <p id="register-error" class="error"></p>
        <p id="register-success" class="success"></p>
      </section>

      <p class="muted"><a href="#/login">Back to login</a></p>
    </div>
  `;const e=t.querySelector("#register-form"),o=t.querySelector("#register-error"),a=t.querySelector("#register-success");!e||!o||!a||e.addEventListener("submit",async r=>{r.preventDefault(),o.textContent="",a.textContent="";const n=new FormData(e),s=String(n.get("name")??""),i=String(n.get("email")??""),c=String(n.get("password")??"");try{await j({name:s,email:i,password:c}),a.textContent="Registered! Go to login.",location.hash="#/login"}catch(l){o.textContent=l instanceof Error?l.message:"Register failed"}})}function Y(){return f("/social/posts?_author=true",{method:"GET"})}function J(t){return f(`/social/posts/${t}?_author=true`,{method:"GET"})}function z(t){return f("/social/posts",{method:"POST",body:t})}function V(t,e){return f(`/social/posts/${t}`,{method:"PUT",body:e})}function X(t){return f(`/social/posts/${t}`,{method:"DELETE"})}function E(t){const e=t.title?.trim()?t.title:"(No title)",o=t.body?.trim()?t.body:"",a=t.author?.name??"Unknown",r=t.media?.url,n=t.media?.alt??"Post image",s=a!=="Unknown"?`<a href="#/user/${a}">${a}</a>`:"Unknown";return`
    <article class="card">
      <h3>${e}</h3>
      <p class="muted">By ${s}</p>
      ${r?`<img class="post-img" src="${r}" alt="${n}" />`:""}
      ${o?`<p>${o}</p>`:""}
      <p><a href="#/post/${t.id}">Open post</a></p>
    </article>
  `}function P(t,e){const o=e.trim().toLowerCase();return o?t.filter(a=>{const r=a.title?.toLowerCase()??"",n=a.body?.toLowerCase()??"",s=a.author?.name?.toLowerCase()??"";return r.includes(o)||n.includes(o)||s.includes(o)}):t}function Q(t){t.innerHTML=`
    <div class="container">
      <h1>Feed</h1>

      <section class="card">
        <h2>Create post</h2>

        <form id="create-post-form" class="form">
          <label>Title
            <input name="title" type="text" />
          </label>

          <label>Body
            <textarea name="body" rows="4"></textarea>
          </label>

          <label>Media URL (optional)
            <input name="mediaUrl" type="url" />
          </label>

          <label>Media alt text (optional)
            <input name="mediaAlt" type="text" />
          </label>

          <button class="btn" type="submit">Create</button>
        </form>

        <p id="create-error" class="error"></p>
        <p id="create-success" class="success"></p>
      </section>

      <section class="card">
        <h2>Search</h2>
        <input id="search-input" type="text" placeholder="Search by title, body or author..." />
        <p id="search-info" class="muted"></p>
      </section>

      <p id="status" class="muted">Loading...</p>
      <div id="list"></div>

      <nav class="nav">
        <a href="#/profile">My profile</a> |
        <a href="#/login">Login</a>
      </nav>
    </div>
  `;const e=t.querySelector("#create-post-form"),o=t.querySelector("#create-error"),a=t.querySelector("#create-success"),r=t.querySelector("#status"),n=t.querySelector("#list"),s=t.querySelector("#search-input"),i=t.querySelector("#search-info");if(!e||!o||!a||!r||!n||!s||!i)return;let c=[];async function l(){r.textContent="Loading...",n.innerHTML="",i.textContent="";try{c=(await Y()).data;const u=P(c,s.value);r.textContent="",i.textContent=u.length!==c.length?`Showing ${u.length} of ${c.length} posts`:`Showing ${c.length} posts`,n.innerHTML=u.map(E).join("")}catch(d){r.textContent=d instanceof Error?d.message:"Failed to load feed"}}l(),s.addEventListener("input",()=>{const d=P(c,s.value);i.textContent=d.length!==c.length?`Showing ${d.length} of ${c.length} posts`:`Showing ${c.length} posts`,n.innerHTML=d.map(E).join("")}),e.addEventListener("submit",async d=>{d.preventDefault(),o.textContent="",a.textContent="";const u=new FormData(e),m=String(u.get("title")??"").trim(),g=String(u.get("body")??"").trim(),p=String(u.get("mediaUrl")??"").trim(),h=String(u.get("mediaAlt")??"").trim();if(!m&&!g&&!p){o.textContent="Please add a title, body, or media URL.";return}const y={};m&&(y.title=m),g&&(y.body=g),p&&(y.media={url:p},h&&(y.media.alt=h));try{await z(y),a.textContent="Post created!",e.reset(),await l()}catch(b){o.textContent=b instanceof Error?b.message:"Create post failed"}})}function O(t){return f(`/social/profiles/${t}`,{method:"GET"})}function H(t){return f(`/social/profiles/${t}/posts`,{method:"GET"})}function Z(t){return f(`/social/profiles/${t}/follow`,{method:"PUT"})}function tt(t){return f(`/social/profiles/${t}/unfollow`,{method:"PUT"})}function et(t){const e=t.title?.trim()?t.title:"(No title)",o=t.body?.trim()?t.body:"";return`
    <article class="card">
      <h3>${e}</h3>
      ${o?`<p>${o}</p>`:""}
      <p><a href="#/post/${t.id}">Open post</a></p>
    </article>
  `}async function ot(t){const e=N();t.innerHTML=`
    <div class="container">
      <h1>My profile</h1>

      <p id="profile-status" class="muted">Loading profile...</p>
      <section id="profile-card" class="card"></section>

      <h2>My posts</h2>
      <p id="posts-status" class="muted"></p>
      <div id="posts-list"></div>

      <nav class="nav">
        <a href="#/feed">Back to feed</a>
      </nav>
    </div>
  `;const o=t.querySelector("#profile-status"),a=t.querySelector("#profile-card"),r=t.querySelector("#posts-status"),n=t.querySelector("#posts-list");if(!(!o||!a||!r||!n)){if(!e){o.textContent="Missing profile name. Please log in again.";return}try{const i=(await O(e)).data,c=i.avatar?.url,l=i.avatar?.alt??"Avatar",d=i.bio??"";o.textContent="",a.innerHTML=`
      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        ${c?`<img class="avatar" src="${c}" alt="${l}" />`:""}
        <div>
          <h2 style="margin:0;">${i.name}</h2>
          ${d?`<p class="muted">${d}</p>`:'<p class="muted"><em>No bio</em></p>'}
        </div>
      </div>
    `}catch(s){o.textContent=s instanceof Error?s.message:"Failed to load profile";return}try{r.textContent="Loading posts...";const s=await H(e);r.textContent="",n.innerHTML=s.data.length?s.data.map(et).join(""):"<p>No posts yet.</p>"}catch(s){r.textContent=s instanceof Error?s.message:"Failed to load posts"}}}function rt(t){const e=t.title?.trim()?t.title:"(No title)",o=t.body?.trim()?t.body:"",a=t.author?.name??"Unknown",r=t.media?.url,n=t.media?.alt??"Post image";return`
    <article class="card">
      <h1>${e}</h1>
      <p class="muted">By ${a}</p>
      ${r?`<img class="post-img" src="${r}" alt="${n}" />`:""}
      ${o?`<p>${o}</p>`:"<p><em>No content</em></p>"}
    </article>
  `}async function k(t,e){t.innerHTML=`
    <div class="container">
      <p id="status" class="muted">Loading...</p>
      <div id="content"></div>
      <div id="actions"></div>
      <nav class="nav"><a href="#/feed">Back to feed</a></nav>
    </div>
  `;const o=t.querySelector("#status"),a=t.querySelector("#content"),r=t.querySelector("#actions");if(!(!o||!a||!r))try{const s=(await J(e)).data;o.textContent="",a.innerHTML=rt(s);const i=N();if(!(i&&s.author?.name===i))return;r.innerHTML=`
      <section class="card">
        <h2>Edit post</h2>

        <form id="edit-form" class="form">
          <label>Title
            <input name="title" type="text" value="${s.title??""}" />
          </label>

          <label>Body
            <textarea name="body" rows="4">${s.body??""}</textarea>
          </label>

          <label>Media URL (optional)
            <input name="mediaUrl" type="url" value="${s.media?.url??""}" />
          </label>

          <label>Media alt text (optional)
            <input name="mediaAlt" type="text" value="${s.media?.alt??""}" />
          </label>

          <button class="btn" type="submit">Save</button>
          <button class="btn" id="delete-btn" type="button">Delete</button>
        </form>

        <p id="edit-error" class="error"></p>
        <p id="edit-success" class="success"></p>
      </section>
    `;const l=t.querySelector("#edit-form"),d=t.querySelector("#delete-btn"),u=t.querySelector("#edit-error"),m=t.querySelector("#edit-success");if(!l||!d||!u||!m)return;l.addEventListener("submit",async g=>{g.preventDefault(),u.textContent="",m.textContent="";const p=new FormData(l),h=String(p.get("title")??"").trim(),y=String(p.get("body")??"").trim(),b=String(p.get("mediaUrl")??"").trim(),$=String(p.get("mediaAlt")??"").trim(),v={};h&&(v.title=h),y&&(v.body=y),b&&(v.media={url:b},$&&(v.media.alt=$));try{await V(e,v),m.textContent="Saved!",await k(t,e)}catch(L){u.textContent=L instanceof Error?L.message:"Update failed"}}),d.addEventListener("click",async()=>{if(u.textContent="",m.textContent="",!!confirm("Delete this post?"))try{await X(e),location.hash="#/feed"}catch(p){u.textContent=p instanceof Error?p.message:"Delete failed"}})}catch(n){o.textContent=n instanceof Error?n.message:"Failed to load post"}}function st(t){const e=t.title?.trim()?t.title:"(No title)",o=t.body?.trim()?t.body:"";return`
    <article class="card">
      <h3>${e}</h3>
      ${o?`<p>${o}</p>`:""}
      <p><a href="#/post/${t.id}">Open post</a></p>
    </article>
  `}async function nt(t,e){t.innerHTML=`
    <div class="container">
      <h1>User</h1>

      <p class="muted">Viewing: <strong>${e}</strong></p>

      <section class="card">
        <p id="user-status" class="muted">Loading profile...</p>
        <div id="user-content"></div>

        <div style="margin-top:12px;">
          <button class="btn" id="follow-btn" type="button">Follow</button>
          <button class="btn" id="unfollow-btn" type="button">Unfollow</button>
          <p id="follow-msg" class="muted"></p>
        </div>
      </section>

      <h2>Posts</h2>
      <p id="posts-status" class="muted"></p>
      <div id="posts-list"></div>

      <nav class="nav">
        <a href="#/feed">Back to feed</a>
      </nav>
    </div>
  `;const o=t.querySelector("#user-status"),a=t.querySelector("#user-content"),r=t.querySelector("#follow-btn"),n=t.querySelector("#unfollow-btn"),s=t.querySelector("#follow-msg"),i=t.querySelector("#posts-status"),c=t.querySelector("#posts-list");if(!(!o||!a||!r||!n||!s||!i||!c)){try{const d=(await O(e)).data,u=d.avatar?.url,m=d.avatar?.alt??"Avatar",g=d.bio??"";o.textContent="",a.innerHTML=`
      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        ${u?`<img class="avatar" src="${u}" alt="${m}" />`:""}
        <div>
          <h2 style="margin:0;">${d.name}</h2>
          ${g?`<p class="muted">${g}</p>`:'<p class="muted"><em>No bio</em></p>'}
        </div>
      </div>
    `}catch(l){o.textContent=l instanceof Error?l.message:"Failed to load user";return}r.addEventListener("click",async()=>{s.textContent="";try{await Z(e),s.textContent="Followed!"}catch(l){s.textContent=l instanceof Error?l.message:"Follow failed"}}),n.addEventListener("click",async()=>{s.textContent="";try{await tt(e),s.textContent="Unfollowed!"}catch(l){s.textContent=l instanceof Error?l.message:"Unfollow failed"}});try{i.textContent="Loading posts...";const l=await H(e);i.textContent="",c.innerHTML=l.data.length?l.data.map(st).join(""):"<p>No posts found.</p>"}catch(l){i.textContent=l instanceof Error?l.message:"Failed to load posts"}}}function at(){return location.hash||"#/login"}function it(t){return t==="#/feed"||t==="#/profile"||t.startsWith("#/post/")||t.startsWith("#/user/")}function R(t){const e=at(),o=A();if(it(e)&&!o){location.hash="#/login",C(t);return}if(e==="#/login")return C(t);if(e==="#/register")return W(t);if(e==="#/feed")return Q(t);if(e==="#/profile"){ot(t);return}if(e.startsWith("#/post/")){const a=e.replace("#/post/","");k(t,a);return}if(e.startsWith("#/user/")){const a=e.replace("#/user/","");nt(t,a);return}t.innerHTML=`
    <div class="container">
      <h1>404</h1>
      <p><a href="#/login">Login</a> | <a href="#/feed">Feed</a></p>
    </div>
  `}const x=document.querySelector("#app");if(!x)throw new Error("Could not find #app in index.html");location.hash||(location.hash="#/login");R(x);window.addEventListener("hashchange",()=>R(x));

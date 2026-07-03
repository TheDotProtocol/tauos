/** Inline before paint — default dark (Replit design) */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('tau-theme');var t=s||'dark';var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(t);r.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`;

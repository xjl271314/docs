const CONFIG = require("../../../../config.js");

export default function initComment() {
  const body = document.querySelector(".gitalk-container");
  const script = document.createElement("script");

  script.src = "https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js";
  body.appendChild(script);
  script.onload = () => {
    const commentConfig = Object.assign(CONFIG.gitalk, {
      //  id: `/my-blogs${location.pathname}`
    });
    console.log('commentConfig', commentConfig)
    const gitalk = new Gitalk(commentConfig);
    gitalk.render("gitalk-container");
  };
}

# VsCode 常用配置项

- 2021.05.14

```json
{
  "editor.renderIndentGuides": false,
  "carbon.backgroundColor": "rgba(0,0,0,0)",
  "carbon.theme": "oceanic-next",
  "window.menuBarVisibility": "visible",
  "path-intellisense.mappings": {
    "themes": "${workspaceRoot}/src/themes",
    "components": "${workspaceRoot}/src/components",
    "utils": "${workspaceRoot}/src/utils",
    "config": "${workspaceRoot}/src/config",
    "storage": "${workspaceRoot}/src/storage",
    "style": "${workspaceRoot}/src/style",
    "enums": "${workspaceRoot}/src/enums",
    "services": "${workspaceRoot}/src/services",
    "models": "${workspaceRoot}/src/models",
    "extends": "${workspaceRoot}/src/extends",
    "assets": "${workspaceRoot}/src/assets"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // VScode主题配置
  "editor.tabSize": 2,
  "editor.lineHeight": 24,
  "editor.renderLineHighlight": "none",
  "editor.renderWhitespace": "none",
  // "editor.fontFamily": "Consolas",
  "editor.fontSize": 16,
  "editor.cursorBlinking": "smooth",
  "editor.formatOnSave": false,
  "editor.snippetSuggestions": "top",
  "editor.wordWrapColumn": 200,
  "editor.quickSuggestions": {
    "other": true,
    "comments": true,
    "strings": false
  },
  "editor.tokenColorCustomizations": {
    "comments": "#4d535a", // 注释
    "keywords": "#0a0", // 关键字
    "variables": "#f00", // 变量名
    "strings": "#e2d75dbd", // 字符串
    "functions": "#5b99fcc9", // 函数名
    "numbers": "#AE81FF" // 数字
  },
  // 自动换行
  "editor.wordWrap": "on",
  "javascript.suggestionActions.enabled": false,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "javascript.implicitProjectConfig.experimentalDecorators": true,
  // 安装了tslint插件后，是否启用该插件
  "typescript.validate.enable": false,
  "workbench.iconTheme": null,
  "workbench.startupEditor": "newUntitledFile",
  "workbench.colorTheme": "Monokai Dimmed",
  "workbench.colorCustomizations": {
    // 设置guide线高亮颜色
    "editorIndentGuide.activeBackground": "#ff0000"
  },
  // 启用/禁用导航路径
  "breadcrumbs.enabled": true,
  "minapp-vscode.disableAutoConfig": true,
  "open-in-browser.default": "chrome",
  // VScode 文件搜索区域配置
  "search.exclude": {
    "**/dist": true,
    "**/build": true,
    "**/elehukouben": true,
    "**/.git": true,
    "**/.gitignore": true,
    "**/.svn": true,
    "**/.DS_Store": true,
    "**/.idea": true,
    "**/.vscode": false,
    "**/yarn.lock": true,
    "**/tmp": true
  },
  // 配置文件关联
  "files.associations": {
    // "*.vue": "html",
    "*.wxss": "css",
    "*.cjson": "jsonc",
    "*.wxs": "javascript"
  },
  // 配置emmet是否启用tab展开缩写
  "emmet.triggerExpansionOnTab": true,
  // 配置emmet对文件类型的支持
  "emmet.syntaxProfiles": {
    "vue-html": "html",
    "vue": "html",
    "javascript": "javascriptreact",
    "xml": {
      "attr_quotes": "single"
    }
  },
  // 在react的jsx中添加对emmet的支持
  "emmet.includeLanguages": {
    "jsx-sublime-babel-tags": "javascriptreact",
    "wxml": "html"
  },
  "emmet.showSuggestionsAsSnippets": true,
  "vetur.format.defaultFormatter.js": "vscode-typescript"
}
```

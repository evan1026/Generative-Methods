/*
 * Configuration variables
 */
let commonThemeFile = 'style'
let themes = {'style-dark': 'Dark', 'style-light': 'Light'};

/*
 * Functions related to changing the theme
 */
function setTheme(newThemeId) {
  // Code for switching themes based on https://stackoverflow.com/questions/19844545/replacing-css-file-on-the-fly-and-apply-the-new-style-to-the-page
  for (let themeId in themes) {
    document.getElementById(themeId).disabled = true;
  }
  document.getElementById(newThemeId).disabled = false;
  console.log(`Set current theme to ${themes[newThemeId]}.`);
}

function addThemeToDom(themeId) {
  let linkTag = document.createElement('link');
  linkTag.rel = 'stylesheet';
  linkTag.href = `/${themeId}.css`;

  // If this is a non-default stylesheet (i.e. an actual theme) add an id so we can work with it
  if (Object.hasOwn(themes, themeId)) {
    linkTag.id = themeId;
  }

  document.getElementsByTagName('head')[0].appendChild(linkTag);
  console.log(`Added theme ${themeId} to DOM.`);
}

function getDefaultTheme() {
  // Code to detect dark mode preference from https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'style-dark';
  } else {
    return 'style-light';
  }
}

/*
 * Initial page setup
 */
document.addEventListener("DOMContentLoaded", function(){
  addThemeToDom(commonThemeFile);

  for (let theme in themes) {
    addThemeToDom(theme);
  }

  setTheme(getDefaultTheme());
});

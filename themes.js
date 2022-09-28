/*
 * Configuration variables
 */
let defaultThemeId = 'default';
let themes = {'dark-theme': 'Dark', 'light-theme': 'Light', 'default': 'Use browser default'};
let currentTheme;

/*
 * Functions related to changing the theme
 */
function setTheme(newThemeId) {
  // Code for switching themes based on https://blog.logrocket.com/how-to-create-better-themes-with-css-variables-5a3744105c74/

  let body = document.getElementsByTagName('body')[0];

  if (currentTheme !== undefined) {
    body.classList.toggle(currentTheme);
  }

  if (newThemeId === defaultThemeId) {
    newThemeId = getDefaultTheme();
  }

  currentTheme = newThemeId;
  body.classList.toggle(newThemeId);
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
    return 'dark-theme';
  } else {
    return 'light-theme';
  }
}

/*
 * Initial page setup
 */
document.addEventListener("DOMContentLoaded", function(){
  setTheme(getDefaultTheme());
});

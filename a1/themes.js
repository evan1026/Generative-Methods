/*
 * Configuration variables
 */
let defaultThemeId = 'default';
let themes = {'default': 'Use browser default', 'dark-theme': 'Dark', 'light-theme': 'Light'};
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

  console.log(`Switched theme to ${newThemeId}`);
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
document.addEventListener('DOMContentLoaded', function(){
  let selector = document.getElementById('theme-selector');

  for (let themeId in themes) {
    let option = document.createElement('option');
    option.value = themeId;
    option.innerHTML = themes[themeId];
    selector.appendChild(option);
    console.log(`Added ${themeId} to dropdown`);
  }

  selector.addEventListener('input', e => setTheme(e.target.value));

  selector.value = 'default';
  setTheme('default');
});

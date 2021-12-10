module.exports = {
  '*.md': 'markdownlint --fix',
  '*.{css,less,scss,sass,vue}': 'stylelint --fix',
  '*.{js,jsx,ts,tsx,vue}': 'eslint --fix',
};

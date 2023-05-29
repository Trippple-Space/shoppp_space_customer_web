const fs = require('fs');
const chokidar = require('chokidar');

const SCSS_FILE = 'src/styles/partials/_generic.scss';
const OUTPUT_FILE = 'src/styles/partials/_generic.map.scss';

function generateMap() {
  const scssContent = fs.readFileSync(SCSS_FILE, 'utf8');
//   const pattern = /(\.[\w-]+(?:,\s*\.[\w-]+)*)\s*{/gm;
//   const pattern = /(\.[\w-]+(?:,\s*\.[\w-]+)*)\s*{([^}]+)}/gm;
  const pattern = /(\.[\w-]+(?:,\s*\.[\w-]+)*)\s*{((?:[^{}]*{[^{}]*})*[^{}]*)}/gm;

  const classNames = scssContent.match(pattern);

  if (classNames) {
    const mapContent = classNames
      .map((classString) => {
        console.log({classString})
        const [classSelector] = classString.split('{', 1);
        const classContent = classString.replace(classSelector, '');
        console.log({classSelector, classContent});
        const classList = classSelector.replace('{', '').trim().split(/,\s+/);
        const mappedClassSelectors = classList.map((className) => `[class~='sm:${className.replace('.', '').trim()}']`).join(',\n');
        return `${mappedClassSelectors} ${classContent}`;
      })
      .join('\n\n');
    fs.writeFileSync(OUTPUT_FILE, mapContent);
    console.log(`Generated ${OUTPUT_FILE}`);
  }
}

generateMap();

chokidar.watch(SCSS_FILE).on('change', generateMap);

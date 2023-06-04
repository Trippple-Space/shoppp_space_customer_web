const fs = require('fs');
const ts = require('typescript');
const path = require('path');
const config = require('./src/styles/generic/scripts/config-reader');
const classPatterns = require('./src/styles/generic/classes.patterns');
// const cheerio = require('cheerio');
function analyzeFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileExtension = filePath.split('.').pop();
  
    if (fileExtension === 'jsx' || fileExtension === 'tsx') {
      // JSX/TSX file analysis
      const classNames = new Set();
  
      const classAttributeRegex = /className=['"`]((?:[^'"`\r\n\\]|\\.|[\s\r\n])*)['"`]/g;
      let match;
  
      while ((match = classAttributeRegex.exec(fileContent)) !== null) {
        // console.log({match: match[1]});
        const classNamesText = match[1];
        const classNamesArray = classNamesText.split(/\s+/); // Split by whitespace
        classNamesArray.forEach(className => classNames.add(className));
      }
  
      return [...classNames];
    }

//   else if (fileExtension === 'html') {
//     // HTML file analysis
//     const $ = cheerio.load(fileContent);
//     const classNames = new Set();

//     $('[class]').each((_, element) => {
//       const classes = $(element).attr('class').split(' ');
//       classes.forEach(className => classNames.add(className));
//     });

//     return [...classNames];
//   }

  return [];
}

// const filePath = 'src/modules/views/login/Login.tsx';
// const classNames = analyzeFile(filePath);
// console.log(classNames);

let processedFiles = {};

function traverseDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
  
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
  
      if (stats.isDirectory()) {
        traverseDirectory(filePath);
      } else if (stats.isFile()) {
        const fileExtension = path.extname(file);
  
        if (fileExtension === '.jsx' || fileExtension === '.tsx') {
          const classNames = analyzeFile(filePath);
          console.log(`File: ${filePath}`);
          console.log(`Class Names: ${classNames.join(', ')}`);
          console.log('-----------------------------------');
  
          // Update the processedFiles object with the latest timestamp
          processedFiles[filePath] = stats.mtimeMs;
        }
      }
    }
  }
  
  function watchDirectory(dirPath) {
    fs.watch(dirPath, { recursive: true }, (event, filename) => {
      console.log('Watching...', event);
      const filePath = path.join(dirPath, filename);
      const stats = fs.statSync(filePath);
  
      if (stats.isFile()) {
        const fileExtension = path.extname(filename);
  
        if (fileExtension === '.jsx' || fileExtension === '.tsx') {
          const lastProcessedTime = processedFiles[filePath] || 0;
  
          // Check if the file has been modified since the last compilation
          if (stats.mtimeMs > lastProcessedTime) {
            const classNames = analyzeFile(filePath);
            compileClasses(classNames)
            console.log(`File: ${filePath}`);
            console.log(`Class Names: ${classNames.join(', ')}`);
            console.log('-----------------------------------');
  
            // Update the processedFiles object with the latest timestamp
            processedFiles[filePath] = stats.mtimeMs;
          }
        }
      }
    });
  }

  const previouslyComputed = {};
  const outputCSSFile = 'index.css';

  function compileClasses(classNames) {
    const compiledClasses = {};
  
    classNames.forEach(className => {
      const classDefinition = getClassFromCache(className);
      if (classDefinition) {
        compiledClasses[className] = classDefinition;
      }
    });
  
    // Generate the CSS content
    let cssContent = '';
    for (const className in compiledClasses) {
      cssContent += `${compiledClasses[className]} \n`;
    }
  
    // Write the CSS content to the output file
    fs.writeFileSync(outputCSSFile, cssContent);
  
    return compiledClasses;
  }
  
  function getClassFromCache(className) {
    const firstLetter = className.charAt(0).toLowerCase();
    const cacheFileName = `${config.location}/classes.cache/${firstLetter}.cache.json`;
    const cacheFilePath = path.join(__dirname, cacheFileName);
  
    if (fs.existsSync(cacheFilePath)) {
      const cacheFileContent = fs.readFileSync(cacheFilePath, 'utf8');
      const cacheData = JSON.parse(cacheFileContent);
      return cacheData[className] || generateClassDefinitionFromPattern(className);
    }
  
    return generateClassDefinitionFromPattern(className);;
  }  

  function generateClassDefinitionFromPattern (className) {
    console.log('Generating...', {className});
    if (previouslyComputed[className]) {
      return previouslyComputed[className];
    }

    const firstLetter = className.charAt(0).toLowerCase();
    const patternsFileName = `${config.location}/classes.patterns/${firstLetter}.patterns.json`;
    const patternsFilePath = path.join(__dirname, patternsFileName);
    console.log('Got here');
    // if (fs.existsSync(patternsFilePath)) {
      // const patternsFileContent = fs.readFileSync(patternsFilePath, 'utf8');
      // const patternsData = JSON.parse(patternsFileContent);

      patternsData = classPatterns;

      for ( const pattern in patternsData ) {
        console.log({pattern});
        const _pattern = new RegExp(pattern)
        if (_pattern.test(className)) {
          const classDefinition = patternsData[pattern];
          const replacedDefinition = classDefinition.replace(
            /\$1/g,
            (match) => className.match(_pattern)[1]
          );
          console.log({replacedDefinition});
          previouslyComputed[className] = replacedDefinition;
          return replacedDefinition;
        }
      }
    // }

    return null

  }
  
  const projectDirectory = './'; // Provide the path to your project directory
  traverseDirectory(projectDirectory);
  watchDirectory(projectDirectory);


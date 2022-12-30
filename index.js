const inquirer = require('inquirer');
const { exec } = require("child_process");
const { join } = require('path');
const { existsSync } = require("fs");

// Register custom prompt type
inquirer.registerPrompt('search-list', require("inquirer-search-list"));

// Register of applications available
const reg = require('./register.json');
const driver = process.cwd().slice(0, 2); //"S:" by default
const softwaresFolder = join(driver, "Portables Softwares");

// Home screen
console.log(`
 ██╗   ██╗███████╗██████╗       ██╗     
 ██║   ██║██╔════╝██╔══██╗      ██║     
 ██║   ██║███████╗██████╔╝█████╗██║     
 ██║   ██║╚════██║██╔══██╗╚════╝██║     
 ╚██████╔╝███████║██████╔╝      ███████╗
  ╚═════╝ ╚══════╝╚═════╝       ╚══════╝
 
   USB Launcher by Valentin KIEP
   → ${reg.map((e) => existsSync(join(softwaresFolder, e.path))).filter((res) => res === true).length}/${reg.length} logiciels détectés
`);

// Ask software to run
inquirer.prompt([
   {
      type: "search-list",
      name: "software",
      message: "Quel logiciel souhaitez-vous lancer ?",
      choices: reg.sort(
         // Alphabetical sort
         function (a, b) {
            if (a.name < b.name) {
               return -1;
            }
            if (a.name > b.name) {
               return 1;
            }
            return 0;
         }).map(e => e.name)
   }
]).then((answ) => {
   console.log(`Lancement de ${answ.software} en cours...`);
   const lPath = join(softwaresFolder, reg.find((e) => e.name === answ.software).path);

   // Run program
   exec(`"${lPath}"`, console.error);
});
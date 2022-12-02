
const { v4: uuidv4 } = require('uuid');

const fs = require('fs')
const path = require('path')
const images = require('images') //https://github.com/zhangyuanwei/node-images
const FileLib = require('./files')
const fileLib = new FileLib()


var Jimp = require('jimp');
var palette = require('nice-color-palettes/1000');
var hexToRgb = require('hex-to-rgb');

class Customizer {
  constructor(options) {
  }


  async merge(imagesPath, outputPath , finalImgName) {
    try {
      if (!imagesPath || typeof imagesPath != 'string') {
        throw new Error("Input path must be a string")
      }

      // select palette color
      const randomNum = Math.floor(Math.random() * 1000)
      let selectedPalette = palette[randomNum]
      if(!selectedPalette){
        selectedPalette = palette[Math.floor(Math.random() * 900)]
      }
      console.log('selectedPalette', selectedPalette , randomNum)

      // shufle selected colors
      const shuffledColors = this.shuffle(selectedPalette)

      let img 
      const resolvedImgsPath = path.resolve(imagesPath) //`${assetsPath}/${folderName}`
      const resolvedOutputPath = path.resolve(outputPath)




      if (!fs.existsSync(resolvedImgsPath)) {
        throw new Error("Images path not found!")
      }

      const dirFiles = await fileLib.readDir(resolvedImgsPath) // get each files into the folder name
      if (!dirFiles || !dirFiles.length) {
        throw new Error("files folder is empty")
      }

      const {
        refactoredStorePath,
        mergedStorePath,
        jsonStorePath
      } = await this.handleDirs(resolvedOutputPath)




      const id = finalImgName != undefined ? finalImgName : uuidv4();
      const storePath = `${refactoredStorePath}/${id}`

      console.log('storePath', storePath)

      await fileLib.createDir(storePath)

      const obj = {
        part1: {},
        part2: {},
        part3: {},
        part4: {},
        colorsString : ''
      }
    //  img = images(812, 1148).fill(0,0,0,0)
      // map each files into the  folder name
      for (let i = 0; i < dirFiles.length; i++) {
        const hexColor = shuffledColors[i]
        console.log("HexColors " , hexColor , shuffledColors.length , dirFiles.length)
        const rgb = hexToRgb(hexColor)
        console.log("RGB ", rgb)
        const fileName = dirFiles[i]

        console.log('fileName', fileName)
        const filePath = `${resolvedImgsPath}/${fileName}`
        console.log('filePath', filePath)

        const jimpImg = await Jimp.read(filePath) // read image 
          await jimpImg.brightness(-1)
        // apply colors to images
          await jimpImg.color([
          { apply: 'red', params: [rgb[0]] },
          { apply: 'green', params: [rgb[1]] },
          { apply: 'blue', params: [rgb[2]] },
        ])   
       // jimpImg.color([{apply:'desaturate', params: [0]}])

/* 
          await jimpImg.color([
          { apply: 'red', params: [255] },
          { apply: 'green', params: [255] },
          { apply: 'blue', params: [255] },
        ])  
  */

        console.log("red " , rgb[0])
        console.log("green " , rgb[1])
        console.log("blue " , rgb[2])


        // save image
        await jimpImg.writeAsync(`${storePath}/${fileName}`)

        if (i == 0) {
          img = images(`${resolvedImgsPath}/${fileName}`)
          //continue

        } else {
          console.log(`drawing ${`${storePath}/${fileName}`}`)
          img.draw(images(`${storePath}/${fileName}`))

          const partObj = {
            hex: hexColor,
            rgb: {
              red: rgb[0],
              green: rgb[1],
              blue: rgb[2]
            }
          }
  
          // add colors to the json 
          obj[`part${i}`] = partObj
          obj.colorsString = obj.colorsString + `${rgb[0]}-${rgb[1]}-${rgb[2]}`
          if(i < dirFiles.length - 1){
            obj.colorsString =  obj.colorsString + "-"
          }
  
        }


      //if (i == 1) {
      //  console.log(`drawing ${`${storePath}/${fileName}`}`)
      //  img.draw(images(`${storePath}/${fileName}`))
      //}

      }
      // save the new image in a different  auto generated-folder
      const savePath = `${mergedStorePath}/${id}.png`

      console.log("saving img at " +savePath)

      img.save(savePath)
      console.log(obj)
      //
      await fileLib.writeJSON(obj,`${jsonStorePath}/${id}.json`)

    } catch (error) {
      console.log("Error in customizer.js ", error.message)
      throw error
    }
  }

  shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  };

  async handleDirs(outputPath) {
    try {
      const refactoredStorePath = `${outputPath}/refactored`
      const mergedStorePath = `${outputPath}/merged`
      const jsonStorePath = `${outputPath}/json`


      if (!fs.existsSync(outputPath)) {
        await fileLib.createDir(outputPath)
      }

      if (!fs.existsSync(refactoredStorePath)) {
        await fileLib.createDir(refactoredStorePath)
      }

      if (!fs.existsSync(mergedStorePath)) {
        await fileLib.createDir(mergedStorePath)
      }

      if (!fs.existsSync(jsonStorePath)) {
        await fileLib.createDir(jsonStorePath)
      }
      return {
        refactoredStorePath,
        mergedStorePath,
        jsonStorePath
      }
    } catch (error) {
      throw error
    }
  }

   sleep (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, ms);
    })
  }
}

module.exports = Customizer
const Customizer = require('./src/customizer')
const customizer = new Customizer();

const start = async ()=>{
    const imagesPath = process.env.IMG_DIR
    const outputPath = process.env.OUT_DIR
    const quantity =  process.env.QTY
    console.log("imagespath ", imagesPath)
    console.log("outputPath ", outputPath)
    console.log("quantity ", quantity)

    for (let i = 0 ; i < quantity  ; i ++){
        await customizer.merge(imagesPath , outputPath , i)
    }
}

start()
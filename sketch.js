var img;
var imgWidth;
var imgHeight;
var path = "./images/Mountain.jpg";

var p5Obj = new p5(p5=>{
  p5.originalImg = undefined;
  p5.finalImg = undefined;
  //p5.redraw = undefined;
  p5.setup = function () {
    p5.createCanvas(400, 400).imageSmoothingEnabled = false;
    
    p5.background(255);
    p5.text("load an image to start", 12, 12, 372, 40)
    p5.originalImg = p5Obj.loadImage(path, image=>{
      loadNewImg(image.get())
    });
  }
});

function showOriginal() {
  p5Obj.image(p5Obj.originalImg, 0, 0);
}
function showFinal() {
  p5Obj.image(p5Obj.finalImg,0,0)
}
function handleFile(file) {
  if (file.type === 'image') {
    p5Obj.loadImage(file.data, loaded=>{
      loadNewImg(loaded) 
    })
  }
}
function loadNewImg(loadedImage) {
  p5Obj.originalImg = loadedImage.get()
  img = p5Obj.originalImg.get()
  imgWidth = img.width;
  imgHeight = img.height;
  p5Obj.resizeCanvas(imgWidth, imgHeight);
};

function startAlgo(algo) {
  img = p5Obj.originalImg.get()
  img.loadPixels()
  algo.forEach((layer,index)=>{
    switch(layer.name){
      case "bayer":{
        bayerDither(layer.n,layer.spread);
        break;
      }
      case "channels":{
        channelsFilter(layer.r,layer.g,layer.b,layer.gs);

        break;
      }
      case "gamma":{
        gammaCorrect(layer.value)
        break;
      }
      default:{
        break;
      }
    }
    
  })
  img.updatePixels()
  p5Obj.finalImg = img.get()
  showFinal();
}

function getPixel(index) {
  return img.pixels[index]
}
function gammaCorrect(gamma){
  for (let y = 0; y < imgHeight; y++) {
    for (let x = 0; x < imgWidth; x++) {
      const index = (x + y * imgWidth) * 4;
  img.pixels[index + 0] = ((img.pixels[index + 0]/255) ** gamma)*255
  img.pixels[index + 1] = ((img.pixels[index + 1]/255) ** gamma)*255
  img.pixels[index + 2] = ((img.pixels[index + 2]/255) ** gamma)*255
    }
  }
}
function channelsFilter(r, g, b, gs) {
  for (let y = 0; y < imgHeight; y++) {
    for (let x = 0; x < imgWidth; x++) {
      const index = (x + y * imgWidth) * 4;

      let initR  = getPixel(index + 0);
      let initG  = getPixel(index + 1);
      let initB  = getPixel(index + 2);
      let initGs = getRedLuminance(initR) + getGreenLuminance(initG) + getBlueLuminance(initB)

      img.pixels[index + 0] = ((r) ? initR : ((gs) ? initGs : 0))
      img.pixels[index + 1] = ((g) ? initG : ((gs) ? initGs : 0))
      img.pixels[index + 2] = ((b) ? initB : ((gs) ? initGs : 0))
    }
  }
}

function bayerDither(dimensions, spread) {
  let n = 2 ** dimensions;
  let bayer = bayerMatrices[dimensions];
  let normBayerM = bayer.map(val => {
    return ((val) / (n ** 2)) -.05
  })

  for (let y = 0; y < imgHeight; y++) {
    for (let x = 0; x < imgWidth; x++) {
      const index = (x + y * imgWidth) * 4;

      //פחות כפל, חילוק
      let r, g, b
      r = getPixel(index + 0)/ 255.0
      g = getPixel(index + 1)/ 255.0
      b = getPixel(index + 2)/ 255.0

      const bayerY = y % n;
      const bayerX = x % n;
      const M = normBayerM[bayerX + bayerY * n];

      function calcColorc(c){
        c += spread * M;
        c = Math.floor(c*(n-1)+0.5)/(n-1);
        return c;
      };
      r=calcColorc(r)
      g=calcColorc(g)
      b=calcColorc(b)

      let pixelR = Math.floor(255 * r)
      let pixelG = Math.floor(255 * g)
      let pixelB = Math.floor(255 * b)

      img.pixels[index + 0] = pixelR;
      img.pixels[index + 1] = pixelG;
      img.pixels[index + 2] = pixelB;
    }
  }
}

function srgbToLinear(s) {
  let l = (s <= 0.0404482362771082) ? (s / 12.92) : (((s + 0.055) / 1.055) ** gamma)
  return Math.max(0, Math.min(l, 1));
}
function linearToSRGB(l) {
  let s = (l <= 0.00313066844250063) ? (l * 12.92) : 1.055 * (l ** (1 / gamma)) - 0.055
  return Math.max(0, Math.min(s, 1));
}
function getRedLuminance(r) {
  return 0.2126 * r;
}
function getGreenLuminance(g) {
  return 0.7152 * g;
}
function getBlueLuminance(b) {
  return 0.0722 * b;
}
function getLuminance(r, g, b) {
  let luminance =
    getRedLuminance(r) +
    getGreenLuminance(g)
    + getBlueLuminance(b);
  return luminance;
}

const bayerMatrices = [
  // 1*1  2^0
  [0],

  // 2*2  2^1
  [0, 2,
    3, 1],

  // 4*4  2^2
  [0, 8, 2, 10,
    12, 4, 14, 6,
    3, 11, 1, 9,
    15, 7, 13, 5],

  // 8*8  2^3
  [0, 32, 8, 40, 2, 34, 10, 42,
    48, 16, 56, 24, 50, 18, 58, 26,
    12, 44, 4, 36, 14, 46, 6, 38,
    60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41,
    51, 19, 59, 27, 49, 17, 57, 25,
    15, 47, 7, 39, 13, 45, 5, 37,
    63, 31, 55, 23, 61, 29, 53, 21]
];
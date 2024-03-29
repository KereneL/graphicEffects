
# p5* Image Manipulation - jQuery UI  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

I was inspired by Acerola and decided to write a [dither](https://en.wikipedia.org/wiki/Dither) "shader" using p5js pixel manipulation capabilities. This is not a real time shader and technically not a shader at all. It does support loading an image and applying different effects to it in a manageable queue.
## Usage:

Using yarn

```
$ yarn install
$ yarn dev
```

## Features

- GUI Made using [jqueryUI](https://jqueryui.com/)
- Rendering by [p5](https://p5js.org/) of the [Processing Foundation](https://processingfoundation.org/).
- Supported Effects:
    - Bayer dither algorithm
    - Gamma Correction
    - Channel Mixer

### Planned Features:
- Better UI:
    - Using jQueryUI Widget Factory to create modular effect controls
- More effects:
    - Convert sRGB to Linear Space and VV
    - More dithering algorithms:
        - Error-diffusion dithering: Floyd–Steinberg, Jarvis, Stucki, Burkes, Two-row Sierra, Atkinson
        - Random dithering algorithms using blue noise
    - Brightness and Contrast effects
    - Blur and Gaussian Blur effects

## Connections and Inspirations

- [Acerola](https://www.youtube.com/@Acerola_t) - YouTube
- [Ordered Dithering](https://en.wikipedia.org/wiki/Ordered_dithering) - Wikipedia
- [This article](https://medium.com/@michaelwesthadley) from Visgraf
- [Ditherpunk — The article I wish I had about monochrome image dithering](https://surma.dev/things/ditherpunk/) - surma.dev
- [Dithered Shading Tutorial](https://drewcampbell92.medium.com/understanding-delta-time-b53bf4781a03) - Aeris on Medium.com
- [Image Quantization Halftoning, and Dithering](https://www.cs.princeton.edu/courses/archive/fall00/cs426/lectures/dither/dither.pdf) - Thomas Funkhouser of Princeton University

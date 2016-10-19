## Website Performance Optimization portfolio project

Your challenge, if you wish to accept it (and we sure hope you will), is to optimize this online portfolio for speed! In particular, optimize the critical rendering path and make this page render as quickly as possible by applying the techniques you've picked up in the [Critical Rendering Path course](https://www.udacity.com/course/ud884).

To get started, check out the repository and inspect the code.

### Getting started

####Part 1: Optimize PageSpeed Insights score for index.html

Some useful tips to help you get started:

1. Check out the repository
1. To inspect the site on your phone, you can run a local server

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080
1. Download and install [ngrok](https://ngrok.com/) to the top-level of your project directory to make your local server accessible remotely.

  ``` bash
  $> cd /path/to/your-project-folder
  $> ./ngrok http 8080
  ```

1. Copy the public URL ngrok gives you and try running it through PageSpeed Insights! Optional: [More on integrating ngrok, Grunt and PageSpeed.](http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/)

Profile, optimize, measure... and then lather, rinse, and repeat. Good luck!

####Part 2: Optimize Frames per Second in pizza.html

To optimize views/pizza.html, you will need to modify views/js/main.js until your frames per second rate is 60 fps or higher. You will find instructive comments in main.js. 

You might find the FPS Counter/HUD Display useful in Chrome developer tools described here: [Chrome Dev Tools tips-and-tricks](https://developer.chrome.com/devtools/docs/tips-and-tricks).

### Optimization Tips and Tricks
* [Optimizing Performance](https://developers.google.com/web/fundamentals/performance/ "web performance")
* [Analyzing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp.html "analyzing crp")
* [Optimizing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path.html "optimize the crp!")
* [Avoiding Rendering Blocking CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css.html "render blocking css")
* [Optimizing JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript.html "javascript")
* [Measuring with Navigation Timing](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp.html "nav timing api"). We didn't cover the Navigation Timing API in the first two lessons but it's an incredibly useful tool for automated page profiling. I highly recommend reading.
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/eliminate-downloads.html">The fewer the downloads, the better</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer.html">Reduce the size of text</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization.html">Optimize images</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching.html">HTTP caching</a>

### Customization with Bootstrap
The portfolio was built on Twitter's <a href="http://getbootstrap.com/">Bootstrap</a> framework. All custom styles are in `dist/css/portfolio.css` in the portfolio repo.

* <a href="http://getbootstrap.com/css/">Bootstrap's CSS Classes</a>
* <a href="http://getbootstrap.com/components/">Bootstrap's Components</a>

## Steps Taken

### Part 1

#### Initial Analysis

Running PageSpeed over `index.html` without any optimisation gives a PageSpeed score of 77 for mobile, and 30 for desktop.

The most immediate concerns are render-blocking JavaScript and CSS, and image optimisation. Less pressing, for now, are caching, compression, and minification.

On review of `index.html`, it is obvious that the render-blocking `analytics.js` is superfluous: it doesn't contribute to the rendering of the page, and its execution could be deferred until rendering is complete.

As well, there are unnecessary stylesheets that are block rendering (namely `print.css`); PageSpeed also suggests 'optimising delivery' of the CSS for fonts.

It is difficult to imagine how `style.css` could be optimised away, given that it is necessary for rendering the page. Given that it is ~50 lines lone, and contains styles for dozens of elements, I'm hesitant to inline it.

Lastly, the CSS for the Open Sans font takes approximately 300ms to download. Removing the link to Open Sans improves the desktop score to 91, so it is important to determine whether any optimisation can be achieved here (assuming that Open Sans cannot be jettisoned altogether).

#### First Iteration

The goals of this first step are to remove (or minimise the effects of) any render-blocking CSS and Javascript.

First, the Open Sans CSS was examined to determine whether it could be optimised. The CSS returned by the Google API includes definitions for character sets that are unused in the copy on the page; as such, the latin font family definitions were moved in to `style.css`. This improves the PageSpeed score to 90 on desktop, though it is still 27 for mobile.

Assuming that Open Sans absolutely _must_ be included (it doesn't look substantially different than the system sans serif to me...), then it is hard to imagine how its footprint or latency could be improved (without some kind of lazy loading).

Secondly, a media query was added to the link to `print.css` so that it is only loaded when the browser attempts to print a page. This seemingly had no effect on the PageSpeed score. This file is tiny (481 bytes) and probably arrives long before `style.css` (3 KB), so its render-blocking effect is overwhelmed by the influence of `style.css`.

Lastly, the render-blocking Javascript pertaining to analytics (which can be deferred until the page is loaded) is annotated with the `async` directive, which allows the browser to initiate rendering without executing the Javascript.

Given that `analytics.js` takes 630ms to download, and then another 23ms to execute, this has a considerable effect on rendering.

The PageSpeed scores are now 29 and 92 for mobile and desktop, respectively. A major issue on mobile are the image sizes.

#### Second Iteration

The PageSpeed analysis indicates that `pizzeria.jpg` is unnecessarily large. On reviewing its `img` tag, it is clear that `pizzeria.jpg` need not be more than 100px wide (200px for 2x displays). As such, this image has been compressed and `index.html` has been updated to include a `srcset` attribute that loads the appropriate image for a given device.

This has improved the PageSpeed score to 86 and 88 on mobile and desktop.

#### Third Iteration

Given that I have no control over compression or caching (i.e. I'm using the Python `SimpleHTTPServer`, which seemingly doesn't allow for those parameters to be specified), the last option for improving the PageSpeed score is to minify HTML, CSS, and JavaScript.

Using `Gulp`, all of the Javascript, HTML, and CSS was minified. The resulting scores for mobile and desktop were 86 and 93, respectively; it seems that the last viable options afforded to me are to optimise `profilepic.jpg`, and to further optimise the `style.css`.

#### Final Iteration

In this final attempt, the critical CSS was identified using a [critical path generator](https://jonassebastianohlsson.com/criticalpathcssgenerator/) and then inlining this CSS, and loading the non-critical CSS at the end of the HTML document.

As well, `profilepic.jpg` was compressed to supress image optimisation warnings on PageSpeed.

This final iteration gives mobile and desktop scores of 95 when `index.html` is served from my local machine.
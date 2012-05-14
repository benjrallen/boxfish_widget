- I've made this widget pretty simple, but with a structure that is very easy to work on and add bits to.

- CSS is compiled from the style.scss file in the SCSS folder.  It uses a pruned down version of Twitter's Bootstrap for the CSS Reset and a few helper classes.  This project didn't need the whole framework, so I cut a bunch of it out.

- Modernizr provides a super-small asynchronous script loader called yepNope that I like to use to load everything in.

- The plugins.js and common.js files have been concatenated together and compressed into theme.js with Closure compiler.

- There are two main objects in the javascript code ( the module is in plugins.js ): 'Boxfish' & 'Blurb'

- 'Boxfish' handles all the data fetching, and when something new comes back creates the 'Blurbs'

- 'Blurbs' contain the functions to format the returned data in the right way

- When a new blurb is added to the widget it notifies the widget, which then does a check for how many there are and updates the time for all of them.

- One thing I left out because this is a small dataset:  have the widget check to see if it has already gotten an identical news blurb before it instantiates a new one upon return. 

- I also left out the check for css3 transitions to have that handle the animation instead of the javascript in Chrome.

- I would also normally sprite all the images in the design together and compress them down, but there were so few images in this design that I let it be for now.
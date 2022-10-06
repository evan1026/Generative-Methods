# A2: Animated GIFs

## Your name
Evan Allan

## Your Glitch link
[my page](https://evan1026-a2.glitch.me)



## Describe each of the four GIFs
1) Bouncy Ball - Just a simple bouncing ball. I made this while I was first figuring out P5 and left it in because most of my ideas for cool animations were either too hard to loop or didn't loop quickly enough.
2) Landscape Exploration - Based on the Perlin Noise example - this animation color codes sections of the noise to simulate the appearance of a landscape.
3) Mathematical Windmill - A plot of (1 - arccos(sin(theta * t / 2)) * arcsin(cos(theta * t / 2))) from 0 to 2 * PI. The patterns formed by this formular go back and forth between unintelligible chaos and regular patterns. If you watch for long enough (roughly 40 minutes) the patterns eventually repeat themselves, meaning this is technically a looping animation, albeit far too long to make into a gif.
4) Rainbow Spiral - I was experimenting with using the previous frame in the creation of the new frame, and after a bunch of playing I got this. It creates a lot of cool patterns that don't seem to ever repeat exactly, kind of like a kaleidoscope. If you watch for long enough you will eventually see the spiral unravel itself and then wrap back around the other way.

## What P5 method or technique did you enjoy using the most? What was interesting to you about it?

I really liked messing with using the previous frame as part of the next frame - the main technique in the Rainbow Spiral animation.
It made for a lot more interesting images, especially when transformations were applied before redrawing the previous frame. There
are ways to emulate the effects using techniques covered in class but they always required either not
drawing a background (so anything you draw is there in that spot forever) or using raw CPU power to recalculate what the previous
frame would have had (i.e. having lots of objects that follow each other). With this technique, every frame is influenced by
every single frame before it, all the way back to the beginning.

## Did you find any P5 functionality that wasn't covered in class?

1) Reading the previous frame as mentioned above.
2) Using loadPixels() and updatePixels() to manipulate the frame buffer directly (this was necessary for my landscape to have as high of a resolution as it does while still running at a reasonable framerate).

I know there weren't covered because there are more complicated than what the class is meant to be covering, but
I have a lot of experience with low-level graphics (like CS351, for instance) so I felt very comfortable using
the more advanced techniques.

## How did you get your looping gif to loop smoothly? What was hard or easy about that techinque?

I used the percent method that was given to us in the first one, and in the third one I just used the fact that trig functions
that are sampled discretely at regular intervals will eventually repeat themselves given enough time. Both methods make it very
easy to keep things lined up without really having to think. Just set the variables to get things moving at the speed you want
and the looping will come out of it.


## Link a few GIFs you found inspirational here

My main inspirations actually came from the starter code that was given to us. It was from watching those animations that I came up with these ideas.
My exploration of what graphs to use started with [this reddit post](https://www.reddit.com/r/math/comments/1r3hls/polar_graphs/cdj9dam/) but that
was just a collection of images.

## List any resources (code, images, etc) you've used, and where you got them from

* https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
    * Used so I could still work in HSL in the landscape exploration even though the framebuffer is in RGB
* https://discourse.processing.org/t/pushing-a-7712x960-binary-image-to-p5-js-is-super-slow-is-there-a-better-way/371
    * Helped me narrow down why things were running so slow with the perlin noise and gave a solution (writing to the framebuffer yourself)

## List any help you got from classmates or websites, so that you can remember it for later

* Specific examples listed above
* I also used the p5.js reference docs a lot

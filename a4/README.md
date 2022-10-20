# A4: Swarms!

## Your name
Evan Allan

## Your Glitch link
[my page](https://evan1026-a4.glitch.me)


## Which systems behaved like you expected? Which ones surprised you? In which ones did your initial idea evolve into something different?
I think all of them except the gravity one turned into something I wasn't expecting. I didn't really go into most
of these with a clear idea in mind. I just played around with things until I got something that looked vaguely interesting.

## Describe your 1st system. What forces does it use? What is its emergent behavior?
This system is just a bunch of colorful ants crawling around. Each ant has an attractive force to the center
to keep them from getting too far away, and other than that the forces on each ant are entirely random with
each timestep. The emergent behavior is that they just crawl around a bit while wiggling, which I thought looked
kinda like ants crawling around, so I made the particles into ants.

## Describe your 2nd system. What forces does it use? What is its emergent behavior?
In the second system, the particles all start with an outward velocity from a center point, and if they get to close to a wall
they get a force that pushes them gently away from the wall. This ends up creating a wave that bounces around in very interesting
ways. Because of inaccuracies in the simulation system, it looks a lot better when the speed is kept low, although then it takes
a very long time to do anything interesting.


## Describe your 3rd system. What forces does it use? What is its emergent behavior?
The third system has some fish that swim around in a semi-flocking behavior. This actually functions almost the same as the leaf
example from the starter code (the code from that example was used heavily) except:
    * There is no gravitational force
    * The angle is almost entirely based on the swim direction
    * The angle is modified slightly using the position to give the illusion of a fish swimming
    * Fish are drawn instead of leaves
The apparent flocking was obviously not an intended effect of the original leaf example but I thought it looked like fish
swimming in schools to I made it be that.


## Describe your 4th system. What forces does it use? What is its emergent behavior?
This is a gravitational simulation. There is one particle in the center with a very high mass and a bunch of smaller
particles that orbit it. The gravity is calculated with linear fall-off instead of quadratic since the simulation is running
in 2 dimensions. I used Verlet Integration as the numerical solver so that the system would be stable instead of gradually
gaining energy over time.


## Which system has one particle uses "particle-to-all-particles" forces (Boids style) or reads a map (Braitenberg-style). Explain how.
Number 4 - Each particle attacts each other particle gravitationally.

## Which system has particles that leave a trail or creates new particles
Number 4 - I keep track of the last 100 previous positions for each particle and draw lines that
slowly fade in opacity. Clicking also adds new particles.

## Which system interacts with user behavior, and how?
Number 4 - Clicking will add new particles which then integrate with the system.

## List any resources (code, images, etc) you've used, and where you got them from
Just starter code and code from previous assignments

## List any help you got from classmates or websites, so that you can remember it for later
[Verlet Integration](https://en.wikipedia.org/wiki/Verlet_integration) - used as a refresher on how to implement this solver

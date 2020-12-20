# AiPPAREL Created @ HackUMass
Larry Tseng, Johno Pomerat, Martin Dickie, Kelsey Gregware
We are AiPPAREL, a startup that sells clothing and accessories designed with artificial intelligence. We use neural style transfer to allow users to create unique and beautiful shirts, hoodies, phone cases, and more. Users can then buy their creations through our shopping portal.

# What it does:
Our project is a full-stack webapp that allows users to perform neural style transfer on uploaded images. Once the style transfer has been performed, users have the option to buy clothing designed using the output of the style transfer.

# How we built it:
We implemented neural style transfer on Google Cloud, then built a node server to run style transfer commands on the Google Cloud machine. Next, we expanded the client to be able to upload images to the server and we wrote code to serve the client’s session with a hash for each call of the style transfer algorithm. We then further extended the server to pass the result through the printful API to generate product markups in real time. We then wrote javascript to take those markups and render them in a shopping page associated with the request’s hash to serve to the user. We also used bootstrap, two.js, and particles.js to create custom animations and spice up the front end design.

# What's Next
We will be turning this into a fully functioning business after the hackathon and customers will be able to purchase products once we go live. Our next steps are to:
1. Enable the processing of transactions and payments
2. Optimize the data pipelines and clean up the code base
3. Upgrade our servers to function at scale
4. Establish a legal entity and develop marketing campaigns

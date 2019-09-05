# Neural-Artist
This is the implementation of Neural Artist which aims to give people the power to create their own artworks and share the results and their feeling with the community in a totally free way.

## Style Transfer
I used fast style transfer in Python and Tensorflow to transform uploaded images. The image transformation is achieved by feed-forward Convolutional Neural Network based on [Johnson's Perceptual Losses for Real-Time Style Transfer and Super-Resolution](https://arxiv.org/abs/1603.08155). The implementation is modified from [lengstrom's work](https://github.com/lengstrom/fast-style-transfer) with optimization in deployment. The training dataset is from [Microsoft coco train2014](http://cocodataset.org/). 

## Web Design
The web application is implemented using Node.js, Express and MongoDB with MVC architecture and RESTful API. [Neural-Artist's](https://www.neuralartist.com) server is deployed with Nginx on AWS EC2, ELB and Route 53.

I developed responsive frontend for users to share images and write posts using React, Bootstrap, Ajax and jQuery, built realtime chat room with Socket.IO, and used Passport.js as authentication middleware

Some style images are from [unsplash](https://unsplash.com), while others are from modern artists or historical artists. For illustrative purposes, some post data are from [Node.js faker](https://github.com/marak/Faker.js/) and coco dataset.
# Neural-Artist
This is the implementation of [Neural Artist](https://www.neuralartist.com) which aims to give people the power to create their own artworks and share the results and their feeling with the community in a totally free way.

## Style Transfer
I used fast style transfer in Python and Tensorflow to transform uploaded images. The image transformation is achieved by feed-forward Convolutional Neural Network based on [Johnson's Perceptual Losses for Real-Time Style Transfer and Super-Resolution](https://arxiv.org/abs/1603.08155). The implementation is modified from [lengstrom's work](https://github.com/lengstrom/fast-style-transfer) with optimization in deployment. The training dataset is from [Microsoft coco train2014](http://cocodataset.org/). 

## Web Stack
The web application is implemented with Node.js, Express and MongoDB using MVC architecture and RESTful API. The responsive frontend is created using React, Bootstrap, Ajax and jQuery for users to share images and write posts. I also built realtime chat room with Socket.IO, and used Passport.js as authentication middleware. The server is deployed with Nginx on AWS EC2, ELB and Route 53. 

Some style images in the web are from [unsplash](https://unsplash.com), while others are from modern artists or historical artists. For illustrative purposes, some post data are from [Node.js faker](https://github.com/marak/Faker.js/) and coco dataset.
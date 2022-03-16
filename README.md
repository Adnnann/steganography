# Descritpion

This is app that enables user to hide message in image. Image in which message is embeded is called cover image.

Process starts with user uploading image (.png, .jpg, .jpeg) and text file (.txt). After uploading both user can embed message in image by clicking on embed button. After embeding user can download image and store it locally.

Upon successfull embeding of message in image, user is redirected to extract page. On extract page user can upload image with embeded message and start extraction process (getting message in txt file). If there is message in image user will receive feedback and be able to download message and store it locally. 

If user upload image without message he will get feedback that no message was extracted from image.

All logic (embeding in image and extracting from image is done on express server).

As app does not include signin module it can be further extended to target files of any given user. For this app all images are removed after embeding is done. Same goes for extraction - upon downloading image all user images are removed from folder.

Package used for embeding and extracting messages is @mykeels/steganography (https://www.npmjs.com/package/@mykeels/steganography)
## Components

App is limited to only 4 components. Focus was mostly on logic of working with file system with node.

Main logic is in EmbedImage.js and ExtractImage.js.

## Redux toolkit

For state management Redux toolkit is used. For fetching and downloading files redux thunk middleware is used.

## Server and database

For server express is used and all server logic is stored in server folder.
## UI

For UI Material UI (MUI) library is used.
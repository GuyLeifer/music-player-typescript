# Music Player (Typescript)
## Enjoy The Music Streamer Service!
    this is a repository of a music player service.
    the service offers a diversity of songs, artists, albums and playlists.
    the repository also provides user accounts for the service.
###
the repository includes database information from Datastore DataBase, ("@google-cloud/datastore" package). 
server side with Datastore queries and packages of authentication like: "jsonwebtoken", "bcrypt", "cookie-parser", to make the service safe and authorized. 
client side with usage of a lot of React packages, like: "react-router-dom", "styled-components-carousel", "react-youtube", "recoil". for perfect use of the service.
"material-ui" for skeletons on loading when fetching data.
## Instructions To Users

1. clone this repo to your device.
2. open the folder in your editor.
3. in the Server folder create a dotenv file and write there 5 variables:  
PORT = your server port.   
TOKEN_SECRET = your authentication token
4. Create a Google account (if you dont have already..) and sign for Google Cloud (there is a free version for 3 first month).
5. Create cradetionals for cloud build, and datastore, and connect your code to the Cloud by Gcloud commands.
6. run the server command - "npm run dev" (to run the server).
7. run the client command (in the client folder of course) - "npm start" (to run the client and open automatically the browser).

## Home Page
    the home page contains a list of of any: songs, artists, albums, playlists and a buttons to choose the selected sort of the top option you want - most liked, most played, or the newest on the service.
![Home Page](./images/homepage.png "Home Page")
## Search Bar
    the service conatains a navigation bar with icons links to the service offers. one of the attributes of the navigation bar is the search bar, which can sort all the data in the service by name.
![Search Bar](./images/searchbar.png "Search Bar")
## Users
    the service offers a not required user account to control the playlist service, if you choose not use the user account you will successfully access to the service, but you can only use what inside it, and you will not have access to users pilot, like "create a playlist" or like a song, artist, album or playlist.
![Users Page](./images/userpage.png "Users Page")
## About
    This is a Music Streamer Included a DataBase of Songs, Artists, Albums and Playlists.
    Enjoy the Experience of the Streamer!
![About Page](./images/about.png "About Page")

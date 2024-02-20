# MOVIES - BACKEND

My Movies Backend use <a href="https://developer.themoviedb.org/docs">the TMDB API</a>.

<br/>

## Movies

### Route : /movies/popular

Method : GET
Description : Get a list of current popular movies

| query | info            | required |
| ----- | --------------- | -------- |
| page  | get more movies | no       |

### Route : /comics/:comicId

Method: POST
Description: Search for movies

| body  | info              | required |
| ----- | ----------------- | -------- |
| title | Enter movie title | yes      |

### Route : /movies/details/:movie_id

Method: GET
Description: Give a list of comics where 1 characters appear

| params   | info              | required |
| -------- | ----------------- | -------- |
| movie_id | Movie id from API | yes      |

<br/>

## Reviews

### Route : /review/:movieId

Method : POST
Description : Create Review for a movie

| body      | info                 | required |
| --------- | -------------------- | -------- |
| title     | Review title         | yes      |
| feeling   | Good, Bad or Neutral | yes      |
| opinion   | review description   | yes      |
| movieName | Name of the movie    | yes      |


| params  | info              | required |
| ------- | ----------------- | -------- |
| movieId | movie id from API | yes      |

### Route : /review/:movieId

Method: GET
Description: Give details of a character

| params  | info              | required |
| ------- | ----------------- | -------- |
| movieId | movie id from API | yes      |

### Route : /reviews/user

Method: GET
Description: Give all reviews of a user

### Route : /review/:id

Method: PUT
Description: Modify your review

| params | info             | required |
| ------ | ---------------- | -------- |
| id     | id of the review | yes      |


| body      | info                 | required |
| --------- | -------------------- | -------- |
| title     | Review title         | yes      |
| feeling   | Good, Bad or Neutral | yes      |
| opinion   | review description   | yes      |

### Route : /review/:movieId

Method: DELETE
Description: Delete your review

| params | info             | required |
| ------ | ---------------- | -------- |
| id     | id of the review | yes      |

<br/>

## Users

### Route : /user/signup

Method : POST

Description : add an user in database and log him

| body     | info                 | required |
| -------- | -------------------- | -------- |
| username | username of the user | yes      |
| email    | email of the user    | yes      |
| password | password of the user | yes      |

### Route : /user/login

Method : POST

Description : login an user

| body     | info                 | required |
| -------- | -------------------- | -------- |
| email    | email of the user    | yes      |
| password | password of the user | yes      |

### Route : /user/profile

Method : GET

Description : View user profile

### Route : /user/email

Method : PUT

Description : Modify user email

| body  | info              | required |
| ----- | ----------------- | -------- |
| email | email of the user | yes      |

### Route : /user/username

Method : PUT

Description : Modify username

| body     | info             | required |
| -------- | ---------------- | -------- |
| username | name of the user | yes      |

### Route : /user/avatar

Method : PUT

Description : Modify profile picture

### Route : /user/delete

Method : DELETE

Description : delete a user from database

| body  | info              | required |
| ----- | ----------------- | -------- |
| email | email of the user | yes      |

<br/>

## Running the project

Clone this repository :

```
git clone https://github.com/Gregoire-Paulay/Movies-Backend.git
cd Marvel-Back
```

Install packages :

```
npm install

```

When installation is complete, you have to launch :

```
npx nodemon server.ts

```

Once server is running on localhost you can use your browser or <a href="https://www.postman.com/">postman</a> to test it

## Star, Fork, Clone & Contribute

Feel free to contribute on this repository. If my work helps you, please give me back with a star. This means a lot to me and keeps me going!

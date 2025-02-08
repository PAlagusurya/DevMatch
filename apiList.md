# DEVMATCH API's

## authRoutes

- POST /signUp
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/password
- PATCH /profile/edit

## connectionRequestRouter

- POST /request/send/interested:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

## userRoutes

- GET /user/requests/received
- GET /user/feed
- GET /user/connections

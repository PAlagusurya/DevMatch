# DEVMATCH API's

## authRoutes

- POST /signUp
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/password
- PATCH /profile/edit

## userRoutes

- GET /user/feed
- GET /user/requests
- GET /user/connections

## connectionRequestRouter

- POST /request/send/interested:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

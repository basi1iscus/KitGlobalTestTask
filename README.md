# User API Test Task

## Quick start

1. Clone this repo using:
  ```shell
  $ git clone git@github.com:basi1iscus/KitGlobalTestTask.git
  ```

2. To install dependencies and clean the git repo run:

  ```shell
  $ yarn install
  ```

  or

  ```shell
  $ npm install
  ```
3. Copy .env.example file to .env and make the necessary changes there

4. Run project

  ```shell
  $ yarn start
  ```
  or

  ```shell
  $ npm run dev
  ```

## API

#### user


POST - Request body 
```Shell
{ 
  email: string
  reg_token?: string
  photo_avatar?: string
  phone?: string
  name: string
}
```

```Shell

GET /api/v1/user/ - get all users
GET /api/v1/user/:userID - get user 'userID'
POST /api/v1/user/ - create new user and return userId
DELETE /api/v1/user/:userID - delete user 'userID'
```

#### doctor


POST - Request body 
```Shell
{ 
  email: string
  reg_token?: string
  photo_avatar?: string
  phone?: string
  name: string
}
```

```Shell

GET /api/v1/doctor/ - get all doctors
GET /api/v1/doctor/:doctorId - get doctor 'userID'
POST /api/v1/doctor/ - create new doctor and return doctorId
DELETE /api/v1/doctor/:doctorId - delete doctor 'userID'
```
#### appointment


POST - Request body 
```Shell
{ 
  date: Date
  user: string (userID)
  doctor: string (doctorID)
}
```

```Shell

GET /api/v1/appointment/ - get all doctors
GET /api/v1/appointment/:appointmentId - get appointment 'appointmentID'
POST /api/v1/appointment/ - create new appointment and return appointmentId
POST /api/v1/appointment/:appointmentId/accept - accept appointment
POST /api/v1/appointment/:appointmentId/reject - reject and delete appointment
```

## Command Line Commands

#### Installation

```Shell
yarn install
```
Installs the dependencies.

#### Testing

```Shell
yarn run test
```

# Annams
Authentication && Authorisation MicroService

## Operating

Work in progress

## Usage

### REST API

#### Overview of RESTful API

##### Users

| Method | Path | Description | Done? |
| --- | --- | --- | --- |
| GET | /users | Retrieve users from database | [✅](#apiv1users) |
| GET | /users/:userId | Retrieve user with ID :userId from database | [✅](#apiv1usersuserid) |
| POST | /users | Create a new user | ❌ |
| PUT | /users/:userId | Updates an existing user with ID :userId | ❌ |
| PATCH | /users/:userId/:fieldName | Updates the field :fieldName of the user with ID :user Id | ❌ |
| DELETE | /users/:userId | Deletes the user with ID :userId | ❌ |

#### `/api/v1/users/`
##### URL Parameters
None.

##### Query Parameters
| Parameter | Description |
| --- | --- |
| offset | User's numerical index to start retrieving users from |
| limit | Number of users to return |

##### Response Codes
| HTTP Code | Description |
| --- | --- |
| 200 | Successfully retrieved users |
| 404 | No more users left to retrieve |
| 500 | All other possible outcomes |

##### Example Query
```bash
curl -vv -X GET "http://localhost:4000/api/v1/users?offset=0&limit=2";
```

##### Example Response
```json
{
  "data": [
    {
      "uuid": "d1551e4d-8285-11e8-ac8e-0242ac130002",
      "email": "Arlie_Moen@gmail.com",
      "username": "Arlie.Moen",
      "nameFull": "Arlie Lulu Moen",
      "nameFirst": "Arlie",
      "nameLast": "Moen",
      "imageUri": "https://picsum.photos/128/128?image=588",
      "createdAt": "2018-07-08T00:06:28.000Z",
      "updatedAt": "2018-07-08T00:06:28.000Z"
    },
    {
      "uuid": "d15521a7-8285-11e8-ac8e-0242ac130002",
      "email": "Brannon.Rice@yahoo.com",
      "username": "Brannon60",
      "nameFull": "Brannon Shaylee Rice",
      "nameFirst": "Brannon",
      "nameLast": "Rice",
      "imageUri": "https://picsum.photos/128/128?image=677",
      "createdAt": "2018-07-08T00:06:28.000Z",
      "updatedAt": "2018-07-08T00:06:28.000Z"
    }
  ],
  "count": 2,
  "timestamp": "2018-07-10T10:17:07.772Z",
  "offset": 0,
  "limit": 2
}
```

#### `/api/v1/users/:userId`
##### URL Parameters
| URL Parameter | Description |
| --- | --- |
| userId | ID of the user as in `users.id` |

##### Query Parameters
None.

##### Response Codes
| HTTP Code | Description |
| --- | --- |
| 200 | Successfully retrieved user |
| 404 | Specified user ID not found |
| 500 | All other possible outcomes |

##### Example Query
```bash
curl -vv -X GET "http://localhost:4000/api/v1/users/1"
```
##### Example Response
```json
{
  "uuid": "d1551e4d-8285-11e8-ac8e-0242ac130002",
  "email": "Arlie_Moen@gmail.com",
  "username": "Arlie.Moen",
  "nameFull": "Arlie Lulu Moen",
  "nameFirst": "Arlie",
  "nameLast": "Moen",
  "nameMiddle": "Lulu",
  "description": "Nihil accusantium tenetur alias enim qui pariatur. Animi voluptas dolores et. Amet nihil aut incidunt. Non et doloremque. Et alias minus est.\n \rRatione amet ipsum natus occaecati aspernatur similique. Aperiam libero debitis explicabo rerum est. Praesentium voluptatem nesciunt et.\n \rFacilis voluptas tenetur est nihil autem illo ratione velit numquam. At voluptatem ab. Nostrum earum ratione. Perferendis soluta et corporis aut corporis quia praesentium architecto dolorem.",
  "imageUri": "https://picsum.photos/128/128?image=588",
  "createdAt": "2018-07-08T00:06:28.000Z",
  "updatedAt": "2018-07-08T00:06:28.000Z"
}
```

## Development

### Requirements
You should have the following software installed on your machine:
- Git
- Node.js
- Yarn
- Docker

### Getting Started
1. Clone this repository
  - `git clone https://github.com/zephinzer/ms.git zephinzer-ms`
2. Go to the `accounts` package
  - `cd zephinzer-ms/packages/accounts`
3. Install dependencies
  - `yarn`
4. Create supporting service instances
  - `npm run provision`
5. Run migrations
  - `npm run migrations`
6. Run seeds
  - `npm run seeds`
7. Start application in development
  - `npm run dev`

### Debugging
#### Get a shell into the MySQL database
```sh
npm run db-exec
```

### Building
Work in progress

## License
This software is licensed under the MIT license. See [LICENSE](./LICENSE) for details.
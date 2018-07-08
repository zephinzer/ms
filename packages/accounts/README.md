# Annams
Authentication && Authorisation MicroService

## Operating

## Usage

### REST API

#### Overview of RESTful API

##### Users

| Method | Path | Description |
| --- | --- | ---
| GET | /users | Retrieve users from database |
| GET | /users/:userId | Retrieve user with ID :userId from database |
| POST | /users | Create a new user |
| PUT | /users/:userId | Updates an existing user with ID :userId |
| PATCH | /users/:userId/:fieldName | Updates the field :fieldName of the user with ID :user Id |
| DELETE | /users/:userId | Deletes the user with ID :userId |

#### /api/v1/users/:userId
##### URL Parameters
| URL Parameter | Description |
| --- | --- |
| userId | ID of the user as in `\`users\`.\`id` |

##### Query Parameters
None.

##### Example Query
```bash
curl -vv http://localhost:4000/api/v1/users/1
```
##### Example Response
```json
{
  "uuid": "d1551e4d-8285-11e8-ac8e-0242ac130002",
  "email": "Arlie_Moen@gmail.com",
  "username": "Arlie.Moen",
  "name_full": "Arlie Lulu Moen",
  "name_first": "Arlie",
  "name_last": "Moen",
  "name_middle": "Lulu",
  "description": "Nihil accusantium tenetur alias enim qui pariatur. Animi voluptas dolores et. Amet nihil aut incidunt. Non et doloremque. Et alias minus est.\n \rRatione amet ipsum natus occaecati aspernatur similique. Aperiam libero debitis explicabo rerum est. Praesentium voluptatem nesciunt et.\n \rFacilis voluptas tenetur est nihil autem illo ratione velit numquam. At voluptatem ab. Nostrum earum ratione. Perferendis soluta et corporis aut corporis quia praesentium architecto dolorem.",
  "image_uri": "https://picsum.photos/128/128?image=588",
  "created_at": "2018-07-08T00:06:28.000Z",
  "updated_at": "2018-07-08T00:06:28.000Z"
}
```
##### Response Codes
| HTTP Code | Description |
| --- | --- |
| 200 | Successfully retrieved user |
| 404 | Specified user ID not found |
| 500 | All other possible outcomes |
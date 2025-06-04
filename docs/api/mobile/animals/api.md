# Mobile API: Breeding Animals

## Base URL

`/api/mobile/animals`

---

## GET `/api/mobile/animals`

List breeding animals with filtering and pagination.

### Query Parameters

- `page` (number, default: 1): Page number.
- `limit` (number, default: 20): Items per page.
- `sortBy` (string, default: "earTag"): Field to sort by.
- `sortOrder` (string, default: "asc"): Sort order ("asc" or "desc").
- `isActive` (boolean, default: true): Filter by active animals.
- `animalType` (string, optional): Filter by animal type.
- `search` (string, optional): Search by ear tag or animal type.

### Response

```json
{
  "animals": [
    {
      "id": "...",
      "earTag": "...",
      "animalType": "...",
      "birthType": "...",
      "growthRate": ...,
      "yearlyWeight": ...,
      "lambIndex": ...,
      "weanerGrowth": ...,
      "isActive": true,
      "images": [
        {
          "id": "...",
          "url": "...",
          "isPrimary": true
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## POST `/api/mobile/animals`

Create a new breeding animal.

### Request Body

```json
{
  "earTag": "string",
  "animalType": "string",
  "birthType": "string",
  "growthRate": 0,
  "yearlyWeight": 0,
  "lambIndex": 0,
  "weanerGrowth": 0
}
```
- `earTag`, `animalType`, `birthType`: required, string
- `growthRate`, `yearlyWeight`, `lambIndex`, `weanerGrowth`: optional, number

### Authorization

- Roles: `ADMIN`, `MANAGER`
- Requires JWT authentication

### Response

- `201 Created` with the created animal object.

---

## GET `/api/mobile/animals/[id]`

Get a specific breeding animal by ID.

### Path Parameters
- `id` (string): The animal's ID.

### Response
```json
{
  "id": "...",
  "earTag": "...",
  "animalType": "...",
  "birthType": "...",
  "growthRate": ...,
  "yearlyWeight": ...,
  "lambIndex": ...,
  "weanerGrowth": ...,
  "isActive": true,
  "images": [ ... ],
  "auctions": [ ... ]
}
```

#### Errors
- `404 NOT_FOUND`: Breeding animal not found.

---

## PUT `/api/mobile/animals/[id]`

Update a breeding animal.

### Path Parameters
- `id` (string): The animal's ID.

### Request Body
```json
{
  "earTag": "string",
  "animalType": "string",
  "birthType": "string",
  "growthRate": 0,
  "yearlyWeight": 0,
  "lambIndex": 0,
  "weanerGrowth": 0,
  "isActive": true
}
```
- All fields optional; only provided fields will be updated.

### Authorization
- Roles: `ADMIN`, `MANAGER`
- Requires JWT authentication

### Response
- The updated animal object.

#### Errors
- `404 NOT_FOUND`: Breeding animal not found.

---

## DELETE `/api/mobile/animals/[id]`

Mark a breeding animal as inactive (soft delete).

### Path Parameters
- `id` (string): The animal's ID.

### Authorization
- Roles: `ADMIN`, `MANAGER`
- Requires JWT authentication

### Response
```json
{
  "message": "Animal marked as inactive",
  "animal": { ... }
}
```

#### Errors
- `404 NOT_FOUND`: Breeding animal not found.

---

## Notes
- Only active animals are returned by default.
- Images array includes only the primary image for each animal in list endpoints.
- Only admin and manager roles can create, update, or delete animals.
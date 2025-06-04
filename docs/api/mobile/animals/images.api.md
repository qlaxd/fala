# Mobile API: Animal Images

## Endpoints

### GET `/api/mobile/animals/[id]/images`

List all images for a specific breeding animal.

#### Path Parameters
- `id` (string): The ID of the breeding animal.

#### Response
```json
[
  {
    "id": "...",
    "animalId": "...",
    "imageUrl": "...",
    "isPrimary": true
  }
]
```

#### Errors
- `404 NOT_FOUND`: Breeding animal not found.

---

### POST `/api/mobile/animals/[id]/images`

Add an image to a breeding animal.

#### Path Parameters
- `id` (string): The ID of the breeding animal.

#### Request Body
```json
{
  "imageUrl": "string (URL)",
  "isPrimary": true
}
```
- `imageUrl`: required, valid URL
- `isPrimary`: optional, boolean (if true, sets this image as primary and unsets others)

#### Authorization
- Roles: `ADMIN`, `MANAGER`
- Requires JWT authentication

#### Response
- `201 Created` with the created image object.

#### Errors
- `404 NOT_FOUND`: Breeding animal not found.

---

## Notes
- If `isPrimary` is set to true, all other images for the animal will be set to `isPrimary: false`.
- Only admin and manager roles can add images.

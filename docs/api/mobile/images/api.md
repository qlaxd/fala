# Mobile API: Images

## Endpoints

### PUT `/api/mobile/images/[id]`

Update an image (e.g., set as primary).

#### Path Parameters
- `id` (string): The ID of the image.

#### Request Body
```json
{
  "isPrimary": true
}
```
- `isPrimary`: required, boolean

#### Authorization
- Roles: `ADMIN`, `MANAGER`
- Requires JWT authentication

#### Response
- The updated image object.

#### Errors
- `404 NOT_FOUND`: Image not found.

---

### DELETE `/api/mobile/images/[id]`

Delete an image (and its file if stored locally).

#### Path Parameters
- `id` (string): The ID of the image.

#### Authorization
- Roles: `ADMIN`, `MANAGER`
- Requires JWT authentication

#### Response
```json
{
  "message": "Image deleted successfully"
}
```

#### Errors
- `404 NOT_FOUND`: Image not found.

---

### POST `/api/mobile/images/upload`

Upload an image file.

#### Request (multipart/form-data)
- `file`: The image file (jpeg, jpg, png, webp; max 5MB)

#### Authorization
- Requires JWT authentication

#### Response
```json
{
  "url": "/uploads/filename.jpg"
}
```

#### Errors
- `400 NO_FILE`: No file uploaded
- `400 INVALID_FILE_TYPE`: File type not allowed
- `400 FILE_TOO_LARGE`: File size exceeds 5MB

---

## Notes
- Only admin and manager roles can update or delete images.
- Uploaded files are stored in `/public/uploads/` and accessible via `/uploads/filename`.

# Mobile API: Authentication

## Endpoints

### POST `/api/mobile/auth/login`

Authenticate a user and receive access and refresh tokens.

#### Request Body
```json
{
  "username": "string",
  "password": "string"
}
```
- `username`: required, string
- `password`: required, string

#### Response
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "username": "...",
    "email": "...",
    "role": "ADMIN|MANAGER|..."
  }
}
```

#### Errors
- `401 INVALID_CREDENTIALS`: Invalid username or password

---

### POST `/api/mobile/auth/logout`

Logout a user and clear their refresh token.

#### Request Body
```json
{
  "userId": "string"
}
```
- `userId`: required, string

#### Response
```json
{
  "message": "Logged out successfully"
}
```

---

### POST `/api/mobile/auth/refresh`

Obtain a new access token using a refresh token.

#### Request Body
```json
{
  "refreshToken": "string"
}
```
- `refreshToken`: required, string

#### Response
```json
{
  "accessToken": "...",
  "user": {
    "id": "...",
    "username": "...",
    "email": "...",
    "role": "ADMIN|MANAGER|..."
  }
}
```

#### Errors
- `401 INVALID_TOKEN`: Invalid or expired refresh token

---

## Notes
- Access tokens expire after 15 minutes.
- Refresh tokens expire after 7 days.
- All endpoints require JWT authentication except `/login` and `/refresh`.

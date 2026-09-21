# API Contract

## POST /api/waitlist

Creates a waitlist registration.

### Request

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "userType": "creator",
  "socialHandle": "@johndoe",
  "socialPlatform": "instagram"
}

### Response

Success:

{
  "success": true,
  "message": "Successfully joined the waitlist"
}

Duplicate:

{
  "success": false,
  "code": "DUPLICATE_EMAIL"
}

Validation error:

{
  "success": false,
  "code": "VALIDATION_ERROR"
}

## GET /api/waitlist/count

Returns:

{
  "count": 1247
}
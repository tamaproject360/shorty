# Shorty API Documentation

Complete API reference for Shorty link shortener and microsite platform.

## Overview

Shorty provides RESTful APIs for managing short links and microsites (link-in-bio pages). All API endpoints require authentication via site token.

## Authentication

Include the site token in your requests using one of these methods:
- **Cookie:** `siteToken`
- **Header:** `Authorization: Bearer YOUR_SITE_TOKEN`

The token is configured via `NUXT_SITE_TOKEN` environment variable.

## Base URL

- **Development:** `http://localhost:7465`
- **Production:** Your deployed domain

---

## Link Management APIs

### Create Link

Create a new short link.

**Endpoint:** `POST /api/link/create`

**Request Body:**
```json
{
  "url": "https://example.com",      // Required
  "slug": "custom-slug",             // Optional (auto-generated if omitted)
  "password": "secret"               // Optional
}
```

**Response (200 OK):**
```json
{
  "id": "abc123xyz",
  "url": "https://example.com",
  "slug": "custom-slug",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "password": "hashed_password"      // Only if password was set
}
```

**Error Codes:**
- `400` - Invalid input (malformed URL, invalid slug)
- `409` - Slug already exists
- `401` - Unauthorized

---

### List Links

Get all links with optional pagination.

**Endpoint:** `GET /api/link/list`

**Query Parameters:**
- `offset` (optional) - Number of records to skip (default: 0)
- `limit` (optional) - Number of records to return (default: 50)

**Response (200 OK):**
```json
{
  "links": [
    {
      "id": "abc123",
      "url": "https://example.com",
      "slug": "custom-slug",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "clicks": 42
    }
  ],
  "total": 100
}
```

---

### Get Link

Get a single link by slug.

**Endpoint:** `GET /api/link/get`

**Query Parameters:**
- `slug` (required) - Link slug

**Response (200 OK):**
```json
{
  "id": "abc123",
  "url": "https://example.com",
  "slug": "custom-slug",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "password": "hashed_password"
}
```

**Error Codes:**
- `404` - Link not found

---

### Update Link

Update an existing link.

**Endpoint:** `PUT /api/link/update`

**Request Body:**
```json
{
  "slug": "custom-slug",             // Required (identifies which link to update)
  "url": "https://new-url.com",      // Optional
  "password": "new-password"         // Optional
}
```

**Response (200 OK):**
```json
{
  "id": "abc123",
  "url": "https://new-url.com",
  "slug": "custom-slug",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

---

### Delete Link

Delete a link permanently.

**Endpoint:** `POST /api/link/delete`

**Request Body:**
```json
{
  "slug": "custom-slug"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

### Search Links

Search links by URL or slug.

**Endpoint:** `GET /api/link/search`

**Query Parameters:**
- `q` (required) - Search query

**Response (200 OK):**
```json
{
  "results": [
    {
      "id": "abc123",
      "url": "https://example.com",
      "slug": "custom-slug",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Microsite APIs

### Create Microsite

Create a new microsite (link-in-bio page).

**Endpoint:** `POST /api/microsite/create`

**Request Body:**
```json
{
  "slug": "my-page",                 // Optional (auto-generated if omitted)
  "title": "My Awesome Page",        // Required
  "description": "About me",         // Optional
  "avatar": "https://example.com/avatar.jpg", // Optional
  "theme": "auto",                   // "light" | "dark" | "auto" (default: "auto")
  "bgColor": "#000000",              // Optional
  "textColor": "#ffffff",            // Optional
  "published": true,                 // Optional (default: false)
  "items": [                         // Array of links
    {
      "id": "item1",                 // Unique ID
      "title": "My Website",
      "url": "https://example.com",
      "order": 0,                    // Display order
      "visible": true                // Show/hide link
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "id": "xyz789",
  "slug": "my-page",
  "title": "My Awesome Page",
  "description": "About me",
  "avatar": "https://example.com/avatar.jpg",
  "theme": "auto",
  "published": true,
  "items": [...],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Codes:**
- `400` - Invalid input
- `409` - Slug already exists

---

### List Microsites

Get all microsites.

**Endpoint:** `GET /api/microsite/list`

**Response (200 OK):**
```json
{
  "microsites": [
    {
      "id": "xyz789",
      "slug": "my-page",
      "title": "My Awesome Page",
      "description": "About me",
      "published": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "itemCount": 5
    }
  ]
}
```

---

### Get Microsite

Get a single microsite by slug.

**Endpoint:** `GET /api/microsite/get`

**Query Parameters:**
- `slug` (required) - Microsite slug

**Response (200 OK):**
```json
{
  "id": "xyz789",
  "slug": "my-page",
  "title": "My Awesome Page",
  "description": "About me",
  "avatar": "https://example.com/avatar.jpg",
  "theme": "auto",
  "published": true,
  "items": [
    {
      "id": "item1",
      "title": "My Website",
      "url": "https://example.com",
      "order": 0,
      "visible": true
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Codes:**
- `404` - Microsite not found

---

### Update Microsite

Update an existing microsite.

**Endpoint:** `PUT /api/microsite/update`

**Request Body:**
```json
{
  "slug": "my-page",                 // Required (identifies which microsite to update)
  "title": "Updated Title",          // Optional
  "description": "New description",  // Optional
  "avatar": "https://example.com/new-avatar.jpg",
  "theme": "dark",
  "published": false,
  "items": [...]                     // Optional (replaces all items if provided)
}
```

**Response (200 OK):**
```json
{
  "id": "xyz789",
  "slug": "my-page",
  "title": "Updated Title",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  ...
}
```

---

### Delete Microsite

Delete a microsite permanently.

**Endpoint:** `POST /api/microsite/delete`

**Request Body:**
```json
{
  "slug": "my-page"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## Public Routes

### Redirect Short Link

Redirects to the target URL.

**Endpoint:** `GET /:slug`

**Behavior:**
- If link exists: Redirects (302) to target URL
- If password protected: Shows password form
- If not found: Returns 404

**Example:**
```
GET /custom-slug
→ 302 Redirect to https://example.com
```

---

### View Microsite

Display public microsite page.

**Endpoint:** `GET /m/:slug`

**Example:**
```
GET /m/my-page
→ Shows microsite landing page
```

**Status Codes:**
- `200` - Microsite found and published
- `404` - Microsite not found or not published

---

## Error Responses

All API errors follow this format:

```json
{
  "statusCode": 400,
  "statusMessage": "Bad Request",
  "message": "Detailed error description"
}
```

### Common Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `400` | Bad Request | Invalid input or malformed request |
| `401` | Unauthorized | Missing or invalid authentication token |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate slug or resource conflict |
| `500` | Internal Server Error | Server error |

---

## Data Validation

All requests are validated using **Zod schemas**:

- `schemas/link.ts` - Link validation rules
- `schemas/microsite.ts` - Microsite validation rules

Invalid requests return `400` with detailed validation errors.

**Example Validation Error:**
```json
{
  "statusCode": 400,
  "statusMessage": "Validation Error",
  "message": "Invalid URL format",
  "issues": [
    {
      "path": ["url"],
      "message": "Invalid URL"
    }
  ]
}
```

---

## Rate Limiting

⚠️ **Not implemented** - Consider adding rate limiting for production use.

Recommended: Use a reverse proxy (Cloudflare, nginx) for rate limiting.

---

## CORS Configuration

CORS is not enabled by default. To enable cross-origin requests:

1. Add CORS configuration in `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
          'Access-Control-Allow-Headers': 'Authorization,Content-Type'
        }
      }
    }
  }
})
```

---

## Storage

Shorty uses **Nitro Storage** (unstorage) with pluggable backends:

- **Development:** File system (`./data/`)
- **Production:** Cloudflare KV, Redis, or any supported backend

Storage keys:
- Links: `link:{slug}`
- Microsites: `microsite:{slug}`

---

## Testing the API

### Using cURL

```bash
# Create a link
curl -X POST http://localhost:7465/api/link/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","slug":"test"}'

# Get a link
curl http://localhost:7465/api/link/get?slug=test \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create a microsite
curl -X POST http://localhost:7465/api/microsite/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Page",
    "items":[{"id":"1","title":"Link 1","url":"https://example.com","order":0,"visible":true}]
  }'
```

### Using JavaScript/TypeScript

```typescript
const token = 'YOUR_SITE_TOKEN'
const baseURL = 'http://localhost:7465'

// Create link
const link = await fetch(`${baseURL}/api/link/create`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    slug: 'test'
  })
}).then(r => r.json())

// Create microsite
const microsite = await fetch(`${baseURL}/api/microsite/create`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Page',
    items: [
      {
        id: '1',
        title: 'My Website',
        url: 'https://example.com',
        order: 0,
        visible: true
      }
    ]
  })
}).then(r => r.json())
```

---

## Webhooks

⚠️ **Not implemented** - Webhooks are not currently available.

---

## OpenAPI/Swagger

⚠️ **Not implemented** - OpenAPI specification is not currently available.

Consider using tools like `@sidebase/nuxt-openapi` to auto-generate OpenAPI docs.

---

## Support

For issues and feature requests:
- GitHub Issues: [Your Repository URL]
- Documentation: [docs/](../docs/)

---

**Last Updated:** 2026-02-08
**API Version:** 0.2.3

# User Management and RBAC

## Sign In

Open `/dashboard/login` and use the initial local administrator account:

```text
Username: admin
Password: shorty@123
```

The password is stored as a salted `scrypt` hash in SQLite. Login returns an opaque token; the server stores only its SHA-256 hash in the `user_sessions` table.

Change the initial password from **Dashboard > User Management** immediately after deployment.

## User Management

The **User Management** menu appears under **Microsites** in the dashboard sidebar for administrators only. It supports creating, editing, activating/deactivating, and deleting non-administrator accounts.

## Roles

| Role | Dashboard and API access |
| ---- | ------------------------ |
| `admin` | Full access. Can manage users and import/export data. |
| `editor` | Can manage links and microsites and view analytics. |
| `viewer` | Read-only access to links, microsites, and analytics. |

Authorization is enforced on the server. Hiding the menu in the client is not used as an authorization control.

## API Endpoints

All endpoints return JSON. Except `POST /api/auth/login`, they require `Authorization: Bearer SESSION_TOKEN`.

### Authentication

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| `POST` | `/api/auth/login` | Public | Authenticate and create a session. |
| `POST` | `/api/auth/logout` | Signed-in user | Invalidate the current session. |
| `GET` | `/api/auth/me` | Signed-in user | Return the current user. |

Login request:

```json
{
  "username": "admin",
  "password": "shorty@123"
}
```

Login response:

```json
{
  "token": "opaque-session-token",
  "user": {
    "id": "uuid",
    "username": "admin",
    "role": "admin",
    "active": true
  }
}
```

### Users

All user endpoints require the `admin` role.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/api/user/list` | List users without password hashes. |
| `POST` | `/api/user/create` | Create an active user. |
| `PUT` | `/api/user/update` | Change a user's role, active status, or password. |
| `POST` | `/api/user/delete` | Delete a non-administrator user. |

Create request:

```json
{
  "username": "jane",
  "password": "use-a-strong-password",
  "role": "editor"
}
```

Update request:

```json
{
  "id": "user-uuid",
  "role": "viewer",
  "active": true,
  "password": "optional-new-password"
}
```

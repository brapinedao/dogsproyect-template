# DogsProyect API Documentation

## 1. Overview

`DogsProyect` is a REST API built with **ASP.NET Core 8**, **Entity Framework Core**, **ASP.NET Identity**, and **JWT Bearer Authentication** for a canine management system.

### Main capabilities
- User registration and login
- Pet management
- Service catalog management
- Appointment scheduling and tracking
- Medical record management

### Local base URLs
According to `DogsProyect/Properties/launchSettings.json`:
- `http://localhost:5281`
- `https://localhost:7041`

### Swagger
If `Swagger:Enabled` is `true`, Swagger UI is available at:
- `http://localhost:5281/swagger`
- `https://localhost:7041/swagger`

---

## 2. Authentication and authorization

The API uses **JWT Bearer tokens**.

### Public endpoints
These endpoints do **not** require a token:
- `POST /api/auth/register`
- `POST /api/auth/login`

### Protected endpoints
All other controllers use `[Authorize]` and require this header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### JWT token contents
The generated token includes claims such as:
- `sub`
- `email`
- `id`
- `nameidentifier`
- `name`
- `role`

### Token expiration
- The token expires **2 hours** after being issued.

### Swagger authorization format
Use this exact format inside Swagger:

```text
Bearer YOUR_JWT_TOKEN
```

---

## 3. Global error format

Unhandled and application exceptions are standardized by `DogsProyect/API/Middleware/GlobalExceptionMiddleware.cs`.

### Error response shape
```json
{
  "StatusCode": 400,
  "Message": "Error message",
  "Details": "Additional details"
}
```

### Typical status codes
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `500 Internal Server Error`

---

## 4. Business rules

### Appointments
From `DogsProyect/Application/Services/AppointmentService.cs`:
- A pet **cannot have two appointments at the exact same date and time**.
- If `status` is omitted during creation, it defaults to `Pending`.
- Valid appointment statuses are:
  - `Pending`
  - `Confirmed`
  - `Completed`
  - `Cancelled`

### Medical records
From `DogsProyect/Application/Services/MedicalRecordService.cs`:
- Any authenticated user can **read** medical records.
- Only users with the **`Veterinarian`** role can:
  - create medical records
  - update medical records

### Services
From `DogsProyect/Domain/Enums/ServiceCategory.cs`:
- `0 = Health`
- `1 = Aesthetics`
- `2 = Nutrition`
- `3 = Daycare`
- `4 = FuneralServices`

### Seeded initial data
From `DogsProyect/Infrastructure/Data/ApplicationDbContext.cs`:
- Service catalog is pre-seeded with 5 services.
- Roles are pre-seeded:
  - `Admin`
  - `Veterinarian`

---

## 5. DTO reference

### RegisterDto
```json
{
  "email": "owner1@dogsproyect.local",
  "password": "Passw0rd!",
  "fullName": "Owner One",
  "address": "123 Bark Street"
}
```

### LoginDto
```json
{
  "email": "owner1@dogsproyect.local",
  "password": "Passw0rd!"
}
```

### PetCreateDto / PetUpdateDto
```json
{
  "name": "Luna",
  "breed": "Golden Retriever",
  "dateOfBirth": "2021-03-15T00:00:00",
  "ownerId": "USER_ADMIN"
}
```

### ServiceCreateDto
```json
{
  "name": "Basic Grooming",
  "cost": 65000,
  "category": 1,
  "durationInMinutes": 40
}
```

### AppointmentCreateDto
```json
{
  "scheduledDate": "2026-04-27T09:00:00",
  "status": "Pending",
  "petId": 1,
  "serviceId": 1
}
```

### AppointmentUpdateDto
```json
{
  "scheduledDate": "2026-04-27T11:00:00",
  "petId": 1,
  "serviceId": 2
}
```

### AppointmentStatusUpdateDto
```json
{
  "status": "Confirmed"
}
```

### MedicalRecordCreateDto / MedicalRecordUpdateDto
```json
{
  "diagnosis": "Otitis",
  "treatment": "Ear cleaning and topical drops",
  "medication": "Otic drops",
  "petId": 1
}
```

---

# 6. Endpoints

## 6.1 Auth
Base route: `api/auth`

### POST `/api/auth/register`
Registers a new owner.

#### Request body
```json
{
  "email": "owner1@dogsproyect.local",
  "password": "Passw0rd!",
  "fullName": "Owner One",
  "address": "123 Bark Street"
}
```

#### Success response `200 OK`
```json
{
  "message": "User registered successfully."
}
```

#### Error responses
- `400 Bad Request`
- `ValidationProblem` if DTO validation fails

---

### POST `/api/auth/login`
Authenticates a user and returns a JWT.

#### Request body
```json
{
  "email": "owner1@dogsproyect.local",
  "password": "Passw0rd!"
}
```

#### Success response `200 OK`
```json
{
  "token": "eyJhbGciOi...",
  "expiresAtUtc": "2026-04-26T21:15:43.1234567Z"
}
```

#### Error responses
- `401 Unauthorized`

---

## 6.2 Pets
Base route: `api/pets`

> Requires JWT.

### GET `/api/pets`
Returns all pets including owner data.

#### Success response `200 OK`
```json
[
  {
    "id": 1,
    "name": "Max",
    "breed": "Labrador",
    "dateOfBirth": "2020-05-10T00:00:00",
    "ownerId": "USER_ADMIN",
    "ownerFullName": "System Admin",
    "ownerEmail": "admin@dogsproyect.local"
  }
]
```

---

### GET `/api/pets/{id}`
Returns a pet by id.

#### Success response `200 OK`
```json
{
  "id": 1,
  "name": "Max",
  "breed": "Labrador",
  "dateOfBirth": "2020-05-10T00:00:00",
  "ownerId": "USER_ADMIN",
  "ownerFullName": "System Admin",
  "ownerEmail": "admin@dogsproyect.local"
}
```

#### Error response `404 Not Found`
```json
{
  "message": "Pet not found."
}
```

---

### GET `/api/pets/owner/{ownerId}`
Returns all pets that belong to a specific owner.

#### Success response `200 OK`
```json
[
  {
    "id": 1,
    "name": "Luna",
    "breed": "Golden Retriever",
    "dateOfBirth": "2021-03-15T00:00:00",
    "ownerId": "USER_ADMIN",
    "ownerFullName": "System Admin",
    "ownerEmail": "admin@dogsproyect.local"
  }
]
```

---

### POST `/api/pets`
Creates a new pet.

#### Request body
```json
{
  "name": "Luna",
  "breed": "Golden Retriever",
  "dateOfBirth": "2021-03-15T00:00:00",
  "ownerId": "USER_ADMIN"
}
```

#### Success response `201 Created`
```json
{
  "id": 1
}
```

#### Error responses
- `400 Bad Request` when owner does not exist

---

### PUT `/api/pets/{id}`
Updates an existing pet.

#### Request body
```json
{
  "name": "Luna Updated",
  "breed": "Golden Retriever",
  "dateOfBirth": "2021-03-15T00:00:00",
  "ownerId": "USER_ADMIN"
}
```

#### Success response `200 OK`
```json
{
  "message": "Pet updated successfully."
}
```

#### Error responses
- `404 Not Found`
- `400 Bad Request`

---

### DELETE `/api/pets/{id}`
Deletes a pet.

#### Success response `200 OK`
```json
{
  "message": "Pet deleted successfully."
}
```

#### Error response `404 Not Found`
```json
{
  "message": "Pet not found."
}
```

---

## 6.3 Services
Base route: `api/services`

> Requires JWT.

### GET `/api/services`
Returns the full service catalog.

#### Success response `200 OK`
```json
[
  {
    "id": 1,
    "name": "General Health Check",
    "cost": 120000,
    "category": 0,
    "durationInMinutes": 45
  }
]
```

---

### GET `/api/services/{id}`
Returns a service by id.

#### Success response `200 OK`
```json
{
  "id": 1,
  "name": "General Health Check",
  "cost": 120000,
  "category": 0,
  "durationInMinutes": 45
}
```

#### Error response `404 Not Found`
```json
{
  "message": "Service not found."
}
```

---

### POST `/api/services`
Creates a new service.

#### Request body
```json
{
  "name": "Basic Grooming",
  "cost": 65000,
  "category": 1,
  "durationInMinutes": 40
}
```

#### Success response `201 Created`
```json
{
  "id": 6
}
```

---

## 6.4 Appointments
Base route: `api/appointments`

> Requires JWT.

### GET `/api/appointments`
Returns all appointments including pet and service names.

#### Success response `200 OK`
```json
[
  {
    "id": 1,
    "scheduledDate": "2026-04-27T09:00:00",
    "status": "Pending",
    "petName": "Luna",
    "serviceName": "General Health Check"
  }
]
```

---

### GET `/api/appointments/pet/{petId}`
Returns appointment history for a given pet.

#### Error response example `404 Not Found`
```json
{
  "StatusCode": 404,
  "Message": "Pet not found.",
  "Details": "No pet exists for the provided petId."
}
```

---

### POST `/api/appointments`
Creates a new appointment.

#### Request body
```json
{
  "scheduledDate": "2026-04-27T09:00:00",
  "status": "Pending",
  "petId": 1,
  "serviceId": 1
}
```

#### Success response `201 Created`
```json
{
  "id": 1
}
```

#### Business rules
- `status` is optional and defaults to `Pending`
- the pet and service must exist
- the pet cannot already have another appointment at the exact same date and time

#### Error examples
```json
{
  "StatusCode": 400,
  "Message": "Pet or Service does not exist.",
  "Details": ""
}
```

```json
{
  "StatusCode": 400,
  "Message": "Double-booking is not allowed.",
  "Details": "The selected pet already has an appointment at the same date and time."
}
```

---

### PUT `/api/appointments/{id}`
Reschedules or updates an appointment.

#### Request body
```json
{
  "scheduledDate": "2026-04-27T11:00:00",
  "petId": 1,
  "serviceId": 2
}
```

#### Success response `200 OK`
```json
{
  "message": "Appointment rescheduled successfully."
}
```

---

### PATCH `/api/appointments/{id}/status`
Updates only the appointment status.

#### Request body
```json
{
  "status": "Confirmed"
}
```

#### Success response `200 OK`
```json
{
  "message": "Appointment status updated successfully."
}
```

---

### DELETE `/api/appointments/{id}`
Deletes an appointment.

#### Success response `200 OK`
```json
{
  "message": "Appointment cancelled successfully."
}
```

---

### GET `/api/appointments/total-cost`
Calculates total cost of appointments.

#### Optional query parameter
- `petId`

#### Examples
- `/api/appointments/total-cost`
- `/api/appointments/total-cost?petId=1`

#### Success response `200 OK`
```json
{
  "totalCost": 205000
}
```

---

## 6.5 Medical records
Base route: `api/medicalrecords`

> Requires JWT.

### GET `/api/medicalrecords/pet/{petId}`
Returns the full medical history for a pet.

#### Success response `200 OK`
```json
[
  {
    "id": 1,
    "diagnosis": "Skin allergy",
    "treatment": "Topical treatment",
    "medication": "Antihistamine",
    "petId": 1,
    "petName": "Luna"
  }
]
```

---

### GET `/api/medicalrecords/{id}`
Returns one medical record by id.

#### Success response `200 OK`
```json
{
  "id": 1,
  "diagnosis": "Skin allergy",
  "treatment": "Topical treatment",
  "medication": "Antihistamine",
  "petId": 1,
  "petName": "Luna"
}
```

---

### POST `/api/medicalrecords`
Creates a medical record.

> Requires role `Veterinarian`.

#### Request body
```json
{
  "diagnosis": "Otitis",
  "treatment": "Ear cleaning and topical drops",
  "medication": "Otic drops",
  "petId": 1
}
```

#### Success response `201 Created`
```json
{
  "id": 1
}
```

#### Error example `403 Forbidden`
```json
{
  "StatusCode": 403,
  "Message": "Only users with Veterinarian role can modify medical records.",
  "Details": ""
}
```

---

### PUT `/api/medicalrecords/{id}`
Updates an existing medical record.

> Requires role `Veterinarian`.

#### Request body
```json
{
  "diagnosis": "Updated diagnosis",
  "treatment": "Updated treatment",
  "medication": "Updated medication",
  "petId": 1
}
```

#### Success response `200 OK`
```json
{
  "message": "Medical record updated successfully."
}
```

---

## 7. Recommended usage flow

1. Register a user with `POST /api/auth/register`
2. Login with `POST /api/auth/login`
3. Store the returned JWT token
4. Send the token in `Authorization: Bearer ...`
5. Query services with `GET /api/services`
6. Create pets with `POST /api/pets`
7. Create appointments with `POST /api/appointments`
8. If authenticated as a veterinarian, create or edit medical records

---

## 8. Notes for frontend integration

- `Category` in services is currently represented as an enum-backed numeric value.
- Appointment status is sent as text when creating/updating status.
- The most reliable live reference is Swagger plus these controller routes.
- `DogsProyect/DogsProyect.http` is currently outdated and does not fully reflect the current API surface.

---

## 9. Endpoint summary

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Pets
- `GET /api/pets`
- `GET /api/pets/{id}`
- `GET /api/pets/owner/{ownerId}`
- `POST /api/pets`
- `PUT /api/pets/{id}`
- `DELETE /api/pets/{id}`

### Services
- `GET /api/services`
- `GET /api/services/{id}`
- `POST /api/services`

### Appointments
- `GET /api/appointments`
- `GET /api/appointments/pet/{petId}`
- `POST /api/appointments`
- `PUT /api/appointments/{id}`
- `PATCH /api/appointments/{id}/status`
- `DELETE /api/appointments/{id}`
- `GET /api/appointments/total-cost`

### Medical records
- `GET /api/medicalrecords/pet/{petId}`
- `GET /api/medicalrecords/{id}`
- `POST /api/medicalrecords`
- `PUT /api/medicalrecords/{id}`


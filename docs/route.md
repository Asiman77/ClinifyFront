# Route Documentation

## Public Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth` | Login and registration |
| `/select-role` | Role selection after authentication |
| `/doctors` | List of available doctors |

---

## Patient Routes

| Route | Description |
|-------|-------------|
| `/patient/dashboard` | Patient dashboard |
| `/patient/book-appointment` | Book a new appointment |
| `/patient/appointments` | View appointments |
| `/patient/medical-records` | Medical records list |
| `/patient/medical-records/{recordId}` | Medical record details |
| `/patient/lab-results` | Laboratory results |

---

## Doctor Routes

| Route | Description |
|-------|-------------|
| `/doctor/dashboard` | Doctor dashboard |
| `/doctor/appointments` | Appointment management |
| `/doctor/medical-records` | Medical records |
| `/doctor/medical-records/{recordId}` | Medical record details |

---

## Laboratory Routes

| Route | Description |
|-------|-------------|
| `/lab/dashboard` | Laboratory dashboard |
| `/lab/responses` | Laboratory responses |
| `/lab/responses/{responseId}` | Laboratory response details |

---

## Admin & Reception Routes

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Administrator dashboard |
| `/reception/dashboard` | Reception dashboard |

---

# API Documentation

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/check-fin` | Validate FIN before registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current authenticated user |
| POST | `/api/auth/select-role` | Select user role |
| POST | `/api/auth/register/verify` | Verify registration |
| POST | `/api/auth/register/setup-password` | Set account password |

---

## Departments & Doctors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | Get all departments |
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/doctors/{doctorId}` | Get doctor details |
| GET | `/api/doctors/{doctorId}/available-slots` | Get doctor's available appointment slots |

---

## Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments/mine` | Get current patient's appointments |
| PATCH | `/api/appointments/{appointmentId}/cancel` | Cancel appointment |
| GET | `/api/doctor/appointments` | Get doctor's appointments |
| PATCH | `/api/doctor/appointments/{appointmentId}/{action}` | Approve or reject an appointment (`approve` or `reject`) |

---

## Medical Records

### Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/records` | Get medical records |
| POST | `/api/doctor/records` | Create medical record |
| GET | `/api/doctor/records/{recordId}` | Get medical record details |
| GET | `/api/doctor/records/patients` | Get patients with records |

### Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patient/records` | Get patient's medical records |
| GET | `/api/patient/records/{recordId}` | Get medical record details |
| GET | `/api/patient/lab-results` | Get patient's laboratory results |

> **Note:** The `/api/patient/lab-results` endpoint is already integrated in the frontend, but the corresponding patient-safe backend implementation is still pending.

---

## Laboratory

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lab-responses` | Get laboratory responses |
| GET | `/api/lab-responses/pending` | Get pending laboratory responses |
| GET | `/api/lab-responses/{responseId}` | Get laboratory response details |
| PUT | `/api/lab-responses/{responseId}` | Update laboratory response |
| PATCH | `/api/lab-responses/{responseId}/status` | Update response status |
| POST | `/api/lab-responses/{responseId}/files` | Upload laboratory files |
| DELETE | `/api/lab-responses/{responseId}/files` | Delete laboratory files |
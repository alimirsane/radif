# AGENTS.md

This file defines the software agents in the Radif LIMS backend.  
Each agent encapsulates a bounded responsibility and set of code modules.  
This organization helps both Codex and developers understand and extend the system effectively.

---

## Agent: AccountsAgent

**Responsibilities:**
- Handle user registration (personal and business)
- Manage login via OTP and Sharif University SSO (CAS)
- Maintain user profiles and access levels
- Enforce field-level editability and user-type restrictions

**Code Locations:**
- `apps/account/models.py`
- `apps/account/api/` (views.py, serializers.py, permissions.py, urls.py)
- `apps/account/admin.py`

**External Services:**
- Sharif UAC CAS server for SSO
- SMS Gateway for OTP delivery

**API Endpoints:**
- `/v1/accounts/register/personal/`
- `/v1/accounts/request-otp/`
- `/v1/accounts/users/my-profile/`
- `/v1/accounts/sso/verify/`

---

## Agent: GrantAgent

**Responsibilities:**
- Manage internal and Labsnet-related grant records for users
- Track transactions, balances, and expiration
- Process grant-backed service requests and Labsnet linkage

**Code Locations:**
- `apps/account/models.py` (GrantRecord, GrantTransaction)
- `apps/account/api/grants/` (views, serializers)

**API Endpoints:**
- `/v1/accounts/grant-record/`
- `/v1/accounts/grant-transaction/`
- `/v1/accounts/grant-request/`

---

## Agent: NotificationAgent

**Responsibilities:**
- Manage delivery of notifications via email and SMS
- Send alerts for OTP, appointment status, grant usage, etc.
- Support listing of notification history

**Code Locations:**
- `apps/account/api/notifications/`
- `apps/account/models.py` (Notification)

**External Services:**
- SMS Gateway
- Django email backend

**API Endpoints:**
- `/v1/accounts/notification/`
- `/v1/accounts/notification/list/`

---

## Agent: RequestAgent

**Responsibilities:**
- Manage laboratory service requests
- Link users to labs, experiments, and services
- Calculate pricing and discounts
- Handle grant usage on requests
- Track request workflow status

**Code Locations:**
- `apps/lab/models.py`
- `apps/lab/api/` (views.py, serializers.py, filters.py, urls.py)
- `apps/lab/signals.py`

**API Endpoints:**
- `/v1/labs/requests/`
- `/v1/labs/requests/<id>/`
- `/v1/labs/requests/<id>/status/`
- `/v1/labs/requests/<id>/labsnet/`

---

## Agent: AppointmentAgent

**Responsibilities:**
- Handle queue scheduling and experiment appointments
- Enforce appointment constraints (limits, date ranges)
- Enable user booking and cancellation
- Clean up pending reservations automatically

**Code Locations:**
- `apps/appointment/models.py`
- `apps/appointment/api/` (views.py, serializers.py, filters.py, urls.py)
- `apps/lab/tasks.py` (Celery tasks)

**API Endpoints:**
- `/v1/appointment/queue/`
- `/v1/appointment/appointments/`
- `/v1/appointment/available/`
- `/v1/appointment/cancel/<id>/`

---

## Agent: OrderAgent

**Responsibilities:**
- Manage orders for lab services and request bundles
- Apply promotions and handle grant deductions
- Interface with Sharif University payment gateway
- Track payment records and invoice status

**Code Locations:**
- `apps/order/models.py`
- `apps/order/api/` (views.py, serializers.py, urls.py)
- `apps/order/sharifpayment.py`

**External Services:**
- Sharif University financial gateway

**API Endpoints:**
- `/v1/order/`
- `/v1/order/<id>/pay/`
- `/v1/order/<id>/prepay/`
- `/v1/order/payment-record/`

---

## Agent: FormAgent

**Responsibilities:**
- Define and manage dynamic forms used for lab requests
- Support field logic, form sections, and response storage

**Code Locations:**
- `apps/form/models.py`
- `apps/form/api/` (views.py, serializers.py, urls.py)

**API Endpoints:**
- `/v1/form/`
- `/v1/form/<id>/`

---

## Agent: ReportingAgent

**Responsibilities:**
- Provide exportable admin reports (e.g., Excel)
- Summarize financial, request, and usage data for operators or managers

**Code Locations:**
- `apps/report/api/` (views.py, functions.py, urls.py)

**API Endpoints:**
- `/v1/reports/main_excel/`

---

## Agent: LabsnetAgent

**Responsibilities:**
- Integrate with Labsnet for credit submission
- Perform login with CAPTCHA handling
- Create Labsnet requests and associate with internal ones

**Code Locations:**
- `apps/core/labsnet_func.py`
- Labsnet-related logic within `apps/lab/models.py`

**External Services:**
- Labsnet (https://labsnet.ir)

---

## Agent: APIAgent

**Responsibilities:**
- Aggregate API routes for each module
- Provide schema generation via DRF Spectacular

**Code Locations:**
- `core/urls_v1.py`
- `SLIMS/urls.py`
- `core/schema.py`

---

## Agent: UIModuleAgent

**Responsibilities:**
- Frontend (Next.js) client that consumes the API
- Implement user flows such as registration, booking, and dashboard

**Code Locations:**
- Not present in this repository – lives in separate frontend repo

---

## Agent: SystemAdminAgent

**Responsibilities:**
- System configuration via Django Admin
- Manage users, labs, queues, request rules, services, etc.
- Maintain environment and feature flags in settings

**Code Locations:**
- `apps/*/admin.py`
- `SLIMS/envs/common.py`

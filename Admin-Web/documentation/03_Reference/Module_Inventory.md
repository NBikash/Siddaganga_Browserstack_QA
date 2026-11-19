# Admin Web – Module Inventory

Discovered by read-only exploration of `https://dari-dev.siddagangatravels.com` (DEV) as **Superadmin**, 2026-10-30.
Forms/actions listed were opened only to read them (closed without saving). See `Navigation_Inventory.md` for routes.

| # | Module | Submodules / views | Screens | Use cases |
|---|---|---|---|---|
| 1 | Authentication | Forgot Password, Login, Login with OTP | 3 | 21 |
| 2 | Global Navigation & Header | Header, Sidebar | 2 | 14 |
| 3 | Dashboard |  | 1 | 31 |
| 4 | Role & Permission | Deleted Users, Role Management, User Management | 3 | 24 |
| 5 | Employee Management | All Employees, Client Request, Employee Dashboard, Employee Onboarding, HR Overview, Operations Roster | 6 | 80 |
| 6 | Fleet & Vehicle Management | Bus Manufacturers, Bus Models, Bus Types, Fleet & Vehicles, Seat Types | 9 | 36 |
| 7 | Booking & Operations | Booked, Completed, Pending Vehicle Allocations, Pre-Bookings | 4 | 0 |
| 8 | Inquiry Management | All Inquiries | 1 | 0 |
| 9 | Lead Management | All Leads | 1 | 0 |
| 10 | Client Management | Contracted Clients, International Clients, Manage Client, Regular Customers, Request Category, Trip Wise Client | 13 | 11 |
| 11 | Vendor Management | Deactivated Vendors, Manage Request Type, Vendors | 6 | 0 |
| 12 | Category Management | Main Category, Manage Unit Type, Sub Category | 3 | 33 |
| 13 | Service & Maintenance | All Service and Maintenance, Manage Service Type, Service Requests | 11 | 0 |
| 14 | Financial Management | Assets, Banking, Compliance, Dashboard, Expenses, Income, Masters, More, Payables, Profitability, Receivables, Reports | 12 | 0 |
| 15 | Inventory Management | Dashboard, Manage Inventory, Purchasing, Reports & Analytics, Settings | 5 | 0 |
| 16 | Content Management System | App Force Update, Marketing Notification, Popular Routes, Popular Service Category, Popular Service Required For, Popular Service Route, Popular Service Sub Category, Popular Service Why Required, Privacy & Terms, WhatsApp FAQ | 12 | 0 |
| 17 | Payment And Refund Management | B2B Rebate Tiers, B2C Rebate Tiers, Penalty Slabs | 3 | 0 |
| 18 | End-to-End Workflows | Cross-module | 1 | 19 |

## Authentication

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Login | Login | `/login` | — | Fully explored | 13 |
| Forgot Password | Forgot Password | `/forgot-password` | — | Partially explored | 5 |
| Log in with OTP | Login with OTP | `/login` | — | Partially explored | 3 |

## Global Navigation & Header

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Sidebar navigation | Sidebar | `(all screens)` | — | Fully explored | 8 |
| Header (title, notifications, profile) | Header | `(all screens)` | — | Partially explored | 6 |

## Dashboard

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Dashboard |  | `/dashboard` | Add Alert → Add Driver Emergency Alert (9 fields)<br>Add Refuel Request → Add Refuel Request (8 fields) | Fully explored | 31 |

## Role & Permission

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| User Management (All Users) | User Management | `/dashboard/user-management` | Access → Access User (0 fields)<br>Add More Permissions → dialog (0 fields) | Partially explored | 12 |
| Role Management (All Roles) | Role Management | `/dashboard/user-management › Role Management` | — | Partially explored | 5 |
| Deleted Users | Deleted Users | `/dashboard/user-management › Deleted Users` | — | Fully explored | 7 |

## Employee Management

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Employee Management dashboard | Employee Dashboard | `/dashboard/employee-management` | + Add Employee → Employee Onboarding Wizard (19 fields) | Fully explored | 16 |
| All Employees | All Employees | `/dashboard/employee-management/totalemployees` | + Add New Employee → Employee Onboarding Wizard (19 fields) | Fully explored | 13 |
| Employee Onboarding | Employee Onboarding | `/dashboard/employee-management › Employee Onboarding` | + Add Employee → Employee Onboarding Wizard (19 fields) | Fully explored | 13 |
| Operations Roster | Operations Roster | `/dashboard/employee-management › Operations Roster` | + Add Employee → Employee Onboarding Wizard (19 fields)<br>+ Add Shift → Add Shift (4 fields) | Fully explored | 19 |
| Client Request | Client Request | `/dashboard/employee-management › Client Request` | — | Fully explored | 9 |
| HR Overview | HR Overview | `/dashboard/employee-management › HR Overview` | — | Fully explored | 10 |

## Fleet & Vehicle Management

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Vehicle Management Portal | Fleet & Vehicles | `/dashboard/fleet-vehicle-management` | — | Fully explored | 4 |
| Total Buses / Active | Fleet & Vehicles | `/dashboard/fleet-vehicle-management › Total Buses / Active` | — | Not explored | 0 |
| Approved & Track Live Trips | Fleet & Vehicles | `/dashboard/fleet-vehicle-management › Approved & Track Live Trips` | — | Fully explored | 1 |
| Vehicle Allocation Portal | Fleet & Vehicles | `/dashboard/fleet-vehicle-management › Vehicle Allocation Portal` | — | Fully explored | 6 |
| Tariff Management | Fleet & Vehicles | `/dashboard/fleet-vehicle-management/tarrifs` | — | Fully explored | 6 |
| Bus Types | Bus Types | `/dashboard/fleet-vehicle-management/bus-types` | Sync WhatsApp Catalog (not clicked – approval needed)<br>Clear Catalog (not clicked – approval needed)<br>Clear Catalog and Sync (not clicked – approval needed) | Not explored | 0 |
| Bus Manufacturers | Bus Manufacturers | `/dashboard/fleet-vehicle-management/bus-manufacturer` | — | Not explored | 0 |
| Bus Models | Bus Models | `/dashboard/fleet-vehicle-management/bus-modal-page` | + Add Bus Model → Add Bus Model (4 fields) | Fully explored | 19 |
| Seat Types | Seat Types | `/dashboard/fleet-vehicle-management/seat-type` | — | Not explored | 0 |

## Booking & Operations

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Booking & Operations – Pre-Bookings | Pre-Bookings | `/dashboard/booking-management/total-booking` | — | Not explored | 0 |
| Booking & Operations – Booked | Booked | `/dashboard/booking-management/total-booking › Booked` | — | Not explored | 0 |
| Booking & Operations – Completed | Completed | `/dashboard/booking-management/total-booking › Completed` | — | Not explored | 0 |
| Allocation Portal | Pending Vehicle Allocations | `/dashboard/booking-management/pending-allocation` | — | Not explored | 0 |

## Inquiry Management

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Inquiry Management | All Inquiries | `/dashboard/inquiry-management/total-inquiries` | — | Not explored | 0 |

## Lead Management

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Lead Management | All Leads | `/dashboard/lead-management/total-lead` | — | Not explored | 0 |

## Client Management

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| All Regular Customers | Regular Customers | `/dashboard/client-management/regular-clients` | — | Not explored | 0 |
| Regular – All Bookings | Regular Customers | `/dashboard/client-management/regular-clients?tab=allBookings` | — | Not explored | 0 |
| Regular – Invoice & Payment | Regular Customers | `/dashboard/client-management/regular-clients?tab=invoiceAndPayment` | — | Not explored | 0 |
| Regular – Customer Requests | Regular Customers | `/dashboard/client-management/regular-clients?tab=customerRequests` | — | Not explored | 0 |
| All Clients (Contracted) | Contracted Clients | `/dashboard/client-management/contracted-clients` | — | Not explored | 0 |
| Contracted – User Management | Contracted Clients | `/dashboard/client-management/contracted-clients?tab=userManagement` | — | Not explored | 0 |
| Contracted – Invoice & Payment | Contracted Clients | `/dashboard/client-management/contracted-clients?tab=invoiceManagement` | — | Not explored | 0 |
| Contracted – Client Requests | Contracted Clients | `/dashboard/client-management/contracted-clients?tab=clientRequests` | — | Not explored | 0 |
| Contracted – New Clients/Onboard | Contracted Clients | `/dashboard/client-management/contracted-clients?tab=clientOnboard` | — | Fully explored | 11 |
| International Clients | International Clients | `/dashboard/client-management/international-clients` | — | Not explored | 0 |
| Trip Wise Clients | Trip Wise Client | `/dashboard/client-management/trip-wise-client` | — | Not explored | 0 |
| Manage Client (Client Categories) | Manage Client | `/dashboard/client-management/manage-client` | — | Not explored | 0 |
| Request Category | Request Category | `/dashboard/client-management/request-category` | — | Not explored | 0 |

## Vendor Management

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| All Vendors | Vendors | `/dashboard/vendor-management/vendors` | — | Not explored | 0 |
| Manage Vendor Requests | Vendors | `/dashboard/vendor-management/vendors › Manage Vendor Requests` | — | Not explored | 0 |
| Vehicles Onboarded | Vendors | `/dashboard/vendor-management/vendors › Vehicles Onboarded` | — | Not explored | 0 |
| Products Linked | Vendors | `/dashboard/vendor-management/vendors › Products Linked` | — | Not explored | 0 |
| Manage Request Type | Manage Request Type | `/dashboard/vendor-management/manage-request-type` | — | Not explored | 0 |
| Deactivated Vendors | Deactivated Vendors | `/dashboard/vendor-management/deactivated-vendors` | Activate Vendor (not clicked – approval needed) | Not explored | 0 |

## Category Management

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Main Category | Main Category | `/dashboard/category-management/main-category` | + Add New Category → Add Main Category (7 fields)<br>⋮ menu: Edit Category / Delete Category<br>Edit Category → Edit Main Category (8 fields) | Fully explored | 33 |
| Sub Category | Sub Category | `/dashboard/category-management/sub-category` | — | Not explored | 0 |
| Unit Type | Manage Unit Type | `/dashboard/category-management/manage-unit-type` | — | Not explored | 0 |

## Service & Maintenance

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| All Service Requests | Service Requests | `/dashboard/service-maintenance/service-requests` | — | Not explored | 0 |
| Under Review Requests | Service Requests | `/dashboard/service-maintenance/service-requests › Under Review` | — | Not explored | 0 |
| All Parts Requests | Service Requests | `/dashboard/service-maintenance/service-requests › Parts Request` | — | Not explored | 0 |
| Approved Requests | Service Requests | `/dashboard/service-maintenance/service-requests › Approved Requests` | — | Not explored | 0 |
| Rejected Requests | Service Requests | `/dashboard/service-maintenance/service-requests › Rejected Requests` | — | Not explored | 0 |
| Job Tracker | Service Requests | `/dashboard/service-maintenance/service-requests › Job Tracker` | — | Not explored | 0 |
| Cost Analytics | Service Requests | `/dashboard/service-maintenance/service-requests › Cost Analytics` | — | Not explored | 0 |
| All Scheduled Requests | All Service and Maintenance | `/dashboard/service-maintenance/all-service-and-maintenance` | — | Not explored | 0 |
| All Service Type | Manage Service Type | `/dashboard/service-maintenance/manage-service-type` | — | Not explored | 0 |
| Pre-Departure Checklist | Manage Service Type | `/dashboard/service-maintenance/manage-service-type › Pre-Departure Checklist` | — | Not explored | 0 |
| Post-arrival Checklist | Manage Service Type | `/dashboard/service-maintenance/manage-service-type › Post-arrival Checklist` | — | Not explored | 0 |

## Financial Management

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Financial Dashboard | Dashboard | `/dashboard/financial-management` | — | Not explored | 0 |
| Masters | Masters | `/dashboard/financial-management › Masters` | — | Not explored | 0 |
| Income | Income | `/dashboard/financial-management › Income` | — | Not explored | 0 |
| Expenses | Expenses | `/dashboard/financial-management › Expenses` | — | Not explored | 0 |
| Receivables | Receivables | `/dashboard/financial-management › Receivables` | — | Not explored | 0 |
| Payables | Payables | `/dashboard/financial-management › Payables` | — | Not explored | 0 |
| Banking | Banking | `/dashboard/financial-management › Banking` | — | Not explored | 0 |
| Assets | Assets | `/dashboard/financial-management › Assets` | — | Not explored | 0 |
| Compliance | Compliance | `/dashboard/financial-management › Compliance` | — | Not explored | 0 |
| Profitability | Profitability | `/dashboard/financial-management › Profitability` | — | Not explored | 0 |
| Reports | Reports | `/dashboard/financial-management › Reports` | — | Not explored | 0 |
| More | More | `/dashboard/financial-management › More` | — | Not explored | 0 |

## Inventory Management

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Inventory Dashboard | Dashboard | `/dashboard/inventory-management/dashboard` | — | Not explored | 0 |
| Manage Inventory | Manage Inventory | `/dashboard/inventory-management/dashboard › Manage Inventory` | — | Not explored | 0 |
| Purchasing | Purchasing | `/dashboard/inventory-management/dashboard › Purchasing` | — | Not explored | 0 |
| Inventory Settings | Settings | `/dashboard/inventory-management/dashboard › Settings` | — | Not explored | 0 |
| Reports & Analytics | Reports & Analytics | `/dashboard/inventory-management/dashboard › Reports & Analytics` | — | Not explored | 0 |

## Content Management System

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Popular Routes | Popular Routes | `/dashboard/content-management-system/popular-routes` | — | Not explored | 0 |
| Popular Service Category | Popular Service Category | `/dashboard/content-management-system/popular-service-category` | — | Not explored | 0 |
| Popular Service Sub Category | Popular Service Sub Category | `/dashboard/content-management-system/popular-service-sub-category` | — | Not explored | 0 |
| Popular Service Route | Popular Service Route | `/dashboard/content-management-system/popular-service-route` | — | Not explored | 0 |
| Popular Service Why Required | Popular Service Why Required | `/dashboard/content-management-system/popular-service-why-required` | — | Not explored | 0 |
| Popular Service Required For | Popular Service Required For | `/dashboard/content-management-system/popular-service-required-for` | — | Not explored | 0 |
| WhatsApp FAQ | WhatsApp FAQ | `/dashboard/content-management-system/whatsapp-faq` | — | Not explored | 0 |
| App Force Update – User App | App Force Update | `/dashboard/content-management-system/app-force-update` | Save Changes (not clicked – approval needed) | Not explored | 0 |
| App Force Update – Internal Ops App | App Force Update | `/dashboard/content-management-system/app-force-update › Internal Ops App` | Save Changes (not clicked – approval needed) | Not explored | 0 |
| Marketing Notification | Marketing Notification | `/dashboard/content-management-system/marketing-notification` | Send Notification (not clicked – approval needed)<br>Select All Filtered (not clicked – approval needed) | Not explored | 0 |
| Privacy Policy | Privacy & Terms | `/dashboard/content-management-system/policies-and-info` | Save Privacy Policy (not clicked – approval needed) | Not explored | 0 |
| Terms & Conditions | Privacy & Terms | `/dashboard/content-management-system/policies-and-info › Terms & Conditions` | — | Not explored | 0 |

## Payment And Refund Management

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Cancellation Penalty Slabs | Penalty Slabs | `/dashboard/payment-management` | Bulk Update (not clicked – approval needed) | Not explored | 0 |
| B2B Rebate Tiers | B2B Rebate Tiers | `/dashboard/payment-management › B2B Rebate Tiers` | — | Not explored | 0 |
| B2C Rebate Tiers | B2C Rebate Tiers | `/dashboard/payment-management › B2C Rebate Tiers` | — | Not explored | 0 |

## End-to-End Workflows

| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |
|---|---|---|---|---|---|
| Cross-module workflow | Cross-module | `(multiple)` | — | Workflow | 19 |

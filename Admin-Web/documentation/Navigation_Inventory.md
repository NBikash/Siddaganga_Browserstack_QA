# Admin Web – Navigation Inventory

Base URL: `https://dari-dev.siddagangatravels.com` · Unauthenticated access to any `/dashboard/*` route redirects to `/login`. Post-login landing page: `/dashboard`.
## Logged-out pages
| Page | Route | Controls |
|---|---|---|
| Login | `/login` | Username / Email Address, Password (+ visibility toggle), Login, Forgot Password? → `/forgot-password`, Log in with OTP |
| Login with OTP | `/login` (toggled view) | Username / Email Address, Send OTP, Log in With Email & Password |
| Forgot Password | `/forgot-password` | Username / Email Address, Send OTP, Go to Login → `/login` |
## Header (all screens)
| Control | Behaviour observed |
|---|---|
| Hide sidebar (circle arrow) / hamburger | Collapses / restores the sidebar |
| Page title (H1) | Name of current screen (some sub-screens keep the parent title) |
| Bell icon | 'Notifications' popover – 'N New', 'New Inquiry Alert' items; 'No Notifications' when empty |
| Avatar | Menu: role label (Superadmin), Profile → `/dashboard/profile` (renders empty), Logout |
## Sidebar (Superadmin)
| Section | Item | Route |
| OVERVIEW | Dashboard | `/dashboard` |
| PEOPLE & ACCESS | Role & Permission | `/dashboard/user-management` |
| PEOPLE & ACCESS | Employee Management | `/dashboard/employee-management` |
| FLEET & TRIPS | Fleet & Vehicle Management › Fleet & Vehicles | `/dashboard/fleet-vehicle-management` |
| FLEET & TRIPS | Fleet & Vehicle Management › Bus Types | `/dashboard/fleet-vehicle-management/bus-types` |
| FLEET & TRIPS | Fleet & Vehicle Management › Bus Manufacturers | `/dashboard/fleet-vehicle-management/bus-manufacturer` |
| FLEET & TRIPS | Fleet & Vehicle Management › Bus Models | `/dashboard/fleet-vehicle-management/bus-modal-page` |
| FLEET & TRIPS | Fleet & Vehicle Management › Seat Types | `/dashboard/fleet-vehicle-management/seat-type` |
| FLEET & TRIPS | Booking & Operations | `/dashboard/booking-management/total-booking` |
| FLEET & TRIPS | Inquiry Management | `/dashboard/inquiry-management/total-inquiries` |
| FLEET & TRIPS | Lead Management | `/dashboard/lead-management/total-lead` |
| PARTNERS | Client Management | `/dashboard/client-management/regular-clients` |
| PARTNERS | Client Management › Trip Wise Client | `/dashboard/client-management/trip-wise-client` |
| PARTNERS | Client Management › Manage Client | `/dashboard/client-management/manage-client` |
| PARTNERS | Client Management › Request Category | `/dashboard/client-management/request-category` |
| PARTNERS | Vendor Management | `/dashboard/vendor-management/vendors` |
| PARTNERS | Vendor Management › Manage Request Type | `/dashboard/vendor-management/manage-request-type` |
| PARTNERS | Vendor Management › Deactivated Vendors | `/dashboard/vendor-management/deactivated-vendors` |
| PARTNERS | Category Management › Main Category | `/dashboard/category-management/main-category` |
| PARTNERS | Category Management › Sub Category | `/dashboard/category-management/sub-category` |
| PARTNERS | Category Management › Manage Unit Type | `/dashboard/category-management/manage-unit-type` |
| OPERATIONS | Service & Maintenance | `/dashboard/service-maintenance/service-requests` |
| OPERATIONS | Service & Maintenance › Manage Service Type | `/dashboard/service-maintenance/manage-service-type` |
| OPERATIONS | Financial Management | `/dashboard/financial-management` |
| OPERATIONS | Inventory Management | `/dashboard/inventory-management/dashboard` |
| OPERATIONS | Content Management System › Popular Routes | `/dashboard/content-management-system/popular-routes` |
| OPERATIONS | Content Management System › Popular Service Category | `/dashboard/content-management-system/popular-service-category` |
| OPERATIONS | Content Management System › Popular Service Sub Category | `/dashboard/content-management-system/popular-service-sub-category` |
| OPERATIONS | Content Management System › Popular Service Route | `/dashboard/content-management-system/popular-service-route` |
| OPERATIONS | Content Management System › Popular Service Why Required | `/dashboard/content-management-system/popular-service-why-required` |
| OPERATIONS | Content Management System › Popular Service Required For | `/dashboard/content-management-system/popular-service-required-for` |
| OPERATIONS | Content Management System › WhatsApp FAQ | `/dashboard/content-management-system/whatsapp-faq` |
| OPERATIONS | Content Management System › App Force Update | `/dashboard/content-management-system/app-force-update` |
| OPERATIONS | Content Management System › Marketing Notification | `/dashboard/content-management-system/marketing-notification` |
| OPERATIONS | Content Management System › Privacy & Terms | `/dashboard/content-management-system/policies-and-info` |
| OPERATIONS | Payment And Refund Management | `/dashboard/payment-management` |
## In-page navigation (cards, toggles, tabs)
| From | Control | Result |
| `/dashboard/user-management` | User Management | `/dashboard/user-management` (no URL change; content same or inline) |
| `/dashboard/user-management` | Role Management | `/dashboard/user-management` – All Roles |
| `/dashboard/user-management` | Deleted Users | navigates in-page (clicked during deep inspection) |
| `/dashboard/employee-management` | Total Employees | `/dashboard/employee-management` (no URL change; content same or inline) |
| `/dashboard/employee-management` | All Drivers and Helpers Count | `/dashboard/employee-management` (no URL change; content same or inline) |
| `/dashboard/employee-management` | Client Request Portal | `/dashboard/employee-management` (no URL change; content same or inline) |
| `/dashboard/employee-management` | Incentive Programs | `/dashboard/employee-management` (no URL change; content same or inline) |
| `/dashboard/employee-management` | Sales Incentive Programs | `/dashboard/employee-management` (no URL change; content same or inline) |
| `/dashboard/employee-management` | Employee Onboarding | `/dashboard/employee-management` (no URL change; content same or inline) |
| `/dashboard/employee-management` | Employee Tracker | `/dashboard/employee-management` (no URL change; content same or inline) |
| `/dashboard/employee-management` | View All Employees | `/dashboard/employee-management/totalemployees` – Retention Rate / 100 |
| `/dashboard/employee-management` | Operations Roster | `/dashboard/employee-management` – Operations Roster / Employees Scheduled Today / 5 |
| `/dashboard/employee-management` | Client Request | `/dashboard/employee-management` – Client Request / Total Bookings / Open Requests |
| `/dashboard/employee-management` | HR Overview | `/dashboard/employee-management` – HR Overview / 0.00 / Retention Rate |
| `/dashboard/fleet-vehicle-management` | Total Buses / Active | `/dashboard/fleet-vehicle-management` (no URL change; content same or inline) |
| `/dashboard/fleet-vehicle-management` | Approved & Track Live Trips | navigates in-page (clicked during deep inspection) |
| `/dashboard/fleet-vehicle-management` | Vehicle Allocation Portal | `/dashboard/fleet-vehicle-management` (no URL change; content same or inline) |
| `/dashboard/fleet-vehicle-management` | Tarrif Management | `/dashboard/fleet-vehicle-management/tarrifs` – Tariff Management / Local |
| `/dashboard/booking-management/total-booking` | Total Bookings | `/dashboard/booking-management/total-booking` (no URL change; content same or inline) |
| `/dashboard/booking-management/total-booking` | Live Trips | `/dashboard/booking-management/total-booking` (no URL change; content same or inline) |
| `/dashboard/booking-management/total-booking` | Upcoming Trips | `/dashboard/booking-management/total-booking` (no URL change; content same or inline) |
| `/dashboard/booking-management/total-booking` | Pending Vehicle Allocations | `/dashboard/booking-management/pending-allocation` – Allocation Portal |
| `/dashboard/booking-management/total-booking` | Pre-Bookings | `/dashboard/booking-management/total-booking` (no URL change; content same or inline) |
| `/dashboard/booking-management/total-booking` | Booked | `/dashboard/booking-management/total-booking` – Booked |
| `/dashboard/booking-management/total-booking` | Completed | `/dashboard/booking-management/total-booking` – Completed |
| `/dashboard/inquiry-management/total-inquiries` | Total Inquiries | `/dashboard/inquiry-management/total-inquiries` (no URL change; content same or inline) |
| `/dashboard/inquiry-management/total-inquiries` | Conversion Rate | `/dashboard/inquiry-management/total-inquiries` (no URL change; content same or inline) |
| `/dashboard/inquiry-management/total-inquiries` | Pending Approvals | `/dashboard/inquiry-management/total-inquiries` (no URL change; content same or inline) |
| `/dashboard/inquiry-management/total-inquiries` | Total Quote Value | `/dashboard/inquiry-management/total-inquiries` (no URL change; content same or inline) |
| `/dashboard/client-management/regular-clients` | All Bookings | `/dashboard/client-management/regular-clients?tab=allBookings` (no URL change; content same or inline) |
| `/dashboard/client-management/regular-clients` | Invoice & Payment | `/dashboard/client-management/regular-clients?tab=invoiceAndPayment` (no URL change; content same or inline) |
| `/dashboard/client-management/regular-clients` | Customer Requests | `/dashboard/client-management/regular-clients?tab=customerRequests` (no URL change; content same or inline) |
| `/dashboard/client-management/regular-clients` | Regular Customers | `/dashboard/client-management/regular-clients` (no URL change; content same or inline) |
| `/dashboard/client-management/regular-clients` | Contracted Client | `/dashboard/client-management/contracted-clients` – User Management / 48 / Invoice Management |
| `/dashboard/client-management/regular-clients` | International Client | `/dashboard/client-management/international-clients` – 0 / 0 / 0 |
| `/dashboard/client-management/regular-clients` | All Customers | `/dashboard/client-management/regular-clients` (no URL change; content same or inline) |
| `/dashboard/client-management/regular-clients` | Active Customers | `/dashboard/client-management/regular-clients` – Active Customers |
| `/dashboard/client-management/contracted-clients` | User Management | `/dashboard/client-management/contracted-clients?tab=userManagement` (no URL change; content same or inline) |
| `/dashboard/client-management/contracted-clients` | Invoice Management | `/dashboard/client-management/contracted-clients?tab=invoiceManagement` – Invoice & Payment |
| `/dashboard/client-management/contracted-clients` | Client Requests | `/dashboard/client-management/contracted-clients?tab=clientRequests` (no URL change; content same or inline) |
| `/dashboard/client-management/contracted-clients` | New Clients/Onboard | `/dashboard/client-management/contracted-clients?tab=clientOnboard` (no URL change; content same or inline) |
| `/dashboard/vendor-management/vendors` | All Vendors | `/dashboard/vendor-management/vendors` (no URL change; content same or inline) |
| `/dashboard/vendor-management/vendors` | Manage Vendor Requests | `/dashboard/vendor-management/vendors` (no URL change; content same or inline) |
| `/dashboard/vendor-management/vendors` | Vehicles Onboarded | `/dashboard/vendor-management/vendors` (no URL change; content same or inline) |
| `/dashboard/vendor-management/vendors` | Products Linked | `/dashboard/vendor-management/vendors` (no URL change; content same or inline) |
| `/dashboard/service-maintenance/service-requests` | Service Requests | `/dashboard/service-maintenance/service-requests` (no URL change; content same or inline) |
| `/dashboard/service-maintenance/service-requests` | All Service and Maintenance | `/dashboard/service-maintenance/all-service-and-maintenance` – All Scheduled Requests |
| `/dashboard/service-maintenance/service-requests` | Job Tracker | `/dashboard/service-maintenance/service-requests` (no URL change; content same or inline) |
| `/dashboard/service-maintenance/service-requests` | Cost Analytics | `/dashboard/service-maintenance/service-requests` (no URL change; content same or inline) |
| `/dashboard/service-maintenance/service-requests` | All Requests | `/dashboard/service-maintenance/service-requests` (no URL change; content same or inline) |
| `/dashboard/service-maintenance/service-requests` | Under Review | `/dashboard/service-maintenance/service-requests` – Under Review Requests |
| `/dashboard/service-maintenance/service-requests` | Parts Request | `/dashboard/service-maintenance/service-requests` – All Parts Requests |
| `/dashboard/service-maintenance/service-requests` | Approved Requests | navigates in-page (clicked during deep inspection) |
| `/dashboard/service-maintenance/service-requests` | Rejected Requests | navigates in-page (clicked during deep inspection) |
| `/dashboard/service-maintenance/manage-service-type` | All Service Type | `/dashboard/service-maintenance/manage-service-type` (no URL change; content same or inline) |
| `/dashboard/service-maintenance/manage-service-type` | Pre-Departure Checklist | `/dashboard/service-maintenance/manage-service-type` – Pre-Departure Checklist |
| `/dashboard/service-maintenance/manage-service-type` | Post-arrival Checklist | `/dashboard/service-maintenance/manage-service-type` – Post-arrival Checklist |
| `/dashboard/financial-management` | Dashboard | `/dashboard/financial-management` (no URL change; content same or inline) |
| `/dashboard/financial-management` | Masters | `/dashboard/financial-management` (no URL change; content same or inline) |
| `/dashboard/financial-management` | Income | `/dashboard/financial-management` (no URL change; content same or inline) |
| `/dashboard/financial-management` | Expenses | `/dashboard/financial-management` (no URL change; content same or inline) |
| `/dashboard/financial-management` | Receivables | `/dashboard/financial-management` – Corporate Client Ledger |
| `/dashboard/financial-management` | Payables | `/dashboard/financial-management` (no URL change; content same or inline) |
| `/dashboard/financial-management` | Banking | `/dashboard/financial-management` (no URL change; content same or inline) |
| `/dashboard/financial-management` | Assets | `/dashboard/financial-management` (no URL change; content same or inline) |
| `/dashboard/financial-management` | Compliance | `/dashboard/financial-management` (no URL change; content same or inline) |
| `/dashboard/financial-management` | Profitability | `/dashboard/financial-management` (no URL change; content same or inline) |
| `/dashboard/financial-management` | Reports | `/dashboard/financial-management` – 12 / 45 / 02 |
| `/dashboard/financial-management` | More | `/dashboard/financial-management` – ₹1,60,10,452.537 / ₹16,66,268.21 / ₹1,43,44,184.327 |
| `/dashboard/inventory-management/dashboard` | Dashboard | `/dashboard/inventory-management/dashboard` (no URL change; content same or inline) |
| `/dashboard/inventory-management/dashboard` | Manage Inventory | `/dashboard/inventory-management/dashboard` (no URL change; content same or inline) |
| `/dashboard/inventory-management/dashboard` | Purchasing | `/dashboard/inventory-management/dashboard` (no URL change; content same or inline) |
| `/dashboard/inventory-management/dashboard` | Settings | `/dashboard/inventory-management/dashboard` (no URL change; content same or inline) |
| `/dashboard/inventory-management/dashboard` | Reports & Analytics | `/dashboard/inventory-management/dashboard` – Recent Reports |
| `/dashboard/payment-management` | Penalty Slabs | `/dashboard/payment-management` (no URL change; content same or inline) |
| `/dashboard/payment-management` | B2B Rebate Tiers | `/dashboard/payment-management` (no URL change; content same or inline) |
| `/dashboard/payment-management` | B2C Rebate Tiers | `/dashboard/payment-management` (no URL change; content same or inline) |
| `/dashboard/fleet-vehicle-management` | Vehicle Allocation Portal (deep inspection) | `/dashboard/fleet-vehicle-management/vehicle-allocation` |
| `/dashboard/user-management` | Deleted Users | `/dashboard/user-management/user-deleted-list` |
| Employee Management | + Add Employee / + Add New Employee | `/dashboard/employee-management/onboarding` (multi-step form: Previous / Next) |
| `/dashboard/employee-management/totalemployees` | + Add New Employee | `/dashboard/employee-management/onboarding` |
| `/dashboard/employee-management` | + Add Employee | `/dashboard/employee-management/onboarding` |
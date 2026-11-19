"""Screen inventory metadata for Admin Web (observed during read-only exploration, 2026-10-30, Superadmin).

Keys match steps/screens.json (raw inspection files in exploration-logs/raw/inspect/<key>.json).
nav    : how to reach the screen from the sidebar (used in generated steps)
click  : in-page navigation clicks after the route loads (cards / toggle buttons / tabs)
kpis   : summary cards observed on the screen
risky  : controls observed but deliberately NOT clicked (configuration change / bulk / external communication)
"""

MODULES = {
    "Authentication": {"code": "AUTH"},
    "Global Navigation & Header": {"code": "NAV"},
    "Dashboard": {"code": "DASH"},
    "Role & Permission": {"code": "ROLE"},
    "Employee Management": {"code": "EMP"},
    "Fleet & Vehicle Management": {"code": "FLEET"},
    "Booking & Operations": {"code": "BOOK"},
    "Inquiry Management": {"code": "INQ"},
    "Lead Management": {"code": "LEAD"},
    "Client Management": {"code": "CLIENT"},
    "Vendor Management": {"code": "VEND"},
    "Category Management": {"code": "CAT"},
    "Service & Maintenance": {"code": "SERV"},
    "Financial Management": {"code": "FIN"},
    "Inventory Management": {"code": "INV"},
    "Content Management System": {"code": "CMS"},
    "Payment And Refund Management": {"code": "PAY"},
    "End-to-End Workflows": {"code": "E2E"},
}

_FLEET = "expand 'Fleet & Vehicle Management' and click '{}'"
_CLIENT = "expand 'Client Management' and click '{}'"
_VENDOR = "expand 'Vendor Management' and click '{}'"
_CAT = "expand 'Category Management' and click '{}'"
_SERV = "expand 'Service & Maintenance' and click '{}'"
_CMS = "expand 'Content Management System' and click '{}'"


def S(module, submodule, screen, route, nav, **kw):
    return dict(module=module, submodule=submodule, screen=screen, route=route, nav=nav, **kw)


SCREENS = {
    # ---------------- Authentication / global (manual inspection) ----------------
    "auth-login": S("Authentication", "Login", "Login", "/login", "open the Admin Web URL while logged out", manual_only=True, coverage="Fully explored", title="Login"),
    "auth-forgot": S("Authentication", "Forgot Password", "Forgot Password", "/forgot-password", "on /login click 'Forgot Password?'", manual_only=True, coverage="Partially explored"),
    "auth-otp": S("Authentication", "Login with OTP", "Log in with OTP", "/login", "on /login click 'Log in with OTP'", manual_only=True, coverage="Partially explored"),
    "nav-sidebar": S("Global Navigation & Header", "Sidebar", "Sidebar navigation", "(all screens)", "use the left sidebar", manual_only=True, coverage="Fully explored"),
    "nav-header": S("Global Navigation & Header", "Header", "Header (title, notifications, profile)", "(all screens)", "use the top header bar", manual_only=True, coverage="Partially explored"),

    # ---------------- Dashboard ----------------
    "dashboard": S("Dashboard", "", "Dashboard", "/dashboard", "click 'Dashboard' (OVERVIEW)", title="Dashboard",
                   kpis=["On Route Vehicle", "Vehicles Under Maintenance", "Compliance", "Late Vehicle"],
                   tables={0: "All Bus overview table", 1: "Driver Emergency Alerts table", 2: "Refuel Requests table"},
                   deps="Fleet & Vehicle Management, Booking & Operations"),

    # ---------------- Role & Permission ----------------
    "role-users": S("Role & Permission", "User Management", "User Management (All Users)", "/dashboard/user-management", "click 'Role & Permission'", title="Roles & Permission", coverage="Partially explored", deps="Employee Management"),
    "role-roles": S("Role & Permission", "Role Management", "Role Management (All Roles)", "/dashboard/user-management", "click 'Role & Permission'", click=["Role Management"], title="Roles & Permission", coverage="Partially explored"),
    "role-deleted-users": S("Role & Permission", "Deleted Users", "Deleted Users", "/dashboard/user-management", "click 'Role & Permission'", click=["Deleted Users"], title="Roles & Permission"),

    # ---------------- Employee Management ----------------
    "employee-dashboard": S("Employee Management", "Employee Dashboard", "Employee Management dashboard", "/dashboard/employee-management", "click 'Employee Management'", title="Employee Management",
                            kpis=["Total Employees", "All Drivers and Helpers Count", "Client Request Portal", "Incentive Programs", "Sales Incentive Programs", "Employee Onboarding", "Employee Tracker"],
                            tables={0: "Employee list", 1: "Document Expiry Alerts table"}),
    "employee-all": S("Employee Management", "All Employees", "All Employees", "/dashboard/employee-management/totalemployees", "click 'Employee Management', then 'View All Employees'", title="Employee Management"),
    "employee-onboarding": S("Employee Management", "Employee Onboarding", "Employee Onboarding", "/dashboard/employee-management", "click 'Employee Management'", click=["Employee Onboarding"], title="Employee Management"),
    "employee-roster": S("Employee Management", "Operations Roster", "Operations Roster", "/dashboard/employee-management", "click 'Employee Management'", click=["Operations Roster"], title="Employee Management",
                         kpis=["Employees Scheduled Today", "Coverage % vs Required", "Shortage"]),
    "employee-client-request": S("Employee Management", "Client Request", "Client Request", "/dashboard/employee-management", "click 'Employee Management'", click=["Client Request"], title="Employee Management",
                                 kpis=["Total Bookings", "Open Requests", "High Priority", "Completion Rate"]),
    "employee-hr-overview": S("Employee Management", "HR Overview", "HR Overview", "/dashboard/employee-management", "click 'Employee Management'", click=["HR Overview"], title="Employee Management",
                              kpis=["Retention Rate", "Complaints", "Onboarding Progress", "Headcount by Department", "Diversity Count Snapshot"]),

    # ---------------- Fleet & Vehicle Management ----------------
    "fleet-portal": S("Fleet & Vehicle Management", "Fleet & Vehicles", "Vehicle Management Portal", "/dashboard/fleet-vehicle-management", _FLEET.format("Fleet & Vehicles"), title="Vehicle Management Portal",
                      kpis=["Total Buses / Active", "Approved & Track Live Trips", "Vehicle Allocation Portal", "Tarrif Management"]),
    "fleet-total-buses": S("Fleet & Vehicle Management", "Fleet & Vehicles", "Total Buses / Active", "/dashboard/fleet-vehicle-management", _FLEET.format("Fleet & Vehicles"), click=["Total Buses / Active"], title="Vehicle Management Portal"),
    "fleet-live-trips": S("Fleet & Vehicle Management", "Fleet & Vehicles", "Approved & Track Live Trips", "/dashboard/fleet-vehicle-management", _FLEET.format("Fleet & Vehicles"), click=["Approved & Track Live Trips"], title="Vehicle Management Portal", deps="Booking & Operations"),
    "fleet-allocation-portal": S("Fleet & Vehicle Management", "Fleet & Vehicles", "Vehicle Allocation Portal", "/dashboard/fleet-vehicle-management", _FLEET.format("Fleet & Vehicles"), click=["Vehicle Allocation Portal"], title="Vehicle Management Portal", deps="Booking & Operations"),
    "fleet-tariff": S("Fleet & Vehicle Management", "Fleet & Vehicles", "Tariff Management", "/dashboard/fleet-vehicle-management/tarrifs", _FLEET.format("Fleet & Vehicles") + ", then the 'Tarrif Management' card", title="Tariff Management", deps="Inquiry Management (quotations), Bus Types"),
    "fleet-bus-types": S("Fleet & Vehicle Management", "Bus Types", "Bus Types", "/dashboard/fleet-vehicle-management/bus-types", _FLEET.format("Bus Types"), title="Bus Types", deps="Bus Manufacturers, Bus Models, Seat Types",
                         risky={"Sync WhatsApp Catalog": dict(objective="Verify bus types are pushed to the WhatsApp catalog.", steps=["Click 'Sync WhatsApp Catalog'.", "Confirm if prompted."], expected=["A success/progress message is shown.", "Active bus types appear in the WhatsApp Business catalog (external system – verify with business team)."]),
                                "Clear Catalog": dict(objective="Verify the WhatsApp catalog can be cleared.", steps=["Click 'Clear Catalog'.", "Observe the confirmation prompt; cancel it first, then (only with approval) confirm."], expected=["A confirmation prompt appears before clearing (Needs Verification).", "Cancelling leaves the catalog unchanged; confirming removes all catalog items."], type="Negative"),
                                "Clear Catalog and Sync": dict(objective="Verify clear + re-sync rebuilds the WhatsApp catalog.", steps=["Click 'Clear Catalog and Sync'.", "Confirm if prompted."], expected=["Catalog is emptied then re-populated with current active bus types; success message shown."])}),
    "fleet-bus-manufacturers": S("Fleet & Vehicle Management", "Bus Manufacturers", "Bus Manufacturers", "/dashboard/fleet-vehicle-management/bus-manufacturer", _FLEET.format("Bus Manufacturers"), title="Bus Manufacturers", deps="Bus Models, Bus Types"),
    "fleet-bus-models": S("Fleet & Vehicle Management", "Bus Models", "Bus Models", "/dashboard/fleet-vehicle-management/bus-modal-page", _FLEET.format("Bus Models"), title="Bus Models", deps="Bus Manufacturers, Bus Types"),
    "fleet-seat-types": S("Fleet & Vehicle Management", "Seat Types", "Seat Types", "/dashboard/fleet-vehicle-management/seat-type", _FLEET.format("Seat Types"), title="Seat Types", deps="Bus Types"),

    # ---------------- Booking & Operations ----------------
    "booking-pre-bookings": S("Booking & Operations", "Pre-Bookings", "Booking & Operations – Pre-Bookings", "/dashboard/booking-management/total-booking", "click 'Booking & Operations'", title="Booking & Operations",
                              kpis=["Total Bookings", "Live Trips", "Upcoming Trips", "Pending Vehicle Allocations"], deps="Inquiry Management, Client Management, Fleet"),
    "booking-booked": S("Booking & Operations", "Booked", "Booking & Operations – Booked", "/dashboard/booking-management/total-booking", "click 'Booking & Operations'", click=["Booked"], title="Booking & Operations"),
    "booking-completed": S("Booking & Operations", "Completed", "Booking & Operations – Completed", "/dashboard/booking-management/total-booking", "click 'Booking & Operations'", click=["Completed"], title="Booking & Operations"),
    "booking-pending-allocation": S("Booking & Operations", "Pending Vehicle Allocations", "Allocation Portal", "/dashboard/booking-management/pending-allocation", "click 'Booking & Operations', then the 'Pending Vehicle Allocations' card", title="Booking & Operations", deps="Fleet & Vehicle Management"),

    # ---------------- Inquiry / Lead ----------------
    "inquiry-all": S("Inquiry Management", "All Inquiries", "Inquiry Management", "/dashboard/inquiry-management/total-inquiries", "click 'Inquiry Management'", title="Inquiry Management",
                     kpis=["Total Inquiries", "Conversion Rate", "Pending Approvals", "Total Quote Value"], deps="Client Management, Tariff Management, Booking & Operations"),
    "lead-all": S("Lead Management", "All Leads", "Lead Management", "/dashboard/lead-management/total-lead", "click 'Lead Management'", title="Lead Management", deps="Employee Management (Assigned To), Inquiry Management"),

    # ---------------- Client Management ----------------
    "client-regular": S("Client Management", "Regular Customers", "All Regular Customers", "/dashboard/client-management/regular-clients", _CLIENT.format("Client Management"), title="Client Management",
                        kpis=["All Bookings", "Invoice & Payment", "Customer Requests"], deps="Manage Client (categories), Booking & Operations"),
    "client-regular-all-bookings": S("Client Management", "Regular Customers", "Regular – All Bookings", "/dashboard/client-management/regular-clients?tab=allBookings", _CLIENT.format("Client Management") + ", then the 'All Bookings' card", title="Client Management", deps="Booking & Operations"),
    "client-regular-invoice-payment": S("Client Management", "Regular Customers", "Regular – Invoice & Payment", "/dashboard/client-management/regular-clients?tab=invoiceAndPayment", _CLIENT.format("Client Management") + ", then the 'Invoice & Payment' card", title="Client Management", deps="Financial Management"),
    "client-regular-customer-requests": S("Client Management", "Regular Customers", "Regular – Customer Requests", "/dashboard/client-management/regular-clients?tab=customerRequests", _CLIENT.format("Client Management") + ", then the 'Customer Requests' card", title="Client Management", deps="Request Category"),
    "client-contracted": S("Client Management", "Contracted Clients", "All Clients (Contracted)", "/dashboard/client-management/contracted-clients", _CLIENT.format("Client Management") + ", then the 'Contracted Client' toggle", title="Client Management",
                           kpis=["User Management", "Invoice Management", "Client Requests", "New Clients/Onboard"]),
    "client-contracted-user-mgmt": S("Client Management", "Contracted Clients", "Contracted – User Management", "/dashboard/client-management/contracted-clients?tab=userManagement", _CLIENT.format("Client Management") + ", 'Contracted Client', then the 'User Management' card", title="Client Management"),
    "client-contracted-invoice-mgmt": S("Client Management", "Contracted Clients", "Contracted – Invoice & Payment", "/dashboard/client-management/contracted-clients?tab=invoiceManagement", _CLIENT.format("Client Management") + ", 'Contracted Client', then the 'Invoice Management' card", title="Client Management", deps="Financial Management"),
    "client-contracted-client-requests": S("Client Management", "Contracted Clients", "Contracted – Client Requests", "/dashboard/client-management/contracted-clients?tab=clientRequests", _CLIENT.format("Client Management") + ", 'Contracted Client', then the 'Client Requests' card", title="Client Management", deps="Request Category"),
    "client-contracted-onboard": S("Client Management", "Contracted Clients", "Contracted – New Clients/Onboard", "/dashboard/client-management/contracted-clients?tab=clientOnboard", _CLIENT.format("Client Management") + ", 'Contracted Client', then the 'New Clients/Onboard' card", title="Client Management"),
    "client-international": S("Client Management", "International Clients", "International Clients", "/dashboard/client-management/international-clients", _CLIENT.format("Client Management") + ", then the 'International Client' toggle", title="Client Management"),
    "client-trip-wise": S("Client Management", "Trip Wise Client", "Trip Wise Clients", "/dashboard/client-management/trip-wise-client", _CLIENT.format("Trip Wise Client"), title="Client Management"),
    "client-manage-client": S("Client Management", "Manage Client", "Manage Client (Client Categories)", "/dashboard/client-management/manage-client", _CLIENT.format("Manage Client"), title="Manage Client", deps="Regular/Contracted clients (Client Category)"),
    "client-request-category": S("Client Management", "Request Category", "Request Category", "/dashboard/client-management/request-category", _CLIENT.format("Request Category"), title="Request Category", deps="Customer/Client Requests"),

    # ---------------- Vendor Management ----------------
    "vendor-all": S("Vendor Management", "Vendors", "All Vendors", "/dashboard/vendor-management/vendors", _VENDOR.format("Vendor Management"), title="Vendor Management",
                    kpis=["All Vendors", "Manage Vendor Requests", "Vehicles Onboarded", "Products Linked"], deps="Category Management (vendor type), Inventory"),
    "vendor-requests": S("Vendor Management", "Vendors", "Manage Vendor Requests", "/dashboard/vendor-management/vendors", _VENDOR.format("Vendor Management"), click=["Manage Vendor Requests"], title="Vendor Management", deps="Manage Request Type"),
    "vendor-vehicles-onboarded": S("Vendor Management", "Vendors", "Vehicles Onboarded", "/dashboard/vendor-management/vendors", _VENDOR.format("Vendor Management"), click=["Vehicles Onboarded"], title="Vendor Management", deps="Fleet & Vehicle Management"),
    "vendor-products-linked": S("Vendor Management", "Vendors", "Products Linked", "/dashboard/vendor-management/vendors", _VENDOR.format("Vendor Management"), click=["Products Linked"], title="Vendor Management", deps="Inventory Management"),
    "vendor-request-type": S("Vendor Management", "Manage Request Type", "Manage Request Type", "/dashboard/vendor-management/manage-request-type", _VENDOR.format("Manage Request Type"), title="Manage Request Type"),
    "vendor-deactivated": S("Vendor Management", "Deactivated Vendors", "Deactivated Vendors", "/dashboard/vendor-management/deactivated-vendors", _VENDOR.format("Deactivated Vendors"), title="Deactivated Vendors",
                            risky={"Activate Vendor": dict(objective="Verify a deactivated vendor can be re-activated.", steps=["On a test vendor row click 'Activate Vendor'.", "Confirm if prompted."], expected=["The vendor disappears from Deactivated Vendors and appears in All Vendors with status Active.", "Deactivated Vendors total decreases by 1."])}),

    # ---------------- Category Management ----------------
    "category-main": S("Category Management", "Main Category", "Main Category", "/dashboard/category-management/main-category", _CAT.format("Main Category"), title="Main Category", deps="Sub Category, Manage Unit Type (UoM), Vendor type"),
    "category-sub": S("Category Management", "Sub Category", "Sub Category", "/dashboard/category-management/sub-category", _CAT.format("Sub Category"), title="Sub Category", deps="Main Category, Manage Unit Type"),
    "category-unit-type": S("Category Management", "Manage Unit Type", "Unit Type", "/dashboard/category-management/manage-unit-type", _CAT.format("Manage Unit Type"), title="Manage Unit Type", deps="Main/Sub Category Default UoM, Inventory"),

    # ---------------- Service & Maintenance ----------------
    "service-requests": S("Service & Maintenance", "Service Requests", "All Service Requests", "/dashboard/service-maintenance/service-requests", _SERV.format("Service & Maintenance"), title="Service & Maintenance",
                          kpis=["Service Requests", "All Service and Maintenance", "Job Tracker", "Cost Analytics"], deps="Fleet (vehicles), Manage Service Type, Inventory (parts)"),
    "service-under-review": S("Service & Maintenance", "Service Requests", "Under Review Requests", "/dashboard/service-maintenance/service-requests", _SERV.format("Service & Maintenance"), click=["Under Review"], title="Service & Maintenance"),
    "service-parts-request": S("Service & Maintenance", "Service Requests", "All Parts Requests", "/dashboard/service-maintenance/service-requests", _SERV.format("Service & Maintenance"), click=["Parts Request"], title="Service & Maintenance", deps="Inventory Management"),
    "service-approved": S("Service & Maintenance", "Service Requests", "Approved Requests", "/dashboard/service-maintenance/service-requests", _SERV.format("Service & Maintenance"), click=["Approved Requests"], title="Service & Maintenance"),
    "service-rejected": S("Service & Maintenance", "Service Requests", "Rejected Requests", "/dashboard/service-maintenance/service-requests", _SERV.format("Service & Maintenance"), click=["Rejected Requests"], title="Service & Maintenance"),
    "service-job-tracker": S("Service & Maintenance", "Service Requests", "Job Tracker", "/dashboard/service-maintenance/service-requests", _SERV.format("Service & Maintenance"), click=["Job Tracker"], title="Service & Maintenance"),
    "service-cost-analytics": S("Service & Maintenance", "Service Requests", "Cost Analytics", "/dashboard/service-maintenance/service-requests", _SERV.format("Service & Maintenance"), click=["Cost Analytics"], title="Service & Maintenance"),
    "service-all-scheduled": S("Service & Maintenance", "All Service and Maintenance", "All Scheduled Requests", "/dashboard/service-maintenance/all-service-and-maintenance", _SERV.format("Service & Maintenance") + ", then the 'All Service and Maintenance' card", title="Service & Maintenance"),
    "service-type-all": S("Service & Maintenance", "Manage Service Type", "All Service Type", "/dashboard/service-maintenance/manage-service-type", _SERV.format("Manage Service Type"), title="Service & Maintenance", deps="Service Requests"),
    "service-type-pre-departure": S("Service & Maintenance", "Manage Service Type", "Pre-Departure Checklist", "/dashboard/service-maintenance/manage-service-type", _SERV.format("Manage Service Type"), click=["Pre-Departure Checklist"], title="Service & Maintenance", deps="Driver/Ops app trip checklist"),
    "service-type-post-arrival": S("Service & Maintenance", "Manage Service Type", "Post-arrival Checklist", "/dashboard/service-maintenance/manage-service-type", _SERV.format("Manage Service Type"), click=["Post-arrival Checklist"], title="Service & Maintenance", deps="Driver/Ops app trip checklist"),

    # ---------------- Financial Management ----------------
    "finance-dashboard": S("Financial Management", "Dashboard", "Financial Dashboard", "/dashboard/financial-management", "click 'Financial Management'", title="Financial Management"),
    "finance-masters": S("Financial Management", "Masters", "Masters", "/dashboard/financial-management", "click 'Financial Management'", click=["Masters"], title="Financial Management"),
    "finance-income": S("Financial Management", "Income", "Income", "/dashboard/financial-management", "click 'Financial Management'", click=["Income"], title="Financial Management", deps="Booking & Operations, Client invoices"),
    "finance-expenses": S("Financial Management", "Expenses", "Expenses", "/dashboard/financial-management", "click 'Financial Management'", click=["Expenses"], title="Financial Management", deps="Service & Maintenance, Inventory purchasing"),
    "finance-receivables": S("Financial Management", "Receivables", "Receivables", "/dashboard/financial-management", "click 'Financial Management'", click=["Receivables"], title="Financial Management", deps="Client Management invoices"),
    "finance-payables": S("Financial Management", "Payables", "Payables", "/dashboard/financial-management", "click 'Financial Management'", click=["Payables"], title="Financial Management", deps="Vendor Management"),
    "finance-banking": S("Financial Management", "Banking", "Banking", "/dashboard/financial-management", "click 'Financial Management'", click=["Banking"], title="Financial Management"),
    "finance-assets": S("Financial Management", "Assets", "Assets", "/dashboard/financial-management", "click 'Financial Management'", click=["Assets"], title="Financial Management", deps="Fleet & Vehicle Management"),
    "finance-compliance": S("Financial Management", "Compliance", "Compliance", "/dashboard/financial-management", "click 'Financial Management'", click=["Compliance"], title="Financial Management"),
    "finance-profitability": S("Financial Management", "Profitability", "Profitability", "/dashboard/financial-management", "click 'Financial Management'", click=["Profitability"], title="Financial Management"),
    "finance-reports": S("Financial Management", "Reports", "Reports", "/dashboard/financial-management", "click 'Financial Management'", click=["Reports"], title="Financial Management"),
    "finance-more": S("Financial Management", "More", "More", "/dashboard/financial-management", "click 'Financial Management'", click=["More"], title="Financial Management"),

    # ---------------- Inventory Management ----------------
    "inventory-dashboard": S("Inventory Management", "Dashboard", "Inventory Dashboard", "/dashboard/inventory-management/dashboard", "click 'Inventory Management'", title="Inventory Management",
                             kpis=["Current Stock Value", "Total Stock Items", "Low Stock Alerts", "Pending PRs", "Pending POs", "Stock Issued This Month", "Items Awaiting QC", "Pending Internal Requests"], deps="Category Management, Vendor Management"),
    "inventory-manage": S("Inventory Management", "Manage Inventory", "Manage Inventory", "/dashboard/inventory-management/dashboard", "click 'Inventory Management'", click=["Manage Inventory"], title="Inventory Management"),
    "inventory-purchasing": S("Inventory Management", "Purchasing", "Purchasing", "/dashboard/inventory-management/dashboard", "click 'Inventory Management'", click=["Purchasing"], title="Inventory Management", deps="Vendor Management, Financial Payables"),
    "inventory-settings": S("Inventory Management", "Settings", "Inventory Settings", "/dashboard/inventory-management/dashboard", "click 'Inventory Management'", click=["Settings"], title="Inventory Management"),
    "inventory-reports": S("Inventory Management", "Reports & Analytics", "Reports & Analytics", "/dashboard/inventory-management/dashboard", "click 'Inventory Management'", click=["Reports & Analytics"], title="Inventory Management"),

    # ---------------- CMS ----------------
    "cms-popular-routes": S("Content Management System", "Popular Routes", "Popular Routes", "/dashboard/content-management-system/popular-routes", _CMS.format("Popular Routes"), title="Content Management System", deps="Banni customer app (home screen)"),
    "cms-service-category": S("Content Management System", "Popular Service Category", "Popular Service Category", "/dashboard/content-management-system/popular-service-category", _CMS.format("Popular Service Category"), title="Popular Service Category", deps="Popular Service Sub Category"),
    "cms-service-sub-category": S("Content Management System", "Popular Service Sub Category", "Popular Service Sub Category", "/dashboard/content-management-system/popular-service-sub-category", _CMS.format("Popular Service Sub Category"), title="Popular Service Sub Category", deps="Popular Service Category"),
    "cms-service-route": S("Content Management System", "Popular Service Route", "Popular Service Route", "/dashboard/content-management-system/popular-service-route", _CMS.format("Popular Service Route"), title="Popular Service Route", deps="Popular Routes"),
    "cms-why-required": S("Content Management System", "Popular Service Why Required", "Popular Service Why Required", "/dashboard/content-management-system/popular-service-why-required", _CMS.format("Popular Service Why Required"), title="Popular Service Why Required", deps="Popular Service Sub Category"),
    "cms-required-for": S("Content Management System", "Popular Service Required For", "Popular Service Required For", "/dashboard/content-management-system/popular-service-required-for", _CMS.format("Popular Service Required For"), title="Popular Service Required For", deps="Popular Service Sub Category"),
    "cms-whatsapp-faq": S("Content Management System", "WhatsApp FAQ", "WhatsApp FAQ", "/dashboard/content-management-system/whatsapp-faq", _CMS.format("WhatsApp FAQ"), title="WhatsApp FAQ", deps="WhatsApp bot (external)"),
    "cms-app-force-update-user": S("Content Management System", "App Force Update", "App Force Update – User App", "/dashboard/content-management-system/app-force-update", _CMS.format("App Force Update"), title="Content Management System", deps="Banni (User App) mobile clients",
                                   risky={"Save Changes": dict(objective="Verify version-control settings for the User App are saved.", steps=["Change Android/iOS minimum/latest version, force-update toggle, store URL or message.", "Click 'Save Changes'."], expected=["Success message; values persist after refresh.", "User App installs below the minimum version show the force-update prompt with the configured message and store link (verify on device)."], type="Integration")}),
    "cms-app-force-update-ops": S("Content Management System", "App Force Update", "App Force Update – Internal Ops App", "/dashboard/content-management-system/app-force-update", _CMS.format("App Force Update"), click=["Internal Ops App"], title="Content Management System", deps="Saagane (Internal Ops App) mobile clients",
                                  risky={"Save Changes": dict(objective="Verify version-control settings for the Internal Ops App are saved independently of the User App.", steps=["Change a value on the Internal Ops App tab.", "Click 'Save Changes'.", "Switch to the User App tab."], expected=["Internal Ops App values are saved; User App values are unchanged.", "Saagane installs below the minimum version are forced to update (verify on device)."], type="Integration")}),
    "cms-marketing-notification": S("Content Management System", "Marketing Notification", "Marketing Notification", "/dashboard/content-management-system/marketing-notification", _CMS.format("Marketing Notification"), title="Marketing Notification", deps="Banni customer app push notifications",
                                    risky={"Send Notification": dict(objective="Verify a marketing push notification is delivered to the selected customers only.", steps=["Select a single internal QA customer in 'Search and select customers'.", "Enter a title/message clearly marked QA-TEST.", "Click 'Send Notification'."], expected=["Success message is shown.", "Only the selected QA customer receives the push notification on the Banni app.", "No notification reaches other customers."], type="Integration"),
                                           "Select All Filtered": dict(objective="Verify 'Select All Filtered' selects every customer matching the current filter (no send).", steps=["Apply a filter.", "Click 'Select All Filtered'.", "Do NOT click Send; click 'Reset'."], expected=["All filtered customers are selected (count shown – Needs Verification).", "'Reset' clears the selection and message fields."], type="Positive", priority="Medium")}),
    "cms-privacy-policy": S("Content Management System", "Privacy & Terms", "Privacy Policy", "/dashboard/content-management-system/policies-and-info", _CMS.format("Privacy & Terms"), title="Content Management System", deps="Banni / Saagane in-app legal pages",
                            risky={"Save Privacy Policy": dict(objective="Verify Privacy Policy content edits are saved and published.", steps=["Edit the Privacy Policy text in the editor.", "Click 'Save Privacy Policy'."], expected=["Success message; content persists after refresh.", "Updated policy is displayed in the customer app (verify on device)."], type="Integration")}),
    "cms-terms": S("Content Management System", "Privacy & Terms", "Terms & Conditions", "/dashboard/content-management-system/policies-and-info", _CMS.format("Privacy & Terms"), click=["Terms & Conditions"], title="Content Management System", deps="Banni / Saagane in-app legal pages"),

    # ---------------- Payment & Refund ----------------
    "payment-penalty-slabs": S("Payment And Refund Management", "Penalty Slabs", "Cancellation Penalty Slabs", "/dashboard/payment-management", "click 'Payment And Refund Management'", title="Payment And Refund Management", deps="Booking cancellation (Cancel Trip) refunds",
                               risky={"Bulk Update": dict(objective="Verify multiple slabs can be updated together.", steps=["Click 'Bulk Update'.", "Review the bulk editor; change one test slab only.", "Save."], expected=["Only the changed slab is updated; others unchanged.", "Overlapping hour ranges are rejected (Needs Verification)."])}),
    "payment-b2b-rebate": S("Payment And Refund Management", "B2B Rebate Tiers", "B2B Rebate Tiers", "/dashboard/payment-management", "click 'Payment And Refund Management'", click=["B2B Rebate Tiers"], title="Payment And Refund Management", deps="Contracted clients (B2B)"),
    "payment-b2c-rebate": S("Payment And Refund Management", "B2C Rebate Tiers", "B2C Rebate Tiers", "/dashboard/payment-management", "click 'Payment And Refund Management'", click=["B2C Rebate Tiers"], title="Payment And Refund Management", deps="Regular customers (B2C)"),

    # ---------------- E2E placeholder screen ----------------
    "e2e": S("End-to-End Workflows", "Cross-module", "Cross-module workflow", "(multiple)", "follow the steps", manual_only=True, coverage="Workflow"),
}

import frappe

def report(doc, method):
    frappe.logger().debug(f"Before insert: {doc.name}")
    fetch_and_append_employees(doc)

def fetch_and_append_employees(doc):
    if doc.route_id:
        frappe.logger().debug(f"Fetching employees for route_id: {doc.route_id}")
        route_requests = frappe.get_list('FM_Travel_Route_Request', 
                                         filters={'route_id': doc.route_id}, 
                                         fields=['name', 'employee_name'])

        frappe.logger().debug(f"Route requests found: {route_requests}")
        doc.set('onboarded_employees', [])

        for request in route_requests:
            frappe.logger().debug(f"Appending request: {request['name']}")
            doc.append('onboarded_employees', {
                'employee_email': request['name'],
                'employee_name': request['employee_name'],
                'attendance': 'Absent'
            })

def auto_append_route_points(doc, method):
    if not doc.route:
        doc.route = []
    
    update_needed = False
    
    # Check if start point needs to be added
    if not doc.route or doc.route[0].get('location_name') != doc.start_point:
        start_route = frappe.new_doc("FM_Route")
        start_route.location_name = doc.start_point
        start_route.parent = doc.name
        start_route.parentfield = 'route'
        start_route.parenttype = 'FM_Route_ID'
        doc.route.insert(0, start_route)
        update_needed = True
    
    # Check if end point needs to be added
    if not doc.route or doc.route[-1].get('location_name') != doc.end_point:
        end_route = frappe.new_doc("FM_Route")
        end_route.location_name = doc.end_point
        end_route.parent = doc.name
        end_route.parentfield = 'route'
        end_route.parenttype = 'FM_Route_ID'
        doc.route.append(end_route)
        update_needed = True
    
    # If an update was needed, add a message
    if update_needed:
        frappe.msgprint("Start point and/or end point have been appended to the route table.")

def sync_to_fm_request_master(doc, method):
    # Define the mapping of doctypes and their specific fields to sync
    doctype_field_mapping = {
        "FM_Passenger_Vehicle_Request": ["project_name", "employee_name", "employee_email", "type", "doctypename", "status", "reports_to", "reason", "bill_amount", "payment_status"],
        "FM_Goods_Vehicle_Request": ["project_name", "employee_name", "employee_email", "type", "doctypename", "status", "reports_to", "reason", "bill_amount", "payment_status"],
        "FM_Equipment_Vehicle_Request": ["project_name", "employee_name", "employee_email", "type", "doctypename", "status", "reports_to", "reason", "bill_amount", "payment_status"],
        "FM_Group_Vehicle_Request": ["project_name", "employee_name", "employee_email", "type", "doctypename", "status", "reports_to", "reason", "bill_amount", "payment_status"]
    }
    
    # Check if the current doctype is in the mapping
    if doc.doctype in doctype_field_mapping:
        # Prepare data for FM_Request_Master
        master_data = {
            "doctype": "FM_Request_Master",
            "request_id": doc.name,  # Use the name of the current document as requestid
        }
        
        # Populate fields from the current document
        for field in doctype_field_mapping[doc.doctype]:
            if hasattr(doc, field):
                master_data[field] = getattr(doc, field)
            else:
                master_data[field] = None  # Set to None if field doesn't exist
        
        
        # Check if a PR_Request_Master document already exists
        existing_master = frappe.db.exists("FM_Request_Master", {"request_id": doc.name})
        
        if existing_master:
            # Update existing document
            existing_doc = frappe.get_doc("FM_Request_Master", existing_master)
            existing_doc.update(master_data)
            existing_doc.save(ignore_permissions=True)
        else:
            # Create new document
            new_master = frappe.get_doc(master_data)
            new_master.insert(ignore_permissions=True)
        
        frappe.db.commit()

def before_insert(doc, method):
    if doc.project_name:
        if doc.project_name.lower() == 'general':
            # For General project, fetch department lead's email
            if doc.department:
                doc.reports_to = frappe.db.get_value('RM_Department', 
                                                     {'name': doc.department}, 
                                                     'employee_email') or ''
            else:
                doc.reports_to = ''
        else:
            # Fetch Project Lead's email ID based on the project name
            doc.reports_to = frappe.db.get_value('RM_Project_Lead', 
                                                 {'name': doc.project_name, 'project_status': 'Active'}, 
                                                 'project_lead_email') or ''

        # Set status based on reports_to
        if doc.employee_email == doc.reports_to:
            doc.status = 'Project Lead Approved'
        else:
            doc.status = 'Pending'
    else:
        # If no project is specified
        doc.reports_to = ''
        doc.status = 'Pending'

    # # Remove duplicate email from reports_to if it's the same as reports_head
    # if doc.reports_to.strip() == doc.reports_head.strip():
    #     doc.reports_head = ''

def autofill(doc, method):
    if doc.employee_email:
        department_name = frappe.db.get_value('Employee', 
                                              {'user_id': doc.employee_email}, 
                                              'department')
        if department_name:
            doc.department = department_name

def call(doc, method):
    autofill(doc, method)
    before_insert(doc, method)

def restrict_duplicate(doc, method):
    # Define the fields to check for duplicates
    duplicate_fields = ['employee_email', 'from_location', 'to_location', 'request_date_time']

    # Build the filters dictionary
    filters = {field: doc.get(field) for field in duplicate_fields}

    # Check if a document with the same field values already exists
    existing_doc = frappe.db.get_value(doc.doctype, filters, ['name', 'status'])
    if existing_doc:
        existing_doc_name, existing_doc_status = existing_doc
        if existing_doc_status not in ['Rejected', 'Cancelled'] and existing_doc_name != doc.name:
            frappe.throw(f"A Request with the same date already exists for the Employee. Request ID: {existing_doc_name}")

@frappe.whitelist()
def before_save(doc, method):
    restrict_duplicate(doc, method)

def equipment_duplicate(doc, method):
    # Define the fields to check for duplicates
    duplicate_fields = ['employee_email', 'from_time', 'to_time', 'request_date_time']

    # Build the filters dictionary
    filters = {field: doc.get(field) for field in duplicate_fields}

    # Check if a document with the same field values already exists
    existing_doc = frappe.db.get_value(doc.doctype, filters, ['name', 'status'])
    if existing_doc:
        existing_doc_name, existing_doc_status = existing_doc
        if existing_doc_status not in ['Rejected', 'Cancelled'] and existing_doc_name != doc.name:
            frappe.throw(f"A Request with the same date already exists for the Employee. Request ID: {existing_doc_name}")

@frappe.whitelist()
def before_save_eq(doc, method):
    equipment_duplicate(doc, method)
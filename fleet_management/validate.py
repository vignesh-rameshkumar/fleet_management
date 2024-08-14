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

def sync_to_fm_request_master(doc, method):
    # Define the mapping of doctypes and their specific fields to sync
    doctype_field_mapping = {
        "FM_Passenger_Vehicle_Request": ["project_name", "employee_name", "type", "status", "reports_to", "reports_head", "bill_amount", "payment_status"],
        "FM_Goods_Vehicle_Request": ["project_name", "employee_name", "type", "status", "reports_to", "reports_head", "bill_amount", "payment_status"],
        "FM_Equipment_Vehicle_Request": ["project_name", "employee_name", "type", "status", "reports_to", "reports_head", "bill_amount", "payment_status"],
        "FM_Group_Vehicle_Request": ["project_name", "employee_name", "type", "status", "reports_to", "reports_head", "bill_amount", "payment_status"]
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
            # For General project, set reports_to to blank
            doc.reports_to = ''
        else:
            # Fetch Project Lead's email ID based on the project name
            project_lead_email = frappe.db.get_value('RM_Project_Lead', 
                                                     {'name': doc.project_name, 'project_status': 'Active'}, 
                                                     'project_lead_email')
            doc.reports_to = project_lead_email or ''
        
        # Fetch Department Lead's email ID
        if doc.department:
            department_lead_email = frappe.db.get_value('RM_Department', 
                                                        {'name': doc.department}, 
                                                        'employee_email')
            doc.reports_head = department_lead_email or ''
        else:
            doc.reports_head = ''
        
        # Remove duplicate email from reports_to if it's the same as reports_head
        if doc.reports_to.strip() == doc.reports_head.strip():
            doc.reports_head = ''
        
        # Set status based on department, reports_to and reports_head
        if doc.reports_head == doc.employee_email:
            doc.status = 'Department Lead Approved'
        elif doc.reports_to == doc.employee_email:
            doc.status = 'Project Lead Approved'
        elif doc.reports_to and doc.reports_head:
            doc.status = 'Pending'
        elif not doc.reports_to or doc.reports_to == doc.reports_head:
            doc.status = 'Project Lead Approved'
        else:
            # Default status if none of the above conditions are met
            doc.status = 'Pending'
    else:
        # If no project is specified, ensure reports_to is empty
        doc.reports_to = ''
        # Fetch Department Lead's email ID even if no project is specified
        if doc.department:
            department_lead_email = frappe.db.get_value('RM_Department', 
                                                        {'name': doc.department}, 
                                                        'employee_email')
            doc.reports_head = department_lead_email or ''
        else:
            doc.reports_head = ''
        # Set status based on department
        doc.status = 'Department Lead Approved' if not doc.department else 'Pending'

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
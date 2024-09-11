import frappe
from frappe import _

@frappe.whitelist()
def get_all_travel_route_reports():
    # Fetch all documents of the FM_Travel_Route_Report doctype where ride_status is "Completed"
    route_reports = frappe.get_all("FM_Travel_Route_Report", 
                                   filters={"ride_status": "Completed"}, 
                                   fields=["name", "date_time", "route_id", "bill_amount"])
    
    results = []

    # Iterate over each route report
    for report in route_reports:
        # Apply the filter to check if `bill_amount` is None, empty, or zero
        if not report.bill_amount:  # This checks for None, empty, or zero
            # Fetch the route_id document to access start_point and end_point fields
            route_doc = frappe.get_doc("FM_Route_ID", report.route_id)
            start_point = route_doc.start_point
            end_point = route_doc.end_point

            # Fetch the FM_Travel_Route_Report document to access child table data
            route_report_doc = frappe.get_doc("FM_Travel_Route_Report", report.name)
            
            # Get child table data
            onboarded_employees = route_report_doc.onboarded_employees
            total_employees = len(onboarded_employees)
            
            # Count the number of employees with "Present" attendance
            present_count = sum(1 for employee in onboarded_employees if employee.attendance == "Present")
            
            # Prepare result for the current route report
            result = {
                "name": report.name,
                "date_time": report.date_time,
                "route_id": report.route_id,
                "start_point": start_point,
                "end_point": end_point,
                "total_employees": total_employees,
                "present_count": present_count
            }
            
            results.append(result)

    # Return the list of results
    return results

@frappe.whitelist()
def get_combined_document_data(doctype_name, document_name):
    # Fetch the specified document from the given doctype
    try:
        doc = frappe.get_doc(doctype_name, document_name)
    except frappe.DoesNotExistError:
        frappe.throw(_("Document not found"), frappe.DoesNotExistError)

    # Convert the document fields to a dictionary
    doc_data = doc.as_dict()

    # Search in FM_Bills doctype using Request ID
    bills = frappe.get_all("FM_Bills", filters={"request_id": document_name}, fields=["*"])

    # Initialize list to store bills with child data
    bills_with_child_data = []

    for bill in bills:
        # Fetch the full document for FM_Bills to access child tables
        bill_doc = frappe.get_doc("FM_Bills", bill.name)
        
        # Convert bill document to a dictionary
        bill_data = bill_doc.as_dict()

        # Get child table data from FM_Bill_Parameters
        bill_parameters = bill_doc.get("fm_bill_parameters", [])
        bill_data["fm_bill_parameters"] = bill_parameters
        
        # Append the bill with its child data to the list
        bills_with_child_data.append(bill_data)

    # Prepare the result by combining the document data with the bills and their child data
    combined_result = {
        "document_data": doc_data,
        "bills_data": bills_with_child_data
    }

    # Return the combined result
    return combined_result
@frappe.whitelist()
def get_travel_route_report_by_email(employee_email):
    results = []

    # Fetch all child records from FM_Travel_Route_Members where employee_email matches
    child_records = frappe.get_all("FM_Travel_Route_Members", 
                                   filters={"employee_email": employee_email},
                                   fields=["parent", "employee_email", "attendance", "cost"])

    # Iterate over each child record
    for child_record in child_records:
        # Fetch the parent document (FM_Travel_Route_Report)
        parent_doc = frappe.get_doc("FM_Travel_Route_Report", child_record.parent)

        # Fetch the linked route document (FM_Route_ID) using route_id from parent_doc
        route_doc = frappe.get_doc("FM_Route_ID", parent_doc.route_id)
        
        # Convert parent document fields to a dictionary
        parent_data = {
            "name": parent_doc.name,
            "date_time": parent_doc.date_time,
            "route_id": parent_doc.route_id,
            "bill_amount": parent_doc.bill_amount,
            "start_point": route_doc.start_point,  # Include start_point from FM_Route_ID
            "end_point": route_doc.end_point,       # Include end_point from FM_Route_ID
            "created_on": parent_doc.creation        # Include creation date
            # You can add more fields from the parent document if needed
        }

        # Convert child document fields to a dictionary
        child_data = {
            "employee_email": child_record.employee_email,
            "attendance": child_record.attendance,
            "cost": child_record.cost,
            # You can add more fields from the child document if needed
        }

        # Combine parent and child data
        combined_data = {
            "parent": parent_data,
            "child": child_data
        }

        # Append to results
        results.append(combined_data)

    return results
@frappe.whitelist()
def get_bill_details(request_id):
    try:
        # Fetch the document for the specified request_id from FM_Bills
        bill_doc = frappe.get_all(
            "FM_Bills",
            filters={"request_id": request_id},
            fields=["name", "creation"]  # Fetch the name and creation date of the document
        )

        if not bill_doc:
            return {"message": "No document found with the provided request_id", "bill_details": [], "creation": None}

        # Assuming there's only one document for the given request_id
        document_name = bill_doc[0].name
        creation_date = bill_doc[0].creation

        # Retrieve the document to access the child table data
        bill_doc = frappe.get_doc("FM_Bills", document_name)

        # Retrieve the meta information for FM_Bill_Parameters to get all child field names
        bill_parameters_meta = frappe.get_meta("FM_Bill_Parameters")
        bill_details = []

        # Iterate over each row in the child table (FM_Bill_Parameters)
        for param in bill_doc.bill_details:
            child_data = {field.fieldname: param.get(field.fieldname) for field in bill_parameters_meta.fields}
            bill_details.append(child_data)

        # Return the bill details along with the creation date
        return {"bill_details": bill_details, "creation": creation_date}
    except Exception as e:
        frappe.log_error(message=str(e), title="Error in get_bill_details")
        return {"error": str(e), "bill_details": [], "creation": None}
@frappe.whitelist()
def get_user_roles():
    try:
        # Get the current user's email
        user_email = frappe.session.user

        # Fetch the user's roles
        user_roles = frappe.get_roles(user_email)

        # Define role categories
        role_categories = {
            'Employee': 'Employee roles',
            'Project Lead': 'Project Lead roles',
            'Department Head': 'Department Head roles',
            'Fleet Manager': 'Fleet Manager roles'
        }

        # Determine which categories the user belongs to
        roles_enabled = []
        for role, category in role_categories.items():
            if role in user_roles:
                roles_enabled.append(role)

        # Return the roles enabled for the current user
        return {'roles_enabled': roles_enabled}

    except Exception as e:
        frappe.log_error(message=str(e), title="Error in get_user_roles")
        return {'error': str(e), 'roles_enabled': []}
@frappe.whitelist()
def update_attendance(document_name=None, employee_email=None):
    try:
        if not document_name:
            return {"success": False}
        if not employee_email:
            return {"success": False}

        parent_doc = frappe.get_doc("FM_Travel_Route_Report", document_name)
        
        if not parent_doc:
            return {"success": False, "message": f"No document found with the provided document name: {document_name}"}

        child_doc = None
        for member in parent_doc.get("onboarded_employees"):
            if member.employee_email == employee_email:
                child_doc = member
                break

        if not child_doc:
            return {"success": False, "message": f"No member found with the provided employee_email: {employee_email}"}

        frappe.logger().info(f"Current attendance for {employee_email}: {child_doc.attendance}")

        if child_doc.attendance == "Present":
            return {"success": True, "message": "Already scanned", "child_doc_name": child_doc.name}

        child_doc.attendance = "Present"
        parent_doc.save()
        frappe.db.commit()
        
        parent_doc.reload()
        updated_member = next((member for member in parent_doc.get("onboarded_employees") if member.employee_email == employee_email), None)
        updated_attendance = updated_member.attendance if updated_member else "Not Found"
        
        frappe.logger().info(f"Updated attendance for {employee_email}: {updated_attendance}")

        return {"success": True, "message": "Attendance updated to Present", "child_doc_name": child_doc.name}

    except Exception as e:
        frappe.log_error(message=str(e), title="Error in update_attendance")
        return {"success": False, "message": str(e)}
@frappe.whitelist(allow_guest=True)
def get_active_employees():
    # Query to fetch employee_name and name fields for active employees
    employees = frappe.get_all(
        "Employee",
        filters={"status": "Active"},
        fields=["employee_name", "name"]
    )
    
    # Return the list of employees
    return employees


    # Lakshmi
    from frappe.utils import getdate, add_days, date_diff,formatdate
from datetime import datetime, timedelta
@frappe.whitelist()
def get_daily_counts(doctype, start_date, end_date):
    # Parse the date strings into date objects
    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.strptime(end_date, "%Y-%m-%d")

    # Initialize a dictionary to hold the counts for each day
    date_counts = {}
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime("%Y-%m-%d")
        date_counts[date_str] = {
            "Approved": 0,
            "Pending": 0,
            "Rejected": 0
        }
        current_date += timedelta(days=1)

    # Fetch records from the database based on doctype and date range
    records = frappe.get_all(
        doctype,
        filters={"creation": ["between", [start_date, end_date]]},
        fields=["creation", "status"]
    )

    # Update the counts for each day based on the records
    for record in records:
        creation_date = record.creation.strftime("%Y-%m-%d")
        status = record.status
        if creation_date in date_counts:
            if status == "Approved":
                date_counts[creation_date]["Approved"] += 1
            elif status == "Pending":
                date_counts[creation_date]["Pending"] += 1
            elif status == "Rejected":
                date_counts[creation_date]["Rejected"] += 1

    return date_counts
@frappe.whitelist()
def get_lead_or_employee_email(project_name, documentname=None):
    if project_name == "General":
        if not documentname:
            raise frappe.ValidationError("Document name is required for General project_name")

        # Fetch the department from the Employee doctype using the documentname
        employee_doc = frappe.get_doc("Employee", documentname)
        user_department = employee_doc.department

        # Fetch the email for the department
        department_doc = frappe.get_all("RM_Department", filters={'department_name': user_department}, fields=['employee_email'])
        if department_doc:
            return department_doc[0].get('employee_email')
        else:
            return None

    else:
        # Fetch the project lead email for the given project_name
        project_lead_doc = frappe.get_all("RM_Project_Lead", filters={'project_name': project_name}, fields=['project_lead_email'])
        if project_lead_doc:
            return project_lead_doc[0].get('project_lead_email')
        else:
            return None
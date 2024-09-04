import frappe
from frappe import _

@frappe.whitelist()
def get_all_travel_route_reports():
    # Fetch all documents of the FM_Travel_Route_Report doctype
    route_reports = frappe.get_all("FM_Travel_Route_Report", fields=["name", "date_time", "route_id", "bill_amount"])
    
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


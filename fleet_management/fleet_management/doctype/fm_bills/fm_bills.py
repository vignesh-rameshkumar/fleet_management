import frappe
from frappe.model.document import Document

class FM_Bills(Document):
    def validate(self):
        # Get the request_id value from the current document (use 'self' now instead of 'doc')
        request_id = self.request_id
        
        # Check if request_id exists in FM_Request_master doctype
        request_master = frappe.get_doc("FM_Request_Master", request_id)
        
        if request_master:
            # Get the project_name from the request master
            project_name = request_master.project_name
            
            if project_name and project_name.lower() != 'general':
                # If the project_name is not "General", set the pro_dept_name field to project_name
                self.pro_dept_name = project_name
            else:
                # If project_name is "General", fetch the department from the request master
                department = request_master.department
                
                # Set the pro_dept_name to the department value from FM_Request_master
                self.pro_dept_name = department
        else:
            frappe.throw(f"FM_Request_master with Request ID {request_id} not found")

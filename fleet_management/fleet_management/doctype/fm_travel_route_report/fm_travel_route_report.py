import frappe
from frappe.model.document import Document

class FMTravelRouteReport(Document):
    def before_insert(self):
        frappe.logger().debug(f"Before insert: {self.name}")
        self.fetch_and_append_employees()

    def fetch_and_append_employees(self):
        if self.route_id:
            frappe.logger().debug(f"Fetching employees for route_id: {self.route_id}")
            route_requests = frappe.get_list('FM_Travel_Route_Request', filters={'route_id': self.route_id}, fields=['name'])

            frappe.logger().debug(f"Route requests found: {route_requests}")
            self.set('onboarded_employees', [])

            for request in route_requests:
                frappe.logger().debug(f"Appending request: {request['name']}")
                self.append('onboarded_employees', {
                    'employee_email': request['name']
                })

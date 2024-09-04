import frappe
from frappe import _
from frappe.model.document import Document

class FM_Travel_Route_Report(Document):
    def validate(self):
        # Call both validation methods within the single validate method
        self.validate_route_id()
        self.distribute_amount()

    def validate_route_id(self):
        if self.route_id:
            is_enabled = frappe.db.get_value("FM_Route_ID", self.route_id, "enabled")
            if not is_enabled:
                frappe.throw(_("The selected Route ID is not enabled. Please choose an enabled Route ID."))

    def distribute_amount(self):
        if self.bill_amount and self.onboarded_employees:
            # Get the number of child table rows
            child_table_count = len(self.onboarded_employees)
            
            # Ensure there are users in the child table to distribute the amount to
            if child_table_count > 0:
                # Calculate equal share per user
                share_per_user = self.bill_amount / child_table_count
                
                # Distribute the amount equally across each child table row
                for row in self.onboarded_employees:
                    row.cost = share_per_user

@frappe.whitelist()
def get_link_field_filters(doctype, txt, searchfield="name", start=0, page_len=20, filters=None):
    if doctype == "FM_Route_ID":
        # Custom filter to only show enabled FM_Route_ID documents
        return frappe.db.sql("""
            SELECT
                name, route_name
            FROM
                `tabFM_Route_ID`
            WHERE
                enabled = 1
                AND (name LIKE %(txt)s OR route_name LIKE %(txt)s)
            ORDER BY name
            LIMIT %(start)s, %(page_len)s
        """, {
            'txt': f"%{txt}%",
            'start': int(start),
            'page_len': int(page_len)
        })
    return []

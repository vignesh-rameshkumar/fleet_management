import frappe
from frappe import _
from frappe.model.document import Document

class FM_Travel_Route_Request(Document):
    def validate(self):
        self.validate_route_id()

    def validate_route_id(self):
        if self.route_id:
            is_enabled = frappe.db.get_value("FM_Route_ID", self.route_id, "enabled")
            if not is_enabled:
                frappe.throw(_("The selected Route ID is not enabled. Please choose an enabled Route ID."))

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
import click
import frappe

def create_roles_and_assign_permissions():
    roles = ["Employee", "Project Lead", "Department Head", "Fleet Manager", "Vehicle"]
    doctype_permissions = {
        "employee_access": [
            "FM_Group_Vehicle_Request",
            "FM_Goods_Vehicle_Request",
            "FM_Passanger_Vehicle_Request",
            "FM_Equipment_Vehicle_Request",
            "FM_Request_Master",
            "FM_Travel_Route_Request",
            "FM_Route_ID"
        ],
        "fleet_manager_access": [
            "FM_Maintenance_Log",
            "FM_Accident_Log",
            "FM_Fuel_Log",
            "FM_Fine_Log",
            "FM_Driver_Details",
            "FM_Vehicle_Details",
            "FM_Travel_Route_Report",
            "FM_Route_ID"
        ],
        "vehicle_access": [
            "FM_Group_Vehicle_Request",
            "FM_Goods_Vehicle_Request",
            "FM_Passanger_Vehicle_Request",
            "FM_Equipment_Vehicle_Request",
            "FM_Request_Master",
            "FM_Travel_Route_Report",
            "FM_Travel_Route_Request",
            "FM_Route_ID"
        ]
    }

    for role in roles:
        if not frappe.db.exists("Role", role):
            new_role = frappe.get_doc({
                "doctype": "Role",
                "role_name": role
            })
            new_role.insert()
            print(f"Roles are created successfully.")

    for doctype in doctype_permissions["employee_access"]:
        if doctype == "FM_Route_ID":
            assign_permission(doctype, "Employee", ["read"])
        else:
            assign_permission(doctype, "Employee", ["read", "write", "create"])

    for doctype in doctype_permissions["fleet_manager_access"]:
        if doctype == "FM_Travel_Route_Report":
            assign_permission(doctype, "Fleet Manager", ["read", "export"])
        else:
            assign_permission(doctype, "Fleet Manager", ["read", "write", "create", "export"])

    for doctype in doctype_permissions["vehicle_access"]:
        if doctype == "FM_Travel_Route_Report":
            assign_permission(doctype, "Vehicle", ["read", "write", "create"])
        elif doctype == "FM_Travel_Route_Request":
            assign_permission(doctype, "Vehicle", ["read"])
        else:
            assign_permission(doctype, "Vehicle", ["read", "write"])

def assign_permission(doctype, role, permissions):
    perm_map = {"read": "read", "write": "write", "create": "create", "export": "export"}
    for perm in permissions:
        if not frappe.db.exists("Custom DocPerm", {"parent": doctype, "role": role, perm_map[perm]: 1}):
            doc = frappe.get_doc({
                "doctype": "Custom DocPerm",
                "parent": doctype,
                "parentfield": "permissions",
                "parenttype": "DocType",
                "role": role,
                perm_map[perm]: 1
            })
            doc.insert()
            print(f"Permissions are assigned")

create_roles_and_assign_permissions()
def after_install():
    try:
        print("Setting up Agnikul's Fleet Management System...")
        create_roles_and_assign_permissions()
        click.secho("Thank you for installing Fleet Management App!", fg="green")
        click.secho("Roles created and permissions assigned successfully.", fg="green")
    except Exception as e:
        click.secho(
            "Installation for Fleet Management App failed due to an error."
            " Please try re-installing the app or report the issue if not resolved.",
            fg="bright_red",
        )
        raise e

def execute():
    after_install()
from . import __version__ as app_version

app_name = "fleet_management"
app_title = "Fleet Management"
app_publisher = "Agnikul Cosmos"
app_description = "Fleet Management System @AgnikulCosmos"
app_email = "automationbot@agnikul.in"
app_license = "MIT"
# required_apps = ["role_management"]


after_install = "fleet_management.install.execute"

doc_events = {
    "FM_Passenger_Vehicle_Request": {
        "on_insert": "fleet_management.validate.sync_to_fm_request_master",
        "on_update": "fleet_management.validate.sync_to_fm_request_master",
        "before_insert": "fleet_management.validate.call"
    },
    "FM_Goods_Vehicle_Request": {
        "on_insert": "fleet_management.validate.sync_to_fm_request_master",
        "on_update": "fleet_management.validate.sync_to_fm_request_master",
        "before_insert": "fleet_management.validate.call"
    },
    "FM_Equipment_Vehicle_Request": {
        "on_insert": "fleet_management.validate.sync_to_fm_request_master",
        "on_update": "fleet_management.validate.sync_to_fm_request_master",
        "before_insert": "fleet_management.validate.call"
    },
    "FM_Group_Vehicle_Request": {
        "on_insert": "fleet_management.validate.sync_to_fm_request_master",
        "on_update": "fleet_management.validate.sync_to_fm_request_master",
        "before_insert": "fleet_management.validate.call"
    }
}
# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/fleet_management/css/fleet_management.css"
# app_include_js = "/assets/fleet_management/js/fleet_management.js"

# include js, css files in header of web template
# web_include_css = "/assets/fleet_management/css/fleet_management.css"
# web_include_js = "/assets/fleet_management/js/fleet_management.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "fleet_management/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#	"methods": "fleet_management.utils.jinja_methods",
#	"filters": "fleet_management.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "fleet_management.install.before_install"
# after_install = "fleet_management.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "fleet_management.uninstall.before_uninstall"
# after_uninstall = "fleet_management.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "fleet_management.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
#	"*": {
#		"on_update": "method",
#		"on_cancel": "method",
#		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
#	"all": [
#		"fleet_management.tasks.all"
#	],
#	"daily": [
#		"fleet_management.tasks.daily"
#	],
#	"hourly": [
#		"fleet_management.tasks.hourly"
#	],
#	"weekly": [
#		"fleet_management.tasks.weekly"
#	],
#	"monthly": [
#		"fleet_management.tasks.monthly"
#	],
# }

# Testing
# -------

# before_tests = "fleet_management.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "fleet_management.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "fleet_management.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["fleet_management.utils.before_request"]
# after_request = ["fleet_management.utils.after_request"]

# Job Events
# ----------
# before_job = ["fleet_management.utils.before_job"]
# after_job = ["fleet_management.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
#	{
#		"doctype": "{doctype_1}",
#		"filter_by": "{filter_by}",
#		"redact_fields": ["{field_1}", "{field_2}"],
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_2}",
#		"filter_by": "{filter_by}",
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_3}",
#		"strict": False,
#	},
#	{
#		"doctype": "{doctype_4}"
#	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"fleet_management.auth.validate"
# ]

website_route_rules = [{'from_route': '/Fleet_Management/<path:app_path>', 'to_route': 'Fleet_Management'},]
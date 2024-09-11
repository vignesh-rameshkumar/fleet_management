import frappe
from frappe import _
from datetime import datetime, timedelta

@frappe.whitelist()
def get_fuel_log_data(view_type, vehicle_no, from_date, to_date):
    try:
        # Validate input dates
        from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
        to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
    except ValueError:
        frappe.throw(_("Invalid date format. Please use YYYY-MM-DD."))

    if from_date > to_date:
        frappe.throw(_("From Date cannot be greater than To Date."))

    # Construct and execute custom SQL query
    query = """
    SELECT date, bill_amount, fuel_in_litres, current_odometer_reading
    FROM `tabFM_Fuel_Log`
    WHERE vehicle_number = %s
    AND date BETWEEN %s AND %s
    ORDER BY date
    """
    
    data = frappe.db.sql(query, (vehicle_no, from_date, to_date), as_dict=True)

    if not data:
        return {"message": "No data found for the given criteria."}

    # Process data based on view type
    if view_type == "day":
        result = process_daily_data(data)
    elif view_type == "week":
        result = process_weekly_data(data)
    elif view_type == "month":
        result = process_monthly_data(data)
    elif view_type == "year":
        result = process_yearly_data(data)
    else:
        frappe.throw(_("Invalid view type. Choose from 'day', 'week', 'month', or 'year'."))

    # Calculate odometer difference
    first_odo = float(data[0].get("current_odometer_reading", 0))
    last_odo = float(data[-1].get("current_odometer_reading", 0))
    odo_difference = last_odo - first_odo

    result["odometer_difference"] = odo_difference

    return result

def process_daily_data(data):
    daily_data = {}
    for entry in data:
        date_str = entry.date.strftime('%Y-%m-%d') if isinstance(entry.date, datetime) else entry.date
        if date_str not in daily_data:
            daily_data[date_str] = {"bill_amount": 0, "fuel_in_litres": 0}
        daily_data[date_str]["bill_amount"] += float(entry.bill_amount)
        daily_data[date_str]["fuel_in_litres"] += float(entry.fuel_in_litres)
    
    return {
        "data": daily_data,
        "total_bill_amount": sum(day["bill_amount"] for day in daily_data.values()),
        "total_fuel_in_litres": sum(day["fuel_in_litres"] for day in daily_data.values())
    }

def process_weekly_data(data):
    weekly_data = {}
    for entry in data:
        date = entry.date if isinstance(entry.date, datetime) else datetime.strptime(entry.date, '%Y-%m-%d')
        week_start = (date - timedelta(days=date.weekday())).strftime('%Y-%m-%d')
        if week_start not in weekly_data:
            weekly_data[week_start] = {"bill_amount": 0, "fuel_in_litres": 0}
        weekly_data[week_start]["bill_amount"] += float(entry.bill_amount)
        weekly_data[week_start]["fuel_in_litres"] += float(entry.fuel_in_litres)
    
    return {
        "data": weekly_data,
        "total_bill_amount": sum(week["bill_amount"] for week in weekly_data.values()),
        "total_fuel_in_litres": sum(week["fuel_in_litres"] for week in weekly_data.values())
    }

def process_monthly_data(data):
    monthly_data = {}
    for entry in data:
        date = entry.date if isinstance(entry.date, datetime) else datetime.strptime(entry.date, '%Y-%m-%d')
        month_key = date.strftime('%Y-%m')
        if month_key not in monthly_data:
            monthly_data[month_key] = {"bill_amount": 0, "fuel_in_litres": 0}
        monthly_data[month_key]["bill_amount"] += float(entry.bill_amount)
        monthly_data[month_key]["fuel_in_litres"] += float(entry.fuel_in_litres)
    
    return {
        "data": monthly_data,
        "total_bill_amount": sum(month["bill_amount"] for month in monthly_data.values()),
        "total_fuel_in_litres": sum(month["fuel_in_litres"] for month in monthly_data.values())
    }

def process_yearly_data(data):
    yearly_data = {}
    for entry in data:
        date = entry.date if isinstance(entry.date, datetime) else datetime.strptime(entry.date, '%Y-%m-%d')
        year_key = date.strftime('%Y')
        if year_key not in yearly_data:
            yearly_data[year_key] = {"bill_amount": 0, "fuel_in_litres": 0}
        yearly_data[year_key]["bill_amount"] += float(entry.bill_amount)
        yearly_data[year_key]["fuel_in_litres"] += float(entry.fuel_in_litres)
    
    return {
        "data": yearly_data,
        "total_bill_amount": sum(year["bill_amount"] for year in yearly_data.values()),
        "total_fuel_in_litres": sum(year["fuel_in_litres"] for year in yearly_data.values())
    }

# API Endpoints
@frappe.whitelist()
def get_day_view(vehicle_no, from_date, to_date):
    return get_fuel_log_data("day", vehicle_no, from_date, to_date)

@frappe.whitelist()
def get_week_view(vehicle_no, from_date, to_date):
    return get_fuel_log_data("week", vehicle_no, from_date, to_date)

@frappe.whitelist()
def get_month_view(vehicle_no, from_date, to_date):
    return get_fuel_log_data("month", vehicle_no, from_date, to_date)

@frappe.whitelist()
def get_year_view(vehicle_no, from_date, to_date):
    return get_fuel_log_data("year", vehicle_no, from_date, to_date)
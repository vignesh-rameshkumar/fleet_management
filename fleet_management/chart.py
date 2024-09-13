import frappe
from frappe import _
from datetime import datetime, timedelta

@frappe.whitelist()
def get_fuel_log_data(view_type, vehicle_no, from_date, to_date):
    try:
        from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
        to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
    except ValueError:
        frappe.throw(_("Invalid date format. Please use YYYY-MM-DD."))

    if from_date > to_date:
        frappe.throw(_("From Date cannot be greater than To Date."))

    # Fetch fuel log data
    fuel_query = """
    SELECT date, bill_amount, fuel_in_litres, current_odometer_reading
    FROM `tabFM_Fuel_Log`
    WHERE vehicle_number = %s
    AND date BETWEEN %s AND %s
    ORDER BY date
    """
    fuel_data = frappe.db.sql(fuel_query, (vehicle_no, from_date, to_date), as_dict=True)

    # Fetch fine log data
    fine_query = """
    SELECT incident_date, fine_amount
    FROM `tabFM_Fine_Log`
    WHERE vehicle_number = %s
    AND incident_date BETWEEN %s AND %s
    ORDER BY incident_date
    """
    fine_data = frappe.db.sql(fine_query, (vehicle_no, from_date, to_date), as_dict=True)

    if not fuel_data and not fine_data:
        return {"message": "No data found for the given criteria."}

    # Get previous odometer reading
    prev_odo_query = """
    SELECT current_odometer_reading
    FROM `tabFM_Fuel_Log`
    WHERE vehicle_number = %s AND date < %s
    ORDER BY date DESC
    LIMIT 1
    """
    prev_odo = frappe.db.sql(prev_odo_query, (vehicle_no, from_date), as_dict=True)
    prev_odo_reading = prev_odo[0].get('current_odometer_reading', 0) if prev_odo else 0

    # Process data based on view type
    if view_type == "day":
        result = process_daily_data(fuel_data, fine_data, prev_odo_reading)
    elif view_type == "week":
        result = process_weekly_data(fuel_data, fine_data, prev_odo_reading)
    elif view_type == "month":
        result = process_monthly_data(fuel_data, fine_data, prev_odo_reading)
    elif view_type == "year":
        result = process_yearly_data(fuel_data, fine_data, prev_odo_reading)
    else:
        frappe.throw(_("Invalid view type. Choose from 'day', 'week', 'month', or 'year'."))

    return result

def process_daily_data(fuel_data, fine_data, prev_odo_reading):
    daily_data = {}
    for entry in fuel_data:
        date_str = entry.date.strftime('%Y-%m-%d') if isinstance(entry.date, datetime) else entry.date
        if date_str not in daily_data:
            daily_data[date_str] = {"odoMeter": 0, "fuelLitres": 0, "fuelAmount": 0, "fineAmount": 0}
        daily_data[date_str]["fuelLitres"] += float(entry.fuel_in_litres)
        daily_data[date_str]["fuelAmount"] += float(entry.bill_amount)
        daily_data[date_str]["odoMeter"] = float(entry.current_odometer_reading) - prev_odo_reading
        prev_odo_reading = float(entry.current_odometer_reading)

    for entry in fine_data:
        date_str = entry.incident_date.strftime('%Y-%m-%d') if isinstance(entry.incident_date, datetime) else entry.incident_date
        if date_str in daily_data:
            daily_data[date_str]["fineAmount"] += float(entry.fine_amount)
        else:
            daily_data[date_str] = {"odoMeter": 0, "fuelLitres": 0, "fuelAmount": 0, "fineAmount": float(entry.fine_amount)}

    return [{"date": k, **v} for k, v in daily_data.items()]

def process_weekly_data(fuel_data, fine_data, prev_odo_reading):
    weekly_data = {}
    for entry in fuel_data:
        date = entry.date if isinstance(entry.date, datetime) else datetime.strptime(entry.date, '%Y-%m-%d')
        week_start = (date - timedelta(days=date.weekday())).strftime('%Y-%m-%d')
        if week_start not in weekly_data:
            weekly_data[week_start] = {"odoMeter": 0, "fuelLitres": 0, "fuelAmount": 0, "fineAmount": 0}
        weekly_data[week_start]["fuelLitres"] += float(entry.fuel_in_litres)
        weekly_data[week_start]["fuelAmount"] += float(entry.bill_amount)
        weekly_data[week_start]["odoMeter"] = max(weekly_data[week_start]["odoMeter"], float(entry.current_odometer_reading) - prev_odo_reading)
        prev_odo_reading = float(entry.current_odometer_reading)

    for entry in fine_data:
        date = entry.incident_date if isinstance(entry.incident_date, datetime) else datetime.strptime(entry.incident_date, '%Y-%m-%d')
        week_start = (date - timedelta(days=date.weekday())).strftime('%Y-%m-%d')
        if week_start in weekly_data:
            weekly_data[week_start]["fineAmount"] += float(entry.fine_amount)
        else:
            weekly_data[week_start] = {"odoMeter": 0, "fuelLitres": 0, "fuelAmount": 0, "fineAmount": float(entry.fine_amount)}

    return [{"date": k, **v} for k, v in weekly_data.items()]

def process_monthly_data(fuel_data, fine_data, prev_odo_reading):
    monthly_data = {}
    for entry in fuel_data:
        date = entry.date if isinstance(entry.date, datetime) else datetime.strptime(entry.date, '%Y-%m-%d')
        month_key = date.strftime('%b %y')
        if month_key not in monthly_data:
            monthly_data[month_key] = {"odoMeter": 0, "fuelLitres": 0, "fuelAmount": 0, "fineAmount": 0}
        monthly_data[month_key]["fuelLitres"] += float(entry.fuel_in_litres)
        monthly_data[month_key]["fuelAmount"] += float(entry.bill_amount)
        monthly_data[month_key]["odoMeter"] = max(monthly_data[month_key]["odoMeter"], float(entry.current_odometer_reading) - prev_odo_reading)
        prev_odo_reading = float(entry.current_odometer_reading)

    for entry in fine_data:
        date = entry.incident_date if isinstance(entry.incident_date, datetime) else datetime.strptime(entry.incident_date, '%Y-%m-%d')
        month_key = date.strftime('%b %y')
        if month_key in monthly_data:
            monthly_data[month_key]["fineAmount"] += float(entry.fine_amount)
        else:
            monthly_data[month_key] = {"odoMeter": 0, "fuelLitres": 0, "fuelAmount": 0, "fineAmount": float(entry.fine_amount)}

    return [{"date": k, **v} for k, v in monthly_data.items()]

def process_yearly_data(fuel_data, fine_data, prev_odo_reading):
    yearly_data = {}
    for entry in fuel_data:
        date = entry.date if isinstance(entry.date, datetime) else datetime.strptime(entry.date, '%Y-%m-%d')
        year_key = date.strftime('%Y')
        if year_key not in yearly_data:
            yearly_data[year_key] = {"odoMeter": 0, "fuelLitres": 0, "fuelAmount": 0, "fineAmount": 0}
        yearly_data[year_key]["fuelLitres"] += float(entry.fuel_in_litres)
        yearly_data[year_key]["fuelAmount"] += float(entry.bill_amount)
        yearly_data[year_key]["odoMeter"] = max(yearly_data[year_key]["odoMeter"], float(entry.current_odometer_reading) - prev_odo_reading)
        prev_odo_reading = float(entry.current_odometer_reading)

    for entry in fine_data:
        date = entry.incident_date if isinstance(entry.incident_date, datetime) else datetime.strptime(entry.incident_date, '%Y-%m-%d')
        year_key = date.strftime('%Y')
        if year_key in yearly_data:
            yearly_data[year_key]["fineAmount"] += float(entry.fine_amount)
        else:
            yearly_data[year_key] = {"odoMeter": 0, "fuelLitres": 0, "fuelAmount": 0, "fineAmount": float(entry.fine_amount)}

    return [{"date": k, **v} for k, v in yearly_data.items()]

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
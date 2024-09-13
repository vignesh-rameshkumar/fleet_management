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

    # Get the date and odometer reading of the last entry before from_date
    last_entry_before = frappe.db.sql("""
        SELECT date, current_odometer_reading as odo
        FROM `tabFM_Fuel_Log`
        WHERE vehicle_number = %s AND date < %s
        ORDER BY date DESC
        LIMIT 1
    """, (vehicle_no, from_date), as_dict=True)

    prev_odo = float(last_entry_before[0]['odo']) if last_entry_before else None
    first_odo = 0  # Set first_odo to 0 by default

    # Adjust the query based on view type
    if view_type == "day":
        group_by = "DATE(date)"
        group_key_sql = "DATE(date)"
        date_format = "%Y-%m-%d"
    elif view_type == "week":
        group_by = "YEAR(date)*100 + WEEK(date, 1)"
        group_key_sql = "YEAR(date)*100 + WEEK(date, 1)"
        date_format = "%d %b"  # e.g., "07 Jun"
    elif view_type == "month":
        group_by = "EXTRACT(YEAR_MONTH FROM date)"
        group_key_sql = "EXTRACT(YEAR_MONTH FROM date)"
        date_format = "%b %Y"  # e.g., "Jan 2024"
    elif view_type == "year":
        group_by = "YEAR(date)"
        group_key_sql = "YEAR(date)"
        date_format = "%Y"
    else:
        frappe.throw(_("Invalid view type. Choose from 'day', 'week', 'month', or 'year'."))

    # Escape % signs in date_format for SQL query
    date_format_sql = date_format.replace('%', '%%')

    # Generate all dates in the range
    all_dates = generate_all_dates(from_date, to_date, view_type)

    # Fetch aggregated fuel log data
    fuel_query = f"""
    SELECT 
        DATE_FORMAT(MIN(date), '{date_format_sql}') as date,
        {group_key_sql} as group_key,
        SUM(bill_amount) as total_bill_amount,
        SUM(fuel_in_litres) as total_fuel_litres,
        MIN(current_odometer_reading) as min_odometer,
        MAX(current_odometer_reading) as max_odometer
    FROM `tabFM_Fuel_Log`
    WHERE vehicle_number = %s AND date BETWEEN %s AND %s
    GROUP BY group_key
    ORDER BY MIN(date)
    """

    fuel_data = frappe.db.sql(fuel_query, (vehicle_no, from_date, to_date), as_dict=True)

    # Fetch aggregated fine log data
    fine_group_by = group_by.replace('date', 'incident_date')
    fine_group_key_sql = group_key_sql.replace('date', 'incident_date')
    fine_query = f"""
    SELECT 
        DATE_FORMAT(MIN(incident_date), '{date_format_sql}') as date,
        {fine_group_key_sql} as group_key,
        SUM(fine_amount) as total_fine_amount
    FROM `tabFM_Fine_Log`
    WHERE vehicle_number = %s AND incident_date BETWEEN %s AND %s
    GROUP BY group_key
    """

    fine_data = frappe.db.sql(fine_query, (vehicle_no, from_date, to_date), as_dict=True)

    # Process and combine data
    result = process_data(all_dates, fuel_data, fine_data, prev_odo, first_odo)

    return result

def generate_all_dates(from_date, to_date, view_type):
    all_dates = []
    if view_type == 'day':
        current_date = from_date
        delta = timedelta(days=1)
        while current_date <= to_date:
            date_str = current_date.strftime('%Y-%m-%d')
            group_key = current_date.strftime('%Y-%m-%d')
            all_dates.append({'date': date_str, 'group_key': current_date})
            current_date += delta
    elif view_type == 'week':
        # Start from the beginning of the week
        current_date = from_date - timedelta(days=from_date.weekday())
        delta = timedelta(weeks=1)
        while current_date <= to_date:
            date_str = current_date.strftime('%d %b')  # e.g., "07 Jun"
            group_key = current_date.year * 100 + int(current_date.strftime('%U')) + 1  # Week number
            all_dates.append({'date': date_str, 'group_key': group_key})
            current_date += delta
    elif view_type == 'month':
        current_date = from_date.replace(day=1)
        while current_date <= to_date:
            date_str = current_date.strftime('%b %Y')  # e.g., "Jan 2024"
            group_key = int(current_date.strftime('%Y%m'))
            all_dates.append({'date': date_str, 'group_key': group_key})
            # Move to next month
            if current_date.month == 12:
                current_date = current_date.replace(year=current_date.year + 1, month=1)
            else:
                current_date = current_date.replace(month=current_date.month + 1)
    elif view_type == 'year':
        current_date = from_date.replace(month=1, day=1)
        while current_date <= to_date:
            date_str = current_date.strftime('%Y')
            group_key = current_date.year
            all_dates.append({'date': date_str, 'group_key': group_key})
            current_date = current_date.replace(year=current_date.year + 1)
    else:
        frappe.throw(_("Invalid view type. Choose from 'day', 'week', 'month', or 'year'."))
    return all_dates

def process_data(all_dates, fuel_data, fine_data, prev_odo, first_odo):
    # Initialize combined_data with all dates
    combined_data = {entry['group_key']: {"date": entry['date'], "odoMeter": 0, "fuelLitres": 0, "fuelAmount": 0, "fineAmount": 0} for entry in all_dates}
    last_odo = prev_odo

    # Process fuel data
    for entry in fuel_data:
        key = entry['group_key']
        current_odo = float(entry['max_odometer'])

        if last_odo is None:
            odo_diff = current_odo - first_odo
        else:
            odo_diff = current_odo - last_odo

        if key in combined_data:
            combined_data[key].update({
                "odoMeter": odo_diff,
                "fuelLitres": entry['total_fuel_litres'],
                "fuelAmount": entry['total_bill_amount']
            })
        else:
            combined_data[key] = {
                "date": entry['date'],
                "odoMeter": odo_diff,
                "fuelLitres": entry['total_fuel_litres'],
                "fuelAmount": entry['total_bill_amount'],
                "fineAmount": 0
            }
        last_odo = current_odo

    # Add fine data
    for entry in fine_data:
        key = entry['group_key']
        if key in combined_data:
            combined_data[key]["fineAmount"] = entry['total_fine_amount']
        else:
            combined_data[key] = {
                "date": entry['date'],
                "odoMeter": 0,
                "fuelLitres": 0,
                "fuelAmount": 0,
                "fineAmount": entry['total_fine_amount']
            }

    # Convert combined_data to a list
    return [v for k, v in combined_data.items()]

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

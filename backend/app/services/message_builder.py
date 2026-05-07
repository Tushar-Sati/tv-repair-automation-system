def build_message(job):

    customer_name = job["customer_name"]

    brand = job["brand"]

    job_number = job["job_number"]

    status = job["status"]


    # REPAIRED
    if status == "OK":

        return f"""
====================================

Dear {customer_name},

Your {brand} TV repair job {job_number} has been repaired successfully.

Please collect your TV from our service center.

Thank you.

====================================
"""


    # NOT REPAIRABLE
    elif status == "NR":

        return f"""
====================================

Dear {customer_name},

Your {brand} TV repair job {job_number} is marked as not repairable.

Please collect your TV from our service center.

Thank you.

====================================
"""


    # UNDER PROCESS
    else:

        return f"""
====================================

Dear {customer_name},

Your {brand} TV repair job {job_number} is currently under process.

We will update you soon.

Thank you.

====================================
"""
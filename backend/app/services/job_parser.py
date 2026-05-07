def get_pending_jobs(rows):

    pending_jobs = []

    for index, row in enumerate(rows):

        # Skip header
        if index == 0:
            continue

        if len(row) < 11:
            continue

        customer_name = str(row[1]).strip()

        job_number = str(row[2]).strip()

        phone_number = str(row[3]).strip().replace(" ", "")

        brand = str(row[4]).strip()

        status = str(row[9]).strip().upper() if len(row) > 9 else ""

        deliver = str(row[10]).strip().upper() if len(row) > 10 else ""

        message_status = str(row[11]).strip().upper() if len(row) > 11 else ""

        # Skip invalid phone
        if len(phone_number) != 10:
            continue

        # Skip delivered
        if deliver == "YES":
            continue

        # Skip already sent
        if message_status == "SENT":
            continue

        pending_jobs.append({
            "row_number": index + 1,
            "customer_name": customer_name,
            "job_number": job_number,
            "phone_number": "+91" + phone_number,
            "brand": brand,
            "status": status
        })

    return pending_jobs
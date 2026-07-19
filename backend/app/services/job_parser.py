def get_pending_jobs(rows, debug=True):

    pending_jobs = []

    for index, row in enumerate(rows):

        # Skip header
        if index == 0:
            continue

        sheet_row = index + 1  # 1-based Google Sheet row number

        # Need at least columns A-D (index 0-3) to extract a phone number.
        # NOTE: Google Sheets API trims trailing empty cells, so rows with no
        # DELIVER / MESSAGE_STATUS data may have fewer than 11 columns — those
        # are exactly the fresh/pending jobs we want to send messages to.
        if len(row) < 4:
            if debug:
                print(f"  [Row {sheet_row}] SKIP — too few columns ({len(row)} cols): {row}")
            continue

        customer_name = str(row[1]).strip()
        job_number    = str(row[2]).strip()
        phone_number  = str(row[3]).strip().replace(" ", "")
        brand         = str(row[4]).strip()  if len(row) > 4  else ""
        status        = str(row[9]).strip().upper()  if len(row) > 9  else ""
        deliver       = str(row[15]).strip().upper() if len(row) > 15 else ""
        message_status= str(row[11]).strip().upper() if len(row) > 11 else ""

        if debug:
            print(f"  [Row {sheet_row}] job={job_number!r}  phone={phone_number!r}({len(phone_number)})  "
                  f"deliver={deliver!r}  msg_status={message_status!r}  status={status!r}")

        # Skip invalid phone
        if len(phone_number) != 10:
            if debug:
                print(f"           --> SKIP: phone length {len(phone_number)} != 10")
            continue

        # Only send a message when deliver == "NO" (TV not yet delivered).
        # All other statuses (YES, PURCHASE, SCRAP, SELF PANEL, STORE, or blank)
        # mean the job is closed, internal, or not applicable — skip them.
        if deliver != "NO":
            if debug:
                print(f"           --> SKIP: deliver={deliver!r} (only 'NO' triggers a message)")
            continue

        # Skip already sent
        if message_status == "SENT":
            if debug:
                print(f"           --> SKIP: already SENT")
            continue

        if debug:
            print(f"           --> QUEUED for sending")

        pending_jobs.append({
            "row_number": sheet_row,
            "customer_name": customer_name,
            "job_number": job_number,
            "phone_number": "+91" + phone_number,
            "brand": brand,
            "status": status
        })

    return pending_jobs

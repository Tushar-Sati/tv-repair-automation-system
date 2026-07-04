import contextlib
import os
import sys
import tempfile
import time
from dataclasses import dataclass
from pathlib import Path

import msvcrt
import pywhatkit
from dotenv import dotenv_values

sys.path.append("backend")

from app.services.job_parser import get_pending_jobs
from app.services.message_builder import build_message
from app.services.sheets_service import sheet_service


LOCK_FILE = Path(tempfile.gettempdir()) / "tv_repair_whatsapp_sender.lock"
ENV_CONFIG = dotenv_values(Path(__file__).with_name(".env"))


@dataclass(frozen=True)
class WhatsAppSettings:
    wait_time: int = 42
    post_send_delay: int = 5
    between_messages_delay: int = 3
    retries: int = 1
    tab_close: bool = False
    close_time: int = 10


def env_value(name):
    return os.getenv(name) or ENV_CONFIG.get(name)


def env_int(name, default, minimum=0):
    value = env_value(name)
    if value is None or value.strip() == "":
        return default

    try:
        parsed = int(value)
    except ValueError:
        print(f"Invalid {name}={value!r}; using {default}")
        return default

    return max(parsed, minimum)


def env_bool(name, default):
    value = env_value(name)
    if value is None or value.strip() == "":
        return default

    return value.strip().lower() in {"1", "true", "yes", "y", "on"}


def load_settings():
    return WhatsAppSettings(
        wait_time=env_int("WHATSAPP_WAIT_TIME", 42, minimum=5),
        post_send_delay=env_int("WHATSAPP_POST_SEND_DELAY", 5),
        between_messages_delay=env_int("WHATSAPP_BETWEEN_MESSAGES_DELAY", 3),
        retries=env_int("WHATSAPP_RETRIES", 1),
        tab_close=env_bool("WHATSAPP_TAB_CLOSE", False),
        close_time=env_int("WHATSAPP_CLOSE_TIME", 10),
    )


@contextlib.contextmanager
def single_running_instance():
    LOCK_FILE.parent.mkdir(parents=True, exist_ok=True)

    with LOCK_FILE.open("w") as lock_file:
        lock_file.write("1")
        lock_file.flush()

        try:
            msvcrt.locking(lock_file.fileno(), msvcrt.LK_NBLCK, 1)
        except OSError:
            print("Another WhatsApp sender is already running. Exiting.")
            yield False
            return

        try:
            yield True
        finally:
            lock_file.seek(0)
            msvcrt.locking(lock_file.fileno(), msvcrt.LK_UNLCK, 1)


def send_whatsapp_message(phone_number, message, settings):
    """Send one WhatsApp message and wait before moving to the next contact."""
    attempts = settings.retries + 1

    for attempt in range(1, attempts + 1):
        try:
            print(
                f"Opening WhatsApp for {phone_number} "
                f"(attempt {attempt}/{attempts}, wait {settings.wait_time}s)"
            )

            pywhatkit.sendwhatmsg_instantly(
                phone_number,
                message,
                wait_time=settings.wait_time,
                tab_close=settings.tab_close,
                close_time=settings.close_time,
            )

            print(
                f"Send command completed for {phone_number}; "
                f"waiting {settings.post_send_delay}s before sheet update"
            )
            time.sleep(settings.post_send_delay)
            return True

        except Exception as exc:
            print(f"Failed sending to {phone_number}: {exc}")

            if attempt < attempts:
                retry_delay = max(10, settings.between_messages_delay)
                print(f"Retrying {phone_number} after {retry_delay}s...")
                time.sleep(retry_delay)

    return False


def main():
    start_time = time.time()
    settings = load_settings()

    with single_running_instance() as should_run:
        if not should_run:
            return {
                "success": False,
                "sent": 0,
                "failed": 0,
                "duration": f"{time.time() - start_time:.0f} sec",
                "error": "Another WhatsApp sender is already running.",
            }

        rows = sheet_service.get_rows()
        pending_jobs = get_pending_jobs(rows)

        print("\nSENDING WHATSAPP MESSAGES...\n")
        print(f"Queued jobs: {len(pending_jobs)}")
        print(
            "WhatsApp timing: "
            f"load wait={settings.wait_time}s, "
            f"post-send wait={settings.post_send_delay}s, "
            f"between messages={settings.between_messages_delay}s, "
            f"tab_close={settings.tab_close}"
        )

        sent_count = 0
        failed_count = 0

        for job in pending_jobs:
            phone_number = job["phone_number"]
            message = build_message(job)

            print(f"\nRow {job['row_number']}: sending to {phone_number}")

            sent = send_whatsapp_message(phone_number, message, settings)

            if sent:
                sheet_service.mark_message_sent(job["row_number"])
                sent_count += 1
                print("Marked SENT")
            else:
                failed_count += 1
                print("Not marked SENT; this row will be retried in the next run")

            if settings.between_messages_delay > 0:
                print(f"Waiting {settings.between_messages_delay}s before next contact")
                time.sleep(settings.between_messages_delay)

        print(f"\nDone. Sent: {sent_count}, failed: {failed_count}.")
        return {
            "success": failed_count == 0,
            "sent": sent_count,
            "failed": failed_count,
            "duration": f"{time.time() - start_time:.0f} sec",
        }


if __name__ == "__main__":
    main()

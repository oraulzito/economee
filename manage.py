#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import cx_Oracle
import os
import sys


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'economee.settings')
    try:

        if sys.platform.startswith("darwin"):
            lib_dir = os.path.join(os.environ.get("HOME"), "Downloads",
                                   "oracle")
            cx_Oracle.init_oracle_client(lib_dir=lib_dir)
        elif sys.platform.startswith("win32"):
            lib_dir = r"C:\oracle"
            cx_Oracle.init_oracle_client(lib_dir=lib_dir)

        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()

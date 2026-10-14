"""Command-line entry point."""

import argparse


def main() -> None:
    parser = argparse.ArgumentParser(description="PYMASTER-AI Python starter")
    parser.add_argument("--name", default="world", help="Name to greet")
    args = parser.parse_args()
    print(f"Hello, {args.name}! Welcome to PYMASTER-AI.")


if __name__ == "__main__":
    main()

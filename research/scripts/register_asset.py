#!/usr/bin/env python3
"""
Asset-provenance CLI for TurkaGame.

Every manuscript image under assets/manuscripts/ must have a matching record in
assets/manuscripts/registry.json before any game code uses it. This script is the only
supported way to add or update those records — don't hand-edit the registry.

Usage:
    python register_asset.py add --file path/to/image.jpg --title "..." \\
        --institution "Tehran, Majlis Library" --shelfmark "MS 10196" --folio "f. 63a" \\
        --rights-note "..." [--date "..."] [--creator "..."] [--source-url "..."] \\
        [--cited-in id1,id2] [--tags tag1,tag2] [--notes "..."] [--added-by "Ted"]

    python register_asset.py list [--status candidate|approved|rejected]

    python register_asset.py approve --id <uuid>
        (only succeeds if rights_note is already non-empty)

    python register_asset.py check
        (verifies every registry entry's local_file exists and re-checks the sha256)
"""
import argparse
import hashlib
import json
import sys
import uuid
from datetime import date, timezone, datetime
from pathlib import Path

ASSETS_DIR = Path(__file__).resolve().parent.parent.parent / "assets" / "manuscripts"
REGISTRY_PATH = ASSETS_DIR / "registry.json"


def load_registry() -> list:
    if not REGISTRY_PATH.exists():
        return []
    with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_registry(records: list) -> None:
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    with open(REGISTRY_PATH, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
        f.write("\n")


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def cmd_add(args: argparse.Namespace) -> None:
    src = Path(args.file).resolve()
    if not src.exists():
        sys.exit(f"error: --file {src} does not exist")

    dest = ASSETS_DIR / src.name
    if dest.exists() and dest.resolve() != src:
        sys.exit(f"error: {dest} already exists with different content path; rename first")
    if not dest.exists():
        ASSETS_DIR.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(src.read_bytes())

    record = {
        "id": str(uuid.uuid4()),
        "title": args.title,
        "institution": args.institution,
        "shelfmark": args.shelfmark,
        "folio": args.folio,
        "date_or_period": args.date,
        "creator_or_scribe": args.creator,
        "digitization_source_url": args.source_url,
        "rights_note": args.rights_note or "",
        "local_file": dest.name,
        "sha256": sha256_of(dest),
        "cited_in": args.cited_in.split(",") if args.cited_in else [],
        "tags": args.tags.split(",") if args.tags else [],
        "added_by": args.added_by or "unspecified",
        "added_date": date.today().isoformat(),
        "usage_status": "approved" if args.rights_note else "candidate",
        "notes": args.notes,
    }

    records = load_registry()
    records.append(record)
    save_registry(records)
    print(f"added {record['id']} ({record['usage_status']}) -> {dest}")


def cmd_list(args: argparse.Namespace) -> None:
    records = load_registry()
    if args.status:
        records = [r for r in records if r["usage_status"] == args.status]
    if not records:
        print("(no matching records)")
        return
    for r in records:
        print(f"{r['id']}  [{r['usage_status']:9}]  {r['title']}  ({r['institution']}, {r.get('shelfmark') or 'no shelfmark'})")


def cmd_approve(args: argparse.Namespace) -> None:
    records = load_registry()
    for r in records:
        if r["id"] == args.id:
            if not r.get("rights_note"):
                sys.exit("error: rights_note is empty; fill it in before approving (edit the registry manually for this field only, or re-add)")
            r["usage_status"] = "approved"
            save_registry(records)
            print(f"approved {args.id}")
            return
    sys.exit(f"error: no record with id {args.id}")


def cmd_check(args: argparse.Namespace) -> None:
    records = load_registry()
    problems = 0
    for r in records:
        path = ASSETS_DIR / r["local_file"]
        if not path.exists():
            print(f"MISSING FILE: {r['id']} -> {path}")
            problems += 1
            continue
        current_hash = sha256_of(path)
        if r.get("sha256") and current_hash != r["sha256"]:
            print(f"HASH MISMATCH: {r['id']} -> {path}")
            problems += 1
        if r["usage_status"] == "approved" and not r.get("rights_note"):
            print(f"APPROVED WITHOUT RIGHTS NOTE: {r['id']}")
            problems += 1
    if problems:
        sys.exit(f"{problems} problem(s) found")
    print(f"ok: {len(records)} record(s), no problems")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    p_add = sub.add_parser("add", help="register a new asset")
    p_add.add_argument("--file", required=True)
    p_add.add_argument("--title", required=True)
    p_add.add_argument("--institution", required=True)
    p_add.add_argument("--shelfmark", default=None)
    p_add.add_argument("--folio", default=None)
    p_add.add_argument("--date", default=None, dest="date")
    p_add.add_argument("--creator", default=None)
    p_add.add_argument("--source-url", default=None)
    p_add.add_argument("--rights-note", default=None)
    p_add.add_argument("--cited-in", default=None, help="comma-separated source ids")
    p_add.add_argument("--tags", default=None, help="comma-separated tags")
    p_add.add_argument("--notes", default=None)
    p_add.add_argument("--added-by", default=None)
    p_add.set_defaults(func=cmd_add)

    p_list = sub.add_parser("list", help="list registered assets")
    p_list.add_argument("--status", choices=["candidate", "approved", "rejected"], default=None)
    p_list.set_defaults(func=cmd_list)

    p_approve = sub.add_parser("approve", help="mark a candidate as approved (requires rights_note already set)")
    p_approve.add_argument("--id", required=True)
    p_approve.set_defaults(func=cmd_approve)

    p_check = sub.add_parser("check", help="verify registry integrity")
    p_check.set_defaults(func=cmd_check)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Phase 12 — Systems Improvement Report Generator
Consumes raw report lines from weekly-systems-improvement.sh
Generates a structured markdown report.
"""
import sys, re
from datetime import datetime as dt

def generate_report(raw_input, report_date, report_path, memory_log_path):
    lines = [l.strip() for l in raw_input.strip().split('\n') if l.strip()]

    # Parse each line: extract PROJECT, SEVERITY, body text
    seen = set()  # deduplicate duplicate [SEV][SEV] lines
    projects = {}

    for line in lines:
        if not line or line in seen:
            continue
        seen.add(line)

        pm = re.search(r'\[PROJECT:([^\]]+)\]', line)
        sm = re.search(r'\[(CRITICAL|WARNING|IMPROVE|OK)\]', line)
        if not pm:
            continue

        project = pm.group(1)
        severity = sm.group(1) if sm else 'UNKNOWN'

        # Strip all tags from body
        body = re.sub(r'\[PROJECT:[^\]]+\]', '', line)
        body = re.sub(r'\[(CRITICAL|WARNING|IMPROVE|OK)\]', '', body).strip()
        # Clean up duplicated words like "OK OK" or "CRITICAL CRITICAL"
        body = re.sub(r'\b(CRITICAL|WARNING|IMPROVE|OK)\s+\1\b', r'\1', body, flags=re.IGNORECASE)

        if project not in projects:
            projects[project] = {'severity': severity, 'items': []}

        # Upgrade severity if higher found
        sev_order = {'CRITICAL': 0, 'WARNING': 1, 'IMPROVE': 2, 'OK': 3}
        if sev_order.get(severity, 99) < sev_order.get(projects[project]['severity'], 99):
            projects[project]['severity'] = severity

        projects[project]['items'].append({'severity': severity, 'body': body})

    if not projects:
        print("No project-level issues found -- skipping report generation.")
        return False

    now_str = dt.now().strftime('%Y-%m-%d %H:%M:%S %Z')
    sev_icons = {'CRITICAL': '🔴 CRITICAL', 'WARNING': '🟡 WARNING', 'IMPROVE': '🟢 IMPROVE', 'OK': '✅ OK'}
    sev_sort = {'CRITICAL': 0, 'WARNING': 1, 'IMPROVE': 2}
    sorted_projects = sorted(projects.items(), key=lambda x: sev_sort.get(x[1]['severity'], 9))

    with open(report_path, 'w') as f:
        f.write("# Systems Improvement Report -- " + report_date + "\n\n")
        f.write("**Generated:** " + now_str + " via Phase 12 Weekly Systems Improvement Loop\n")
        f.write("**Schedule:** Every Monday 08:00 AM local\n")
        f.write("**Trigger:** " + str(len(projects)) + " project(s) with issues or improvement opportunities\n\n")
        f.write("---\n\n")

        for project, data in sorted_projects:
            sev = data['severity']
            sev_icon = sev_icons.get(sev, sev)
            items = data['items']

            if sev == 'CRITICAL':
                can_address = "Immediate investigation required -- service is down or degraded."
                needs_approval = "YES -- escalate to Marcelo immediately."
                nice_to_have = "Root cause analysis + permanent fix."
            elif sev == 'WARNING':
                can_address = "Check logs, monitor for pattern, restart if needed."
                needs_approval = "Only if persists beyond 1 week."
                nice_to_have = "Investigate root cause during next available cycle."
            else:
                can_address = "Monitor -- no immediate action needed."
                needs_approval = "None."
                nice_to_have = "Improvement opportunity for future sprint."

            f.write("## [" + project + "] " + sev_icon + "\n\n")
            f.write("- **What we can address now:** " + can_address + "\n")
            f.write("- **What needs Marcelo's approval:** " + needs_approval + "\n")
            f.write("- **What could be better / nice-to-have:** " + nice_to_have + "\n\n")
            f.write("**Details:**\n")
            for item in items:
                f.write("  - [" + item['severity'] + "] " + item['body'] + "\n")
            f.write("\n---\n\n")

        f.write("## Raw Check Output\n\n```\n")
        f.write(raw_input.strip())
        f.write("\n```\n")

    issue_count = sum(len(d['items']) for d in projects.values())
    with open(memory_log_path, 'a') as f:
        f.write("\n## Systems Improvement -- " + report_date + "\n\n")
        f.write("**Report:** `" + report_path + "`\n")
        f.write("**Projects affected:** " + ', '.join(projects.keys()) + "\n")
        f.write("**Total issues/improvements:** " + str(issue_count) + "\n\n")

    print("Report written: " + report_path)
    print("Memory log updated: " + memory_log_path)
    return True

if __name__ == '__main__':
    raw = sys.stdin.read()
    if not raw.strip():
        print("No input -- all systems healthy. Exiting.")
        sys.exit(0)
    report_date = sys.argv[1] if len(sys.argv) > 1 else dt.now().strftime('%Y-%m-%d')
    report_path = sys.argv[2] if len(sys.argv) > 2 else '/tmp/systems_report.md'
    memory_log_path = sys.argv[3] if len(sys.argv) > 3 else '/tmp/memory_capture_log.md'
    success = generate_report(raw, report_date, report_path, memory_log_path)
    sys.exit(0 if success else 1)
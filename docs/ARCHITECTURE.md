# Architecture

## Purpose

This lab simulates a small enterprise SOC pipeline. The goal is not just to install tools, but to show the flow from endpoint telemetry to analyst notification.

## Components

| Component | Role |
|---|---|
| Windows 11 Endpoint | Generates endpoint telemetry through Windows Security logs and Sysmon. |
| Wazuh Agent | Forwards Windows event data to the Wazuh Manager. |
| Wazuh Manager | Receives agent events and applies rules/decoders. |
| Wazuh Indexer | Stores normalized Wazuh alerts in `wazuh-alerts-*` indices. |
| Wazuh Dashboard | Analyst UI for searching events and validating alerts. |
| n8n | Automation/orchestration layer. |
| Ollama | Local LLM runtime for AI-assisted triage summaries. |
| Email/SMTP | Analyst notification channel. |
| Kali | Analyst/test workstation used for connectivity and port validation. |

## Data Flow

```text
1. Windows generates telemetry.
2. Wazuh Agent forwards the telemetry to SOC01.
3. Wazuh rules generate alerts.
4. Alerts are indexed in Wazuh Indexer.
5. n8n polls the Wazuh Indexer for new failed-logon alerts.
6. n8n deduplicates alert IDs to avoid repeated emails.
7. n8n sends the cleaned alert JSON to Ollama.
8. Ollama returns an analyst-readable triage summary.
9. n8n emails the summary and alert metadata.
```

## Ports Validated

| Port | Service | Purpose |
|---:|---|---|
| 443 | Wazuh Dashboard | Web UI |
| 1514 | Wazuh remoted | Agent event intake |
| 1515 | Wazuh authd | Agent enrollment |
| 55000 | Wazuh Server API | Agent/status/config API |
| 5678 | n8n | Automation UI/API |
| 11434 | Ollama | Local LLM API |
| 9200 | Wazuh Indexer | Alert search API; kept localhost-only and bridged for n8n in the lab |

## Design Choices

- **Dedicated SOC server:** Wazuh, n8n, and Ollama run on Ubuntu SOC01 instead of Kali.
- **Local LLM:** Alert data stays inside the lab instead of being sent to a cloud AI API.
- **Scheduled polling:** n8n polls the Wazuh Indexer every minute for new matching alerts.
- **Deduplication:** A Code node stores processed alert IDs to reduce duplicate notifications.

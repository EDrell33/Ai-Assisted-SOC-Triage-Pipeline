# Resume and Interview Summary

## Project Title

**AI-Assisted SOC Triage Pipeline with Wazuh, Sysmon, n8n, and Ollama**

## One-Line Resume Summary

Built an AI-assisted SOC automation lab that collects Windows endpoint telemetry with Wazuh/Sysmon, detects security events, enriches alerts with a local Ollama LLM through n8n, and sends automated analyst email notifications.

## Professional Project Summary

Designed and implemented a hands-on SOC automation lab that simulates an enterprise-style detection and triage workflow. The lab uses a Windows 11 endpoint with Wazuh Agent and Sysmon for telemetry collection, an Ubuntu SOC server running Wazuh Manager/Indexer/Dashboard for alerting and investigation, n8n for SOAR-style workflow automation, Ollama for local AI-assisted alert summarization, and SMTP email for analyst notification.

The project demonstrates end-to-end security operations competency: endpoint telemetry collection, SIEM alert validation, safe test-event generation, API-based alert retrieval, workflow automation, alert deduplication, AI-assisted triage, and public-facing technical documentation with sanitized evidence screenshots.

## Resume Bullet Options

Use 3-5 of these depending on resume space:

- Built an end-to-end SOC triage pipeline using **Wazuh, Sysmon, n8n, Ollama, Docker, and SMTP email notifications** to simulate enterprise detection and response workflows.
- Deployed and validated a Wazuh all-in-one SOC server on Ubuntu, including Manager, Indexer, Dashboard, agent enrollment, service validation, and network port testing.
- Configured a Windows 11 endpoint with **Wazuh Agent and Sysmon** to collect Security, System, Application, and Sysmon event telemetry.
- Generated and validated detection events for **PowerShell process execution**, **failed Windows logons/Event ID 4625**, and **local user/Administrators group changes**.
- Built an n8n automation workflow that queries Wazuh Indexer for new alerts, deduplicates alert IDs, sends alert JSON to a local Ollama LLM, and emails AI-assisted triage summaries to an analyst.
- Integrated Wazuh Server API and Wazuh Indexer/OpenSearch API into n8n to retrieve live agent status and real alert documents from `wazuh-alerts-*` indices.
- Implemented a local LLM triage workflow using **Ollama llama3.2:3b**, keeping alert data inside the lab environment instead of relying on cloud AI services.
- Documented the lab in a GitHub-ready portfolio repository with architecture diagrams, detection writeups, sanitized screenshots, safe example configurations, and troubleshooting notes.

## Short Interview Pitch

I built a small but realistic SOC automation lab to practice detection engineering and alert triage. A Windows 11 endpoint sends Security and Sysmon telemetry through the Wazuh Agent to an Ubuntu SOC server running Wazuh Manager, Indexer, and Dashboard. I validated detections for PowerShell execution, failed logons, and local account changes. Then I added n8n automation to query Wazuh alerts, deduplicate new events, send the alert JSON to a local Ollama LLM, and email a concise AI-assisted triage summary to the analyst.

The goal was to show the complete workflow from telemetry to detection to enrichment to notification, not just tool installation. I also documented the troubleshooting, API integrations, security limitations, and sanitized evidence screenshots for portfolio review.

## 30-Second Version

I built an AI-assisted SOC triage pipeline using Wazuh, Sysmon, n8n, and Ollama. The lab collects Windows endpoint telemetry, detects events like failed logons and suspicious PowerShell activity, pulls the alert data into n8n, summarizes it with a local LLM, and sends an analyst email notification. It gave me practical experience with SIEM telemetry, detection validation, API integration, automation, and SOC-style documentation.

## 60-Second Version

This was an end-to-end SOC automation lab. I used three VMs: Windows 11 as the monitored endpoint, Ubuntu as the SOC server, and Kali as the analyst/test system. Windows sent Wazuh Agent and Sysmon telemetry to Wazuh on Ubuntu. I validated detections for PowerShell execution, Windows failed logons, and local admin/user changes. After the SIEM side was working, I built n8n workflows to query the Wazuh APIs, pull real failed-logon alerts from Wazuh Indexer, deduplicate them, send the alert JSON to a local Ollama model, and email an AI-assisted triage summary. The final project shows telemetry, detection, automation, AI enrichment, and notification in one workflow.

## Competencies Demonstrated

| Area | Competency Shown |
|---|---|
| Endpoint telemetry | Configured Wazuh Agent and Sysmon collection on Windows 11. |
| SIEM operations | Deployed Wazuh Manager, Indexer, and Dashboard; searched and validated alerts. |
| Detection validation | Generated controlled events and confirmed Wazuh rules/event IDs. |
| API integration | Used Wazuh Server API and Indexer/OpenSearch API from n8n. |
| Automation | Built n8n workflows for polling, deduplication, AI summarization, and notification. |
| AI-assisted triage | Used local Ollama LLM to summarize alert context and suggest triage steps. |
| Security awareness | Avoided committing credentials, redacted personal data, and documented AI limitations. |
| Troubleshooting | Resolved Docker, n8n, Ollama binding, Wazuh Indexer access, SMTP, and query issues. |
| Documentation | Produced GitHub-ready docs, screenshots, architecture, and detection writeups. |

## Suggested Resume Entry

**AI-Assisted SOC Triage Pipeline — Wazuh, Sysmon, n8n, Ollama**  
Personal Cybersecurity Lab Project

- Built a three-VM SOC lab using Windows 11, Ubuntu SOC server, and Kali Linux to simulate enterprise endpoint monitoring and analyst workflows.
- Deployed Wazuh Manager/Indexer/Dashboard and enrolled a Windows endpoint with Wazuh Agent and Sysmon telemetry collection.
- Validated detections for PowerShell process activity, Windows failed logons/Event ID 4625, and local account/group modifications.
- Created n8n automation that queries Wazuh alert data, deduplicates events, sends alert JSON to a local Ollama LLM, and emails AI-assisted triage summaries.
- Published a sanitized portfolio repository with architecture documentation, detection writeups, workflow artifacts, troubleshooting notes, and evidence screenshots.

## Skills/Tools Keywords

`Wazuh`, `Sysmon`, `Windows Event Logs`, `SIEM`, `SOC Automation`, `n8n`, `Ollama`, `Docker`, `Linux`, `Ubuntu Server`, `Kali Linux`, `OpenSearch`, `Wazuh Indexer`, `REST API`, `SMTP`, `Detection Engineering`, `Incident Triage`, `MITRE ATT&CK`, `PowerShell Telemetry`, `Windows Event ID 4625`

# Screenshot Catalog

| # | File | What it proves |
|---:|---|---|
| 1 | [`01-network-connectivity-soc01-to-windows-kali.png`](../screenshots/01-network-connectivity-soc01-to-windows-kali.png) | SOC01 IP and successful ping tests to Windows and Kali. |
| 2 | [`02-network-connectivity-kali-to-soc01-windows.png`](../screenshots/02-network-connectivity-kali-to-soc01-windows.png) | Kali IP and successful ping tests to SOC01 and Windows. |
| 3 | [`03-network-connectivity-windows-to-soc01-kali.png`](../screenshots/03-network-connectivity-windows-to-soc01-kali.png) | Windows IP configuration and successful ping tests to SOC01 and Kali. |
| 4 | [`04-soc01-resources-and-disk.png`](../screenshots/04-soc01-resources-and-disk.png) | SOC01 system resources, hostname, IP, memory, disk, and CPU count. |
| 5 | [`05-wazuh-services-active.png`](../screenshots/05-wazuh-services-active.png) | Wazuh manager, indexer, and dashboard services active. |
| 6 | [`06-wazuh-agent-control-active.png`](../screenshots/06-wazuh-agent-control-active.png) | Wazuh agent_control showing manager and Windows endpoint active. |
| 7 | [`07-windows-wazuh-service-running.png`](../screenshots/07-windows-wazuh-service-running.png) | Windows WazuhSvc service running. |
| 8 | [`08-soc01-wazuh-listening-ports.png`](../screenshots/08-soc01-wazuh-listening-ports.png) | SOC01 Wazuh ports listening: 443, 1514, 1515, 55000. |
| 9 | [`09-kali-nmap-wazuh-ports.png`](../screenshots/09-kali-nmap-wazuh-ports.png) | Kali nmap scan confirming Wazuh ports open on SOC01. |
| 10 | [`10-wazuh-dashboard-agent-active.png`](../screenshots/10-wazuh-dashboard-agent-active.png) | Wazuh dashboard showing WIN11 endpoint active. |
| 11 | [`11-windows-sysmon-service-and-events.png`](../screenshots/11-windows-sysmon-service-and-events.png) | Sysmon64 service running and Sysmon operational events available. |
| 12 | [`12-windows-failed-logon-runas-test.png`](../screenshots/12-windows-failed-logon-runas-test.png) | Windows failed logon generation using runas with FakeUser. |
| 13 | [`13-wazuh-failed-logon-alerts.png`](../screenshots/13-wazuh-failed-logon-alerts.png) | Wazuh failed logon alerts for Event ID 4625. |
| 14 | [`14-windows-local-user-admin-change-test.png`](../screenshots/14-windows-local-user-admin-change-test.png) | Windows local user creation, admin group add/remove, and deletion test. |
| 15 | [`15-wazuh-local-user-admin-change-alerts.png`](../screenshots/15-wazuh-local-user-admin-change-alerts.png) | Wazuh alerts for local user/admin group changes. |
| 16 | [`16-docker-n8n-version-proof.png`](../screenshots/16-docker-n8n-version-proof.png) | Docker Engine, Docker Compose, and n8n container proof. |
| 17 | [`17-n8n-container-started.png`](../screenshots/17-n8n-container-started.png) | n8n container image pulled and started with port 5678 exposed. |
| 18 | [`18-n8n-web-ui-accessible.png`](../screenshots/18-n8n-web-ui-accessible.png) | n8n web UI accessible on SOC01. |
| 19 | [`19-ollama-model-installed-and-tested.png`](../screenshots/19-ollama-model-installed-and-tested.png) | Ollama llama3.2:3b model installed and tested locally. |
| 20 | [`20-n8n-container-can-reach-ollama.png`](../screenshots/20-n8n-container-can-reach-ollama.png) | Ollama API reachable from host and n8n container. |
| 21 | [`21-n8n-sample-alert-workflow.png`](../screenshots/21-n8n-sample-alert-workflow.png) | Manual n8n sample alert workflow canvas. |
| 22 | [`22-ai-triage-output-sample-alert.png`](../screenshots/22-ai-triage-output-sample-alert.png) | Ollama AI triage output for sample alert data. |
| 23 | [`23-n8n-fetches-wazuh-agents.png`](../screenshots/23-n8n-fetches-wazuh-agents.png) | n8n Get Wazuh Agents node returning live Wazuh agent data. |
| 24 | [`24-ai-summary-live-wazuh-api-data.png`](../screenshots/24-ai-summary-live-wazuh-api-data.png) | Ollama summary of live Wazuh API agent status data. |
| 25 | [`25-n8n-wazuh-api-to-ollama-workflow.png`](../screenshots/25-n8n-wazuh-api-to-ollama-workflow.png) | n8n workflow: Wazuh API Auth -> Get Wazuh Agents -> Ollama summary. |
| 26 | [`26-n8n-indexer-query-zero-hits.png`](../screenshots/26-n8n-indexer-query-zero-hits.png) | n8n Wazuh Indexer query succeeds with zero hits before generating new event. |
| 27 | [`27-n8n-deduplicates-and-extracts-alert.png`](../screenshots/27-n8n-deduplicates-and-extracts-alert.png) | n8n Code node deduplicates and extracts clean alert fields. |
| 28 | [`28-n8n-send-email-success-redacted.png`](../screenshots/28-n8n-send-email-success-redacted.png) | n8n Send Email success output; sanitized. |
| 29 | [`29-email-alert-received-redacted.png`](../screenshots/29-email-alert-received-redacted.png) | Received AI-assisted SOC alert email; sanitized. |
| 30 | [`30-n8n-wazuh-alert-ai-email-workflow-active.png`](../screenshots/30-n8n-wazuh-alert-ai-email-workflow-active.png) | Published/active n8n alert workflow canvas. |
| 31 | [`31-n8n-workflows-overview-published.png`](../screenshots/31-n8n-workflows-overview-published.png) | n8n workflows overview showing alert workflow published. |
| 32 | [`32-gmail-alert-inbox-preview-redacted.png`](../screenshots/32-gmail-alert-inbox-preview-redacted.png) | Gmail inbox preview showing Wazuh alert email received; sanitized. |
| 33 | [`33-wazuh-threat-hunting-service-events.png`](../screenshots/33-wazuh-threat-hunting-service-events.png) | Wazuh Threat Hunting results showing Windows service creation and agent-stop events. |
| 34 | [`34-wazuh-rule-61138-new-service-created.png`](../screenshots/34-wazuh-rule-61138-new-service-created.png) | Wazuh rule 61138 details for Windows Event ID 7045: new Windows service created. |

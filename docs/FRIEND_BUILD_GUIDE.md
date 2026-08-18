# Hand-Holding Build Guide: AI-Assisted SOC Triage Pipeline

This guide walks a new operator through building the same lab from scratch, including the fixes and troubleshooting lessons learned during the original build.

> **Lab purpose:** Build a practical SOC pipeline where Windows endpoint telemetry flows into Wazuh, n8n automatically queries new alerts, Ollama summarizes the alert locally, and the analyst receives an email notification.

## Final Architecture

```text
Windows 11 endpoint
  -> Wazuh Agent + Sysmon + Windows Security logs
  -> Ubuntu SOC01 Wazuh Manager / Indexer / Dashboard
  -> n8n automation
  -> Ollama local LLM
  -> Email alert notification
```

## Lab Systems

| VM | Role | Example IP |
|---|---|---:|
| Ubuntu Server SOC01 | Wazuh + n8n + Ollama | `192.168.56.103` |
| Windows 11 | Monitored endpoint | `192.168.56.104` |
| Kali Linux | Analyst/test box | `192.168.56.102` |

> Your IPs may differ. Replace the example addresses with your own.

## Safety Rules

- Do this only in your own lab or an authorized environment.
- Do not expose Wazuh, n8n, Ollama, or Wazuh Indexer directly to the public internet.
- Do not publish passwords, API tokens, Gmail app passwords, Wazuh JWTs, or n8n encryption keys.
- Private lab IPs such as `192.168.x.x` are usually safe for portfolio screenshots. Personal emails, phone numbers, public IPs, and secrets are not.

---

# Phase 1 — Build the VMs

## Recommended Resources

### Ubuntu SOC01

| Resource | Recommendation |
|---|---:|
| Disk | 60 GB minimum, 100 GB preferred |
| RAM | 8 GB minimum realistic |
| CPU | 4 vCPU preferred |
| Disk type | Dynamic, single-file virtual disk is fine |

Do not use 20 GB for this stack. It is too tight for Wazuh + Docker + Ollama.

### Windows 11

| Resource | Recommendation |
|---|---:|
| RAM | 4-8 GB |
| Disk | 60 GB+ |

### Kali Linux

| Resource | Recommendation |
|---|---:|
| RAM | 2-4 GB |
| Disk | 40 GB+ |

## Network

Put all VMs on the same host-only/NAT/lab network so they can reach each other.

Example:

```text
192.168.56.0/24
```

---

# Phase 2 — Verify Network Connectivity

Run on each Linux VM:

```bash
ip -br addr
```

On Windows PowerShell:

```powershell
ipconfig
```

Test pings:

From SOC01:

```bash
ping -c 4 192.168.56.102
ping -c 4 192.168.56.104
```

From Kali:

```bash
ping -c 4 192.168.56.103
ping -c 4 192.168.56.104
```

From Windows:

```powershell
ping 192.168.56.103
ping 192.168.56.102
```

## Troubleshooting: Linux Cannot Ping Windows

If Windows can ping Linux but Linux cannot ping Windows, the network may still be fine. Windows Defender Firewall often blocks inbound ICMP.

On Windows Admin PowerShell, allow lab-only ICMP:

```powershell
New-NetFirewallRule -DisplayName "Allow ICMPv4 Echo Request - SOC Lab" -Protocol ICMPv4 -IcmpType 8 -Direction Inbound -Action Allow
```

Screenshot proof:

```text
01-network-connectivity-soc01-to-windows-kali.png
02-network-connectivity-kali-to-soc01-windows.png
03-network-connectivity-windows-to-soc01-kali.png
```

---

# Phase 3 — Prepare Ubuntu SOC01

Update packages:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget unzip gnupg apt-transport-https lsb-release ca-certificates net-tools
```

Check resources:

```bash
hostname
ip -br addr
free -h
df -h
lsblk
nproc
```

## Troubleshooting: Ubuntu Disk Shows Less Space Than Expected

Ubuntu Server may create a 60 GB virtual disk but only allocate around 29 GB to `/`.

Check:

```bash
df -h
lsblk
```

If the root logical volume is smaller than the disk, expand it:

```bash
sudo lvextend -r -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
```

Verify:

```bash
df -h
lsblk
```

Screenshot proof:

```text
04-soc01-resources-and-disk.png
```

---

# Phase 4 — Install Wazuh All-in-One on SOC01

> Use the current official Wazuh installation docs for the exact latest download URL. The commands below show the pattern.

Download installer:

```bash
curl -sO https://packages.wazuh.com/4.*/wazuh-install.sh
```

Before running it, check the file:

```bash
head -n 5 wazuh-install.sh
```

It should look like a shell script, not XML/HTML.

## Troubleshooting: Installer Download Is XML/HTML

If the file starts with something like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

then you downloaded an error page. Delete it and get the correct URL from Wazuh docs:

```bash
rm -f wazuh-install.sh
```

Run Wazuh all-in-one installer:

```bash
sudo bash ./wazuh-install.sh -a
```

Save the generated Wazuh credentials somewhere private. Do **not** publish them.

## Verify Wazuh Services

```bash
sudo systemctl status wazuh-manager
sudo systemctl status wazuh-indexer
sudo systemctl status wazuh-dashboard
```

Quick check:

```bash
systemctl is-active wazuh-manager wazuh-indexer wazuh-dashboard
```

Expected:

```text
active
active
active
```

Check listening ports:

```bash
sudo ss -ltnp | egrep ':443|:1514|:1515|:55000'
```

Expected Wazuh ports:

| Port | Purpose |
|---:|---|
| 443 | Wazuh Dashboard |
| 1514 | Agent event intake |
| 1515 | Agent enrollment/auth |
| 55000 | Wazuh Server API |

From Kali:

```bash
sudo nmap -p 443,1514,1515,55000 192.168.56.103
```

## Troubleshooting: nmap Says Unknown

`55000/tcp open unknown` is okay. nmap is guessing service names. Port `55000` is still the Wazuh API if the service is active on SOC01.

Screenshot proof:

```text
05-wazuh-services-active.png
08-soc01-wazuh-listening-ports.png
09-kali-nmap-wazuh-ports.png
```

Open dashboard:

```text
https://192.168.56.103
```

---

# Phase 5 — Enroll Windows Wazuh Agent

In Wazuh Dashboard:

```text
Agents management -> Deploy new agent
```

Use:

```text
Windows
Manager IP: 192.168.56.103
Agent name: WIN11-ENDPOINT01
```

Run the generated installer command on Windows as Administrator.

Start service:

```powershell
NET START WazuhSvc
Get-Service WazuhSvc
```

On SOC01 verify:

```bash
sudo /var/ossec/bin/agent_control -l
```

Expected:

```text
WIN11-ENDPOINT01 ... active
```

Screenshot proof:

```text
06-wazuh-agent-control-active.png
07-windows-wazuh-service-running.png
10-wazuh-dashboard-agent-active.png
```

---

# Phase 6 — Install Sysmon and Configure Wazuh Event Collection

Download Sysmon from Microsoft Sysinternals and a reputable Sysmon config, such as SwiftOnSecurity or Olaf Hartong's modular config.

Example paths:

```text
C:\Tools\Sysmon\Sysmon64.exe
C:\Tools\Sysmon\sysmonconfig.xml
```

Install Sysmon from Admin PowerShell:

```powershell
cd C:\Tools\Sysmon
.\Sysmon64.exe -accepteula -i .\sysmonconfig.xml
```

Verify:

```powershell
Get-Service Sysmon64
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 10
```

Edit Wazuh Agent config:

```text
C:\Program Files (x86)\ossec-agent\ossec.conf
```

Add/confirm event channel collection blocks:

```xml
<localfile>
  <location>Application</location>
  <log_format>eventchannel</log_format>
</localfile>

<localfile>
  <location>Security</location>
  <log_format>eventchannel</log_format>
</localfile>

<localfile>
  <location>Microsoft-Windows-Sysmon/Operational</location>
  <log_format>eventchannel</log_format>
</localfile>

<localfile>
  <location>System</location>
  <log_format>eventchannel</log_format>
</localfile>
```

Restart Wazuh Agent:

```powershell
Restart-Service WazuhSvc
```

Screenshot proof:

```text
11-windows-sysmon-service-and-events.png
```

---

# Phase 7 — Generate Safe Detection Events

## Detection 1: PowerShell Process Activity

On Windows Admin PowerShell:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Write-Output 'SOC lab PowerShell telemetry test'"
```

Search Wazuh Dashboard:

```text
agent.name: "WIN11-ENDPOINT01" AND powershell
```

Useful fields:

```text
rule.id: 92027
rule.description: Powershell process spawned
rule.level: 4
```

## Troubleshooting: No PowerShell Results

Check for stale filters. If Wazuh has a filter like:

```text
rule.level: 15 to +∞
```

remove it. The PowerShell event may be level 4.

## Detection 2: Failed Logon Event ID 4625

On Windows:

```powershell
runas /user:FakeUser cmd
```

Enter an incorrect password a few times.

Verify locally:

```powershell
Get-WinEvent -LogName Security -MaxEvents 20 |
  Where-Object {$_.Id -eq 4625} |
  Select-Object TimeCreated, Id, ProviderName, Message
```

Search Wazuh:

```text
data.win.system.eventID: 4625
```

or:

```text
FakeUser
```

Screenshot proof:

```text
12-windows-failed-logon-runas-test.png
13-wazuh-failed-logon-alerts.png
```

## Detection 3: Local User/Admin Group Change

On Windows Admin PowerShell:

```powershell
net user soclabtest P@ssw0rd123! /add
net localgroup administrators soclabtest /add
net localgroup administrators soclabtest /delete
net user soclabtest /delete
```

Verify locally:

```powershell
Get-WinEvent -LogName Security -MaxEvents 50 |
  Where-Object {$_.Id -in 4720,4732,4726} |
  Select-Object TimeCreated, Id, ProviderName, Message
```

Search Wazuh:

```text
soclabtest
```

or:

```text
data.win.system.eventID: 4720 OR data.win.system.eventID: 4732 OR data.win.system.eventID: 4726
```

Screenshot proof:

```text
14-windows-local-user-admin-change-test.png
15-wazuh-local-user-admin-change-alerts.png
```

---

# Phase 8 — Install Docker and n8n on SOC01

Install Docker packages:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

Log out/in or run a new shell so group membership applies.

Create n8n folder:

```bash
mkdir -p ~/soc-ai-automation/n8n
cd ~/soc-ai-automation/n8n
mkdir -p n8n_data
```

Create `docker-compose.yml`:

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    container_name: soc-n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      N8N_PORT: "5678"
      N8N_PROTOCOL: "http"
      GENERIC_TIMEZONE: "America/Chicago"
      N8N_ENCRYPTION_KEY: "CHANGE_THIS_TO_A_LONG_RANDOM_VALUE"
      N8N_SECURE_COOKIE: "false"
    volumes:
      - ./n8n_data:/home/node/.n8n
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Validate:

```bash
docker-compose config
```

Start:

```bash
docker-compose up -d
```

Verify:

```bash
docker ps
```

Open:

```text
http://192.168.56.103:5678
```

## Troubleshooting: `services must be a mapping`

Your YAML indentation is wrong. `services:` must contain an indented service name like `n8n:`.

## Troubleshooting: n8n Secure Cookie Error

If n8n complains about secure cookies over HTTP, add:

```yaml
N8N_SECURE_COOKIE: "false"
```

This is acceptable only because this is an isolated internal lab.

## Troubleshooting: n8n Permission Crash

If logs show:

```text
EACCES: permission denied, open '/home/node/.n8n/config'
```

Fix:

```bash
cd ~/soc-ai-automation/n8n
docker-compose down
sudo chown -R 1000:1000 ./n8n_data
sudo chmod -R u+rwX ./n8n_data
docker-compose up -d
```

Screenshot proof:

```text
16-docker-n8n-version-proof.png
17-n8n-container-started.png
18-n8n-web-ui-accessible.png
```

---

# Phase 9 — Install Ollama on SOC01

Install Ollama using the official method:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Pull a small model:

```bash
ollama pull llama3.2:3b
```

Test:

```bash
ollama run llama3.2:3b
```

Check API:

```bash
curl http://localhost:11434/api/tags
```

## Make Ollama Reachable from n8n Container

By default, Ollama may listen only on `127.0.0.1`. n8n in Docker needs host access.

Create systemd override:

```bash
sudo systemctl edit ollama
```

Add:

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

Restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

Verify:

```bash
sudo ss -ltnp | grep 11434
curl http://localhost:11434/api/tags
```

From n8n container:

```bash
docker exec -it soc-n8n wget -qO- http://host.docker.internal:11434/api/tags
```

Screenshot proof:

```text
19-ollama-model-installed-and-tested.png
20-n8n-container-can-reach-ollama.png
```

---

# Phase 10 — n8n Sample AI Triage Workflow

In n8n, create:

```text
Manual Trigger -> Edit Fields -> HTTP Request to Ollama
```

HTTP Request node:

```text
Method: POST
URL: http://host.docker.internal:11434/api/generate
Body Content Type: JSON
```

Example JSON body:

```json
{
  "model": "llama3.2:3b",
  "prompt": "You are a SOC analyst. Summarize this sample failed logon alert and provide triage steps.",
  "stream": false
}
```

## Troubleshooting: `stream` Type Error

If Ollama says:

```text
json: cannot unmarshal string into Go struct field GenerateRequest.stream of type bool
```

then n8n sent `"false"` as a string instead of `false` as a boolean. Use a full JSON expression body if needed.

Screenshot proof:

```text
21-n8n-sample-alert-workflow.png
22-ai-triage-output-sample-alert.png
```

---

# Phase 11 — Connect n8n to Wazuh Server API

The Wazuh Server API is usually:

```text
https://host.docker.internal:55000
```

Create n8n Basic Auth credential for Wazuh API:

```text
Username: wazuh
Password: your Wazuh API password
```

Do not screenshot or publish this credential.

Create workflow:

```text
Manual Trigger -> Wazuh API Auth -> Get Wazuh Agents -> Ollama Summarize Wazuh Agents
```

## Wazuh API Auth Node

```text
Method: POST
URL: https://host.docker.internal:55000/security/user/authenticate?raw=true
Authentication: Basic Auth
Ignore SSL Issues: true
```

The n8n output shape may be:

```json
{ "data": "eyJ..." }
```

## Get Wazuh Agents Node

```text
Method: GET
URL: https://host.docker.internal:55000/agents?select=id,name,ip,status&pretty=true
Header: Authorization: Bearer {{$json.data}}
Ignore SSL Issues: true
```

## Troubleshooting: `Bearer [object Object]`

If you used:

```text
Bearer {{$json}}
```

that becomes:

```text
Bearer [object Object]
```

Use:

```text
Bearer {{$json.data}}
```

Screenshot proof:

```text
23-n8n-fetches-wazuh-agents.png
24-ai-summary-live-wazuh-api-data.png
25-n8n-wazuh-api-to-ollama-workflow.png
```

---

# Phase 12 — Query Real Alerts from Wazuh Indexer

Wazuh Server API on `55000` is for agent/status data. Real alerts live in Wazuh Indexer/OpenSearch on `9200`.

Endpoint:

```text
https://host.docker.internal:9200/wazuh-alerts-*/_search
```

Use Wazuh Indexer/Dashboard credential, often `admin`, not the Wazuh API user.

## Troubleshooting: n8n Gets `ECONNREFUSED 172.17.0.1:9200`

Check SOC01:

```bash
sudo ss -ltnp | grep 9200
```

If Wazuh Indexer listens only on localhost:

```text
127.0.0.1:9200
```

then Docker cannot reach it through `host.docker.internal`.

Lab-safe bridge:

```bash
sudo apt install -y socat
sudo nohup socat TCP-LISTEN:9200,bind=172.17.0.1,fork,reuseaddr TCP:127.0.0.1:9200 >/tmp/wazuh-indexer-proxy.log 2>&1 &
sudo ss -ltnp | grep 9200
```

Expected: one listener on localhost from Wazuh Indexer and one listener on `172.17.0.1` from `socat`.

## Troubleshooting: `401 Unauthorized`

Good news: the network path works. Now fix credentials. Use Wazuh Indexer/Dashboard credentials, not the Wazuh API credential.

## Query Failed Logons

n8n HTTP Request node:

```text
Method: POST
URL: https://host.docker.internal:9200/wazuh-alerts-*/_search
Authentication: Basic Auth
Credential: Wazuh Indexer/Dashboard
Ignore SSL Issues: true
Body Content Type: JSON
```

Body:

```json
{
  "size": 5,
  "sort": [
    { "timestamp": { "order": "desc" } }
  ],
  "query": {
    "bool": {
      "filter": [
        { "range": { "timestamp": { "gte": "now-2m", "lte": "now" } } },
        { "term": { "agent.name": "WIN11-ENDPOINT01" } },
        { "term": { "data.win.system.eventID": "4625" } }
      ]
    }
  }
}
```

If you get zero hits, widen the time range:

```json
{ "gte": "now-30m", "lte": "now" }
```

or generate a fresh failed logon.

Screenshot proof:

```text
26-n8n-indexer-query-zero-hits.png
```

---

# Phase 13 — Deduplicate New Alerts

Add n8n Code node:

```text
Language: JavaScript
Mode: Run Once for All Items
```

Delete default code and paste:

```javascript
const staticData = $getWorkflowStaticData('global');

if (!staticData.seenAlertIds) {
  staticData.seenAlertIds = [];
}

const input = $input.first().json;
const hits = input.hits?.hits || [];
const newAlerts = [];

for (const hit of hits.reverse()) {
  const alertId = hit._id;

  if (!staticData.seenAlertIds.includes(alertId)) {
    staticData.seenAlertIds.push(alertId);

    newAlerts.push({
      json: {
        alert_id: alertId,
        index: hit._index,
        timestamp: hit._source.timestamp,
        agent_name: hit._source.agent?.name,
        agent_ip: hit._source.agent?.ip,
        rule_id: hit._source.rule?.id,
        rule_level: hit._source.rule?.level,
        rule_description: hit._source.rule?.description,
        event_id: hit._source.data?.win?.system?.eventID,
        username:
          hit._source.data?.win?.eventdata?.targetUserName ||
          hit._source.data?.win?.eventdata?.TargetUserName,
        source_ip:
          hit._source.data?.win?.eventdata?.ipAddress ||
          hit._source.data?.win?.eventdata?.IpAddress,
        full_alert: hit._source
      }
    });
  }
}

staticData.seenAlertIds = staticData.seenAlertIds.slice(-500);

return newAlerts;
```

Screenshot proof:

```text
27-n8n-deduplicates-and-extracts-alert.png
```

---

# Phase 14 — Send Real Alert to Ollama

Add HTTP Request node:

```text
Method: POST
URL: http://host.docker.internal:11434/api/generate
Body Content Type: JSON
Specify Body: JSON expression
```

Expression:

```javascript
={{
{
  "model": "llama3.2:3b",
  "prompt": "You are a SOC analyst assistant. Summarize this Wazuh failed-logon alert for an email notification. Include severity, endpoint, username, event ID, likely risk, MITRE ATT&CK mapping if possible, and 3 immediate triage steps. Keep it concise and professional. Alert JSON: " + JSON.stringify($json),
  "stream": false
}
}}
```

Professional note: validate the MITRE mapping. Failed logons often align more naturally with `T1110 - Brute Force` if repeated, or `T1078 - Valid Accounts` depending on context.

---

# Phase 15 — Send Email Notification

Use n8n Email node or SMTP node.

For Gmail SMTP:

```text
Host: smtp.gmail.com
Port: 465
SSL/TLS: enabled
User: your Gmail address
Password: Gmail App Password, not your normal password
```

If Gmail rejects login:

```text
535-5.7.8 Username and Password not accepted
```

then enable 2-Step Verification and create a Gmail App Password:

```text
https://myaccount.google.com/apppasswords
```

Do not publish screenshots of Google account security pages, app passwords, phone numbers, or recovery emails.

Subject expression:

```javascript
={{ "Wazuh Alert: " + $node["Deduplicate New Alerts"].json.rule_description }}
```

HTML body expression:

```javascript
={{
"<h2>AI-Assisted SOC Alert Notification</h2>" +
"<h3>Ollama Summary</h3>" +
"<pre>" + $json.response + "</pre>" +
"<hr>" +
"<h3>Alert Metadata</h3>" +
"<ul>" +
"<li><strong>Timestamp:</strong> " + $node["Deduplicate New Alerts"].json.timestamp + "</li>" +
"<li><strong>Agent:</strong> " + $node["Deduplicate New Alerts"].json.agent_name + "</li>" +
"<li><strong>Agent IP:</strong> " + $node["Deduplicate New Alerts"].json.agent_ip + "</li>" +
"<li><strong>Rule ID:</strong> " + $node["Deduplicate New Alerts"].json.rule_id + "</li>" +
"<li><strong>Rule Level:</strong> " + $node["Deduplicate New Alerts"].json.rule_level + "</li>" +
"<li><strong>Rule Description:</strong> " + $node["Deduplicate New Alerts"].json.rule_description + "</li>" +
"<li><strong>Event ID:</strong> " + $node["Deduplicate New Alerts"].json.event_id + "</li>" +
"<li><strong>Username:</strong> " + $node["Deduplicate New Alerts"].json.username + "</li>" +
"<li><strong>Source IP:</strong> " + $node["Deduplicate New Alerts"].json.source_ip + "</li>" +
"</ul>"
}}
```

Screenshot proof:

```text
28-n8n-send-email-success-redacted.png
29-email-alert-received-redacted.png
32-gmail-alert-inbox-preview-redacted.png
```

---

# Phase 16 — Publish/Activate Workflow

Your final workflow should be:

```text
Schedule Trigger
  -> Query Wazuh Failed Logons
  -> Deduplicate New Alerts
  -> Ollama Summarize Alert
  -> Send an Email
```

In n8n, use the top-right **Publish** or **Activate workflow** control.

The bottom **Execute workflow** button is manual testing only.

Screenshot proof:

```text
30-n8n-wazuh-alert-ai-email-workflow-active.png
31-n8n-workflows-overview-published.png
```

---

# Final Test

1. Generate a fresh failed logon on Windows:

```powershell
runas /user:FakeUser cmd
```

2. Wait for Wazuh to ingest the event.
3. Wait for n8n scheduled workflow to poll.
4. Confirm email arrives.
5. Confirm no duplicate emails are repeatedly sent for the same alert.

Expected final result:

```text
Windows failed logon
  -> Wazuh alert
  -> n8n query
  -> Deduplication
  -> Ollama summary
  -> Email notification
```

---

# Public Portfolio Checklist

Before publishing screenshots or GitHub docs, redact:

- Gmail addresses
- phone numbers
- recovery emails
- Wazuh passwords
- Wazuh JWT tokens
- Gmail app passwords
- n8n encryption keys
- n8n credential screens
- raw Windows SIDs or real local usernames if visible

Safe to show:

- private lab IPs like `192.168.109.x`
- fake usernames like `FakeUser`
- lab account names like `soclabtest`
- Wazuh rule IDs
- event IDs
- workflow diagrams

---

# Common Mistakes Quick Reference

| Problem | Likely Cause | Fix |
|---|---|---|
| Ubuntu/Kali cannot ping Windows | Windows firewall blocks ICMP | Add inbound ICMPv4 Echo rule |
| Wazuh installer opens as XML | Bad/error-page download | Re-download from official Wazuh docs |
| Wazuh search shows no PowerShell events | High severity filter still active | Remove filter, widen time range |
| `docker compose` says no config file | Wrong directory | `cd ~/soc-ai-automation/n8n` |
| `services must be a mapping` | Bad YAML indentation | Fix `services:` -> `n8n:` structure |
| n8n secure cookie warning | HTTP lab access | Add `N8N_SECURE_COOKIE=false` |
| n8n EACCES config error | Bad bind mount ownership | `chown -R 1000:1000 ./n8n_data` |
| n8n cannot reach Ollama | Ollama bound to localhost only | Set `OLLAMA_HOST=0.0.0.0:11434` |
| Ollama `stream` type error | `false` sent as string | Use JSON expression with boolean `false` |
| Wazuh API token gives `[object Object]` | Wrong n8n expression | Use `{{$json.data}}` |
| n8n Indexer query gets `ECONNREFUSED` | Indexer listens on localhost only | Use lab `socat` Docker bridge proxy |
| Indexer query gets `401` | Wrong credentials | Use Indexer/Dashboard credentials |
| Gmail `535` auth failure | Normal password used | Use Gmail App Password |

---

# What the Builder Should Understand at the End

The person who completes this lab should be able to explain:

1. What endpoint telemetry is and why Sysmon improves Windows visibility.
2. How Wazuh Agent, Manager, Indexer, and Dashboard work together.
3. The difference between Wazuh Server API and Wazuh Indexer/OpenSearch API.
4. Why alert deduplication matters in scheduled automations.
5. How n8n acts as a SOAR-style workflow engine.
6. What a local LLM adds to triage and why its output must be validated.
7. How to safely sanitize portfolio evidence before publishing.

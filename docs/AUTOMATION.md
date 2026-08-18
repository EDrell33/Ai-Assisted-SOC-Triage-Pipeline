# n8n + Wazuh + Ollama Automation

## Workflow 1: Manual Sample Alert to Ollama

```text
Manual Trigger -> Edit Fields -> HTTP Request to Ollama
```

Purpose: prove n8n could call the local Ollama API and receive an AI triage response.

## Workflow 2: Wazuh API Agent Status to Ollama

```text
Manual Trigger -> Wazuh API Auth -> Get Wazuh Agents -> Ollama Summarize Wazuh Agents
```

Purpose: prove n8n could authenticate to the Wazuh Server API on port `55000`, retrieve live Wazuh agent data, and summarize it with a local LLM.

## Workflow 3: Wazuh Alert AI Email Workflow

```text
Schedule Trigger -> Query Wazuh Failed Logons -> Deduplicate New Alerts -> Ollama Summarize Alert -> Send an Email
```

Purpose: produce near-real-time analyst notifications for new failed-logon alerts.

### Query Wazuh Failed Logons

The workflow queries Wazuh Indexer/OpenSearch:

```text
POST https://host.docker.internal:9200/wazuh-alerts-*/_search
```

The query filters for:

- `agent.name: WIN11-ENDPOINT01`
- `data.win.system.eventID: 4625`
- a short recent time window

See [`../artifacts/wazuh/failed-logon-indexer-query.example.json`](../artifacts/wazuh/failed-logon-indexer-query.example.json).

### Deduplicate New Alerts

The n8n Code node stores previously processed alert IDs using workflow static data. This prevents sending the same alert every polling cycle.

See [`../artifacts/n8n/deduplicate-new-alerts.js`](../artifacts/n8n/deduplicate-new-alerts.js).

### Ollama Summarize Alert

The workflow sends cleaned alert JSON to:

```text
POST http://host.docker.internal:11434/api/generate
```

Model used:

```text
llama3.2:3b
```

### Send Email

n8n sends the AI summary and extracted metadata through SMTP.

Secrets are not stored in this repo. Use `.env.example` and n8n encrypted credentials.

## Docker Bridge Note for Wazuh Indexer

In this lab, Wazuh Indexer listened on localhost only:

```text
127.0.0.1:9200
```

The n8n container could not reach that directly through Docker networking. A lab-only proxy was used to bridge Docker host gateway traffic to localhost:

```bash
sudo nohup socat TCP-LISTEN:9200,bind=172.17.0.1,fork,reuseaddr TCP:127.0.0.1:9200 >/tmp/wazuh-indexer-proxy.log 2>&1 &
```

This avoided exposing Wazuh Indexer on the full lab LAN. In production, this should be replaced with a properly designed network/security model.

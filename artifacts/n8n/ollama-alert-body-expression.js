={{
{
  "model": "llama3.2:3b",
  "prompt": "You are a SOC analyst assistant. Summarize this Wazuh failed-logon alert for an email notification. Include severity, endpoint, username, event ID, likely risk, MITRE ATT&CK mapping if possible, and 3 immediate triage steps. Keep it concise and professional. Alert JSON: " + JSON.stringify($json),
  "stream": false
}
}}

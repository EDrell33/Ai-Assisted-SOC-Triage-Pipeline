# Detection Writeups

## Detection 1: PowerShell Process Activity

| Field | Value |
|---|---|
| Data source | Sysmon Event ID 1 / Wazuh Sysmon rules |
| Wazuh rule | `92027` |
| Rule level | `4` |
| Description | PowerShell process spawned PowerShell instance |
| Screenshot | [`../screenshots/16-wazuh-rule-92027-powershell-process.png`](../screenshots/16-wazuh-rule-92027-powershell-process.png) |

### Test Procedure

A benign PowerShell command was executed on the Windows endpoint to generate process telemetry.

### Analyst Notes

PowerShell activity is common in administration, but it is also heavily used by attackers. This detection should be triaged by checking command line, parent process, user context, and surrounding events.

---

## Detection 2: Failed Logon

| Field | Value |
|---|---|
| Data source | Windows Security Event Log |
| Windows Event ID | `4625` |
| Wazuh rule | `60122` |
| Rule level | `5` |
| Description | Logon Failure - Unknown user or bad password |
| Test username | `FakeUser` |
| Screenshot | [`../screenshots/18-wazuh-failed-logon-alerts.png`](../screenshots/18-wazuh-failed-logon-alerts.png) |

### Test Procedure

The Windows `runas` command was used with a fake username and invalid password to generate failed authentication attempts.

### Triage Steps

1. Confirm whether the username is valid or expected.
2. Check source IP / logon type.
3. Look for repeated attempts in a short time window.
4. Correlate with successful logons or other suspicious endpoint events.

### ATT&CK Context

Potential mappings depend on context:

- `T1110` - Brute Force, when repeated failed attempts indicate guessing/spraying.
- `T1078` - Valid Accounts, if failures surround suspicious valid-account usage.

AI-generated mappings should be reviewed by the analyst.

---

## Detection 3: Local User and Administrators Group Changes

| Event ID | Meaning |
|---:|---|
| `4720` | User account created |
| `4732` | Member added to security-enabled local group |
| `4726` | User account deleted |

| Field | Value |
|---|---|
| Test account | `soclabtest` |
| Screenshot | [`../screenshots/20-wazuh-local-user-admin-change-alerts.png`](../screenshots/20-wazuh-local-user-admin-change-alerts.png) |

### Test Procedure

A local test account was created, added to the local Administrators group, removed, and deleted.

### Analyst Notes

Unexpected local account creation or Administrators group membership changes are high-value escalation indicators. Triage should validate who performed the change, whether a change ticket exists, and whether any suspicious process or remote logon preceded the change.

---

## Detection 4: New Windows Service Created

| Field | Value |
|---|---|
| Data source | Windows System Event Log |
| Windows Event ID | `7045` |
| Wazuh rule | `61138` |
| Rule level | `5` |
| Description | New Windows Service Created |
| ATT&CK technique | `T1543.003` — Windows Service |
| Screenshots | [`../screenshots/41-wazuh-threat-hunting-service-events.png`](../screenshots/41-wazuh-threat-hunting-service-events.png), [`../screenshots/42-wazuh-rule-61138-new-service-created.png`](../screenshots/42-wazuh-rule-61138-new-service-created.png) |

### Analyst Notes

New services can be legitimate software-installation artifacts, but adversaries also use services for persistence or privilege escalation. Triage should inspect the service name, binary path, signer, creating process, user context, and nearby endpoint activity before assigning severity.

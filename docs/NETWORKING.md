# Lab Networking

The three virtual machines share the isolated `192.168.56.0/24` lab network.

## Address plan

| VM | Hostname / purpose | IPv4 address |
|---|---|---:|
| Ubuntu Server | `SOC01` — Wazuh, n8n, and Ollama | `192.168.56.103/24` |
| Windows 11 | Monitored endpoint | `192.168.56.104/24` |
| Kali Linux | Analyst and authorized test machine | `192.168.56.102/24` |

Use static guest addresses or hypervisor DHCP reservations so Wazuh agent enrollment and analyst bookmarks remain stable. Adapter names, DNS servers, and the default gateway depend on the hypervisor and host configuration, so they are intentionally not assumed here.

## Connectivity checks

From SOC01:

```bash
ping -c 4 192.168.56.102
ping -c 4 192.168.56.104
```

From Kali:

```bash
ping -c 4 192.168.56.103
ping -c 4 192.168.56.104
sudo nmap -sT -p 443,1514,1515,55000 192.168.56.103
```

From Windows PowerShell:

```powershell
Test-Connection 192.168.56.103 -Count 4
Test-Connection 192.168.56.102 -Count 4
Test-NetConnection 192.168.56.103 -Port 1514
```

## Expected SOC01 services

| Port | Protocol | Purpose | Intended source |
|---:|---|---|---|
| 443 | TCP | Wazuh Dashboard | Kali / trusted host only |
| 1514 | TCP | Wazuh agent event intake | Windows endpoint |
| 1515 | TCP | Wazuh agent enrollment | Windows endpoint |
| 55000 | TCP | Wazuh API | SOC01-local n8n workflow |
| 5678 | TCP | n8n UI | Kali / trusted host only |
| 11434 | TCP | Ollama API | SOC01-local n8n workflow |
| 9200 | TCP | Wazuh Indexer | SOC01-local bridge only |

> Keep this network isolated or protected by host and guest firewalls. Do not forward these management services to the public internet. Limit access to the listed lab systems and verify firewall rules before enabling them.

## Historical screenshots

The screenshots were imported from the source lab as evidence of the completed workflow. A few network screenshots may display earlier DHCP addresses. The canonical address plan for this repository is the `192.168.56.0/24` table above.

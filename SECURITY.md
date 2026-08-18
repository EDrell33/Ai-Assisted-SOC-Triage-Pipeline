# Security and Sanitization

This repository is designed for public portfolio use.

Do not commit:

- Wazuh passwords
- n8n encryption keys
- Gmail app passwords
- JWT tokens
- live `.env` files
- credential exports
- personal phone numbers or unredacted account security pages

Private RFC1918 lab addresses such as `192.168.x.x` are kept for topology clarity. Public IPs, VPN overlay IPs, or organization/customer addresses should be redacted.

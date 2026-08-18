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

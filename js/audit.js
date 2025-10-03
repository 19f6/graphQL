async function loadAuditRatioData() {
  try {
    const u = (await fetchGraphQL(QUERIES?.AUDIT_RATIO))?.data?.user?.[0] || {};
    const data = {
      auditRatio: u.auditRatio || 0,
      up: { aggregate: { sum: { amount: u.totalUp || 0 } } },
      down: { aggregate: { sum: { amount: u.totalDown || 0 } } }
    };
    window.displayAuditRatio?.(data);
  } catch {
    window.displayAuditRatio?.({
      auditRatio: 0,
      up: { aggregate: { sum: { amount: 0 } } },
      down: { aggregate: { sum: { amount: 0 } } }
    });
  }
}

function formatBytesDecimal(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1000;
  if (bytes >= k * k) return (bytes / (k * k)).toFixed(2) + ' MB';
  if (bytes >= k) return Math.round(bytes / k) + ' KB';
  return bytes + ' B';
}

const formatBytes = formatBytesDecimal;

function displayAuditRatio(userData) {
  const auditRatio = parseFloat(userData.auditRatio) || 0;
  const totalUpBytes = userData.up?.aggregate?.sum?.amount || 0;
  const totalDownBytes = userData.down?.aggregate?.sum?.amount || 0;

  const doneEl = document.getElementById("audits-done");
  const receivedEl = document.getElementById("audits-received");
  const ratioEl = document.getElementById("audit-ratio-value");

  if (doneEl) doneEl.textContent = formatBytes(totalUpBytes);
  if (receivedEl) receivedEl.textContent = formatBytes(totalDownBytes);
  if (ratioEl) ratioEl.textContent = auditRatio.toFixed(1);

  const doneBar = document.getElementById("audits-done-bar");
  const receivedBar = document.getElementById("audits-received-bar");
  const maxBarWidth = 100;
  const maxValue = Math.max(totalUpBytes, totalDownBytes, 1);

  if (doneBar) {
    doneBar.setAttribute("width", (totalUpBytes / maxValue) * maxBarWidth);
    doneBar.style.fill = "#09600c";
  }

  if (receivedBar) {
    receivedBar.setAttribute("width", (totalDownBytes / maxValue) * maxBarWidth);
    receivedBar.style.fill = "#09600c";
  }
}

window.displayAuditRatio = displayAuditRatio;

document.addEventListener("DOMContentLoaded", () => {
  loadAuditRatioData();
  loadAuditChart()
});
async function loadAuditChart() {
  const response = await fetchGraphQL(QUERIES.AUDIT_CHART);
  const user = response.data.user[0];

  const failedCount = user.failedAudits.aggregate.count;
  const validCount = user.validAudits.aggregate.count;
  const total = failedCount + validCount;

  const values = [failedCount, validCount];
  const colors = ["#e74c3c", "#09600c"];
  const labels = ["Failed", "Valid"];

  <svg id="auditChart" viewBox="0 0 220 220" preserveAspectRatio="xMidYMid meet"></svg>

  if (total === 0) {
    svg.innerHTML = `
      <text 
        x="${center.x}" 
        y="${center.y}" 
        fill="#666" 
        font-size="16px" 
        text-anchor="middle" 
        dominant-baseline="middle">
        No audit data
      </text>
    `;
    return;
  }

  let startAngle = 0;
  let markup = "";

  values.forEach((value, i) => {
    if (value === 0) return;

    const sliceAngle = (value / total) * 2 * Math.PI;

    if (sliceAngle >= 2 * Math.PI - 0.001) {
      markup += `
        <circle 
          cx="${center.x}" 
          cy="${center.y}" 
          r="${radius}" 
          fill="${colors[i]}"></circle>
        <text 
          x="${center.x}" 
          y="${center.y}" 
          fill="#fff" 
          font-size="16px" 
          text-anchor="middle" 
          dominant-baseline="middle">
          ${labels[i]} (${value})
        </text>
      `;
    } else {
      const endAngle = startAngle + sliceAngle;

      const x1 = center.x + radius * Math.cos(startAngle);
      const y1 = center.y + radius * Math.sin(startAngle);
      const x2 = center.x + radius * Math.cos(endAngle);
      const y2 = center.y + radius * Math.sin(endAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

      const pathData = `
        M ${center.x},${center.y}
        L ${x1},${y1}
        A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}
        Z
      `;

      markup += `
        <path d="${pathData}" fill="${colors[i]}"></path>
      `;

      const midAngle = startAngle + sliceAngle / 2;
      const labelX = center.x + (radius / 1.5) * Math.cos(midAngle);
      const labelY = center.y + (radius / 1.5) * Math.sin(midAngle);

      markup += `
        <text 
          x="${labelX}" 
          y="${labelY}" 
          fill="#fff" 
          font-size="16px" 
          text-anchor="middle" 
          dominant-baseline="middle">
          ${labels[i]} (${value})
        </text>
      `;

      startAngle = endAngle;
    }
  });

  svg.innerHTML = markup;
}

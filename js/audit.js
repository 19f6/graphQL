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

  const svg = document.getElementById("auditChart");
  svg.innerHTML = ""; 
  const width = 220;
  const height = 220;
  const radius = 100;
  const center = { x: width / 2, y: height / 2 };

  // Handle case where there's no data
  if (total === 0) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", center.x);
    text.setAttribute("y", center.y);
    text.setAttribute("fill", "#666");
    text.setAttribute("font-size", "16px");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = "No audit data";
    svg.appendChild(text);
    return;
  }

  let startAngle = 0;

  values.forEach((value, i) => {
    if (value === 0) return; // Skip zero values entirely

    const sliceAngle = (value / total) * 2 * Math.PI;
    
    // Handle full circle case (when only one category has data)
    if (sliceAngle >= 2 * Math.PI - 0.001) {
      // Create a full circle instead of an arc
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", center.x);
      circle.setAttribute("cy", center.y);
      circle.setAttribute("r", radius);
      circle.setAttribute("fill", colors[i]);
      svg.appendChild(circle);
      
      // Add label for full circle
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", center.x);
      text.setAttribute("y", center.y);
      text.setAttribute("fill", "#fff");
      text.setAttribute("font-size", "16px");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.textContent = `${labels[i]} (${value})`;
      svg.appendChild(text);
    } else {
      // Create arc for partial slices
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

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", colors[i]);
      svg.appendChild(path);

      // Add label for arc slice
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = center.x + (radius / 1.5) * Math.cos(midAngle);
      const labelY = center.y + (radius / 1.5) * Math.sin(midAngle);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", labelX);
      text.setAttribute("y", labelY);
      text.setAttribute("fill", "#fff");
      text.setAttribute("font-size", "16px");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.textContent = `${labels[i]} (${value})`;
      svg.appendChild(text);

      startAngle = endAngle;
    }
  });
}
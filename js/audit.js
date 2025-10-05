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

  const options = {
    chart: {
      type: 'bar',
      background: 'transparent',
      foreColor: '#d8b4fe'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6
      }
    },
    series: [{
      name: "Bytes",
      data: [
        { x: 'Audits Done', y: totalUpBytes },
        { x: 'Audits Received', y: totalDownBytes }
      ]
    }],
    colors: ['#a855f7', '#7c3aed'],
    dataLabels: {
      enabled: true,
      formatter: (val) => formatBytes(val),
      style: {
        colors: ['#f3e8ff']
      }
    },
    xaxis: {
      labels: {
        formatter: (val) => formatBytes(val),
        style: {
          colors: '#d8b4fe'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#d8b4fe'
        }
      }
    },
    grid: {
      borderColor: '#3b1a6f'
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const chartContainer = document.querySelector("#auditRatioChart");
  if (chartContainer) {
    chartContainer.innerHTML = "";
    const chart = new ApexCharts(chartContainer, options);
    chart.render();
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

  if (total === 0) {
    document.getElementById("auditChart").innerHTML = `
      <p style="text-align:center; color:#d8b4fe; font-size:16px;">
        No audit data
      </p>`;
    return;
  }

  const options = {
    chart: {
      type: 'bar',
      background: 'transparent',
      foreColor: '#d8b4fe'
    },
    plotOptions: {
      bar: {
        vertical: true,
        distributed: true,
        borderRadius: 6
      }
    },
    series: [{
      data: [
        { x: 'Failed', y: failedCount },
        { x: 'Passed', y: validCount }
      ]
    }],
    colors: ['#ec4899', '#a855f7'],
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#f3e8ff']
      }
    },
    xaxis: {
      title: {
        text: 'Audits Count',
        style: {
          color: '#d8b4fe'
        }
      },
      labels: {
        style: {
          colors: '#d8b4fe'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '14px',
          colors: '#d8b4fe'
        }
      }
    },
    grid: {
      borderColor: '#3b1a6f'
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const chart = new ApexCharts(document.querySelector("#auditChart"), options);
  chart.render();
}
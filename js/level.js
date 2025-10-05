async function loadLevelProgress() {
  const response = await fetchGraphQL(QUERIES.lEVEL);

  const tx = response.data?.transaction || [];
  const level = tx.length > 0 ? tx[0].amount : 0;

  // Destroy old chart if exists
  const container = document.querySelector("#levelChart");
  container.innerHTML = "";

  const options = {
    chart: {
     type: "donut",
      background: 'transparent',
      foreColor: '#d8b4fe'
    },
    series: [level, Math.max(0, 100 - level)],
    labels: ["Progress", "Remaining"],
    colors: ["#a855f7", "#3b1a6f"],
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Level",
              fontSize: "18px",
              color:'#d8b4fe',
              formatter: () => `${level}`
            }
          }
        }
      }
    },
      stroke: {
      width: 0
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const chart = new ApexCharts(container, options);
  chart.render();
}

document.addEventListener("DOMContentLoaded", () => {
  loadLevelProgress();
});

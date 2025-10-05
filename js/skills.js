async function loadSkills() {
  try {
    const data = await fetchGraphQL(QUERIES.USER_SKILLS);
    renderSkillsRadar(data);
  } catch (err) {
    console.error("Error fetching skills:", err);
  }
}

function renderSkillsRadar(data) {
  const skillsData = data.data.user[0];

  const skills = [
    { label: "Programming", value: skillsData.skills_prog[0]?.amount || 0 },
    { label: "Go", value: skillsData.skills_go[0]?.amount || 0 },
    { label: "Front-End", value: skillsData.skills_frontend[0]?.amount || 0 },
    { label: "JavaScript", value: skillsData.skills_js[0]?.amount || 0 },
    { label: "HTML", value: skillsData.skills_html[0]?.amount || 0 },
    { label: "Back-End", value: skillsData.skills_backend[0]?.amount || 0 }
  ];


  const container = document.querySelector("#skillsRadar");
  container.innerHTML = "";

  const options = {
    chart: {
      type: "radar",
      height: 400
    },
    series: [{
      name: "Skill Level",
      data: skills.map(s => s.value)
    }],
    labels: skills.map(s => s.label),
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColors: '#4c2a7f',
          connectorColors: '#4c2a7f',
          fill: {
            colors: ['#2d1b4e', '#1a0b2e']
          }
        }
      }
    },
    colors: ["#a855f7"], // limegreen-like
    fill: {
      opacity: 0.4
    },
    markers: {
      size: 4,
      colors: ["#1a0b2e"],
      strokeColors: "#c084fc",
      strokeWidth: 2
    },
    stroke: {
      width: 2,
      colors: ['#a855f7']
    },
    xaxis: {
      labels: {
        style: {
          colors: ['#d8b4fe', '#d8b4fe', '#d8b4fe', '#d8b4fe', '#d8b4fe', '#d8b4fe'],
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      max: 100,
      min: 0,
      tickAmount: 5,
      labels: {
        formatter: val => `${val}%`,
        style: {
          colors: '#d8b4fe'
        }
      }
    },
    tooltip: {
      theme: 'dark'
    }

  };

  const chart = new ApexCharts(container, options);
  chart.render();
}

document.addEventListener("DOMContentLoaded", loadSkills);

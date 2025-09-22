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

  const svg = document.querySelector("#skillsRadar");
  const plotGroup = svg.querySelector(".skills-plot");
  const labelsGroup = svg.querySelector(".labels");
  const gridGroup = svg.querySelector(".grid-lines");

  plotGroup.innerHTML = "";
  labelsGroup.innerHTML = "";
  gridGroup.innerHTML = "";

  const radius = 150;
  const levels = 5;
  const angleSlice = (Math.PI * 2) / skills.length;


  gridGroup.innerHTML = Array.from({ length: levels }, (_, i) => {
    const r = (radius / levels) * (i + 1);
    const points = skills.map((_, idx) => {
      const angle = idx * angleSlice - Math.PI / 2;
      return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
    });
    return `<path d="M${points.join(" L")} Z" stroke="rgba(255,255,255,0.2)" fill="none"></path>`;
  }).join("");


  const valuePoints = skills.map((s, idx) => {
    const angle = idx * angleSlice - Math.PI / 2;
    const r = (s.value / 100) * radius;
    return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
  });

  plotGroup.innerHTML = `
    <path d="M${valuePoints.join(" L")} Z" 
          stroke="limegreen" 
          fill="rgba(0,255,0,0.2)" 
          stroke-width="2"></path>
    ${valuePoints.map(p => {
      const [x, y] = p.split(",");
      return `<circle cx="${x}" cy="${y}" r="4" fill="black" stroke="white"></circle>`;
    }).join("")}
  `;


  labelsGroup.innerHTML = skills.map((s, idx) => {
    const angle = idx * angleSlice - Math.PI / 2;
    const labelX = (radius + 25) * Math.cos(angle);
    const labelY = (radius + 25) * Math.sin(angle);
    return `<text x="${labelX}" y="${labelY}" 
                  text-anchor="middle" 
                  dominant-baseline="middle" 
                  fill="white" font-size="12px">
              ${s.label} ${s.value}%
            </text>`;
  }).join("");
}

document.addEventListener("DOMContentLoaded", loadSkills);

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

  for (let i = 1; i <= levels; i++) {
    const r = (radius / levels) * i;
    const points = skills.map((_, idx) => {
      const angle = idx * angleSlice - Math.PI / 2;
      return [r * Math.cos(angle), r * Math.sin(angle)];
    });

    const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z";

    const gridPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    gridPath.setAttribute("d", pathData);
    gridPath.setAttribute("stroke", "rgba(255,255,255,0.2)");
    gridPath.setAttribute("fill", "none");
    gridGroup.appendChild(gridPath);
  }

  // Skill values polygon
  const valuePoints = skills.map((s, idx) => {
    const angle = idx * angleSlice - Math.PI / 2;
    const r = (s.value / 100) * radius;
    return [r * Math.cos(angle), r * Math.sin(angle)];
  });

  const valuePathData = valuePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z";

  const valuePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  valuePath.setAttribute("d", valuePathData);
  valuePath.setAttribute("stroke", "limegreen");
  valuePath.setAttribute("fill", "rgba(0,255,0,0.2)");
  valuePath.setAttribute("stroke-width", "2");
  plotGroup.appendChild(valuePath);

  // Points + labels
  valuePoints.forEach((p, idx) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", p[0]);
    circle.setAttribute("cy", p[1]);
    circle.setAttribute("r", 4);
    circle.setAttribute("fill", "black");
    circle.setAttribute("stroke", "white");
    plotGroup.appendChild(circle);

    const angle = idx * angleSlice - Math.PI / 2;
    const labelX = (radius + 25) * Math.cos(angle);
    const labelY = (radius + 25) * Math.sin(angle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", labelX);
    text.setAttribute("y", labelY);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "white");
    text.style.fontSize = "12px";
    text.textContent = `${skills[idx].label}\n${skills[idx].value}%`;
    labelsGroup.appendChild(text);
  });
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", loadSkills);

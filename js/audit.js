async function loadLevelProgress() {
  const response = await fetchGraphQL(QUERIES.lEVEL);

  const tx = response.data?.transaction || [];
  const level = tx.length > 0 ? tx[0].amount : 0;

  const circle = document.querySelector(".level-progress");
  const lv = document.querySelector(".level-text");

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = circumference;
  const progress = (level / 100) * circumference;
  circle.style.strokeDashoffset = circumference - progress;
  lv.textContent = level;
}
document.addEventListener("DOMContentLoaded", () => {
  loadLevelProgress();
});

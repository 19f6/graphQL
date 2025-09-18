const logoutBtn = document.getElementById("logout");

function handleLogout() {
  sessionStorage.removeItem("token");
  window.location.replace("index.html");
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", handleLogout);
}



const token = sessionStorage.getItem("token");
if (!token) {
  window.location.replace("index.html");
}

async function fetchGraphQL(query) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.replace("index.html");
    return;
  }

  try {
    const response = await fetch(
      "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GraphQL data");
    }

    const data = await response.json();

    if (data.errors || !data.data) {
      throw new Error("GraphQL returned errors or no data");
    }

    return data;
  } catch (error) {
    console.error(error);
    sessionStorage.removeItem("token");
    window.location.replace("index.html");
  }
}

async function fetchInfo() {
  try {
    const response = await fetchGraphQL(QUERIES.USER_INFO);
    if (!response) return;

    const user = response.data?.user?.[0];
    if (!user) {
      sessionStorage.removeItem("token");
      window.location.replace("index.html");
      return;
    }

    const labelsResponse = await fetchGraphQL(QUERIES.INFO);
    if (!labelsResponse) return;

    const labels = labelsResponse.data?.user?.[0]?.labels || [];
    const cohortNames = labels.map(label => label.labelName).join(", ");

    const genderEmoji =
      user.attrs.genders?.toLowerCase() === "female" ? "👩🏻" : "🧑🏻";

    const infoEl = document.getElementById("info");
    if (infoEl) {
      infoEl.innerHTML = `
        <div style="font-size: 2rem; text-align: center;">${genderEmoji}</div>
        <h3>${user.attrs.firstName} ${user.attrs.lastName}</h3>
        <p>Username: ${user.login}</p>
        <p>Email: ${user.email}</p>
        <p>ID: ${user.id}</p>
        <p>Cohorts: ${cohortNames || "N/A"}</p>
      `;
    }
  } catch (error) {
    console.error(error);
    sessionStorage.removeItem("token");
    window.location.replace("index.html");
  }
}

fetchInfo();
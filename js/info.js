const logoutBtn = document.getElementById("logout");

function handlelogout() {
  sessionStorage.removeItem("token");
  window.location.replace("index.html");
}
logoutBtn.addEventListener("click", handlelogout);

async function fetchGraphQL(query) {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.replace("index.html");
    return;
  }

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
    sessionStorage.removeItem("token");
    window.location.replace("index.html");
    throw new Error("Failed to fetch GraphQL data");
  }

  const data = await response.json();

  if (data.errors || !data.data) {
    sessionStorage.removeItem("token");
    window.location.replace("index.html");
    return;
  }

  return data;
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

    const genderEmoji = user.attrs.genders === "Female" ? "👩🏻" : "🧑🏻";
    document.getElementById("info").innerHTML = `
      <div style="font-size: 2rem; text-align: center;">${genderEmoji}</div>
      <h3>${user.attrs.firstName + " " + user.attrs.lastName}</h3>
      <p>${user.login}</p>
      <p>Email: ${user.email}</p>
      <p>ID: ${user.id}</p>
      <p>${cohortNames || "N/A"}</p>
    `;
  } catch (error) {
    sessionStorage.removeItem("token");
    window.location.replace("index.html");
  }
}

if (!sessionStorage.getItem("token")) {
  window.location.replace("index.html");
} else {
  fetchInfo();

  history.pushState(null, "", location.href);
  window.addEventListener("popstate", function () {
    history.pushState(null, "", location.href);
  });
}

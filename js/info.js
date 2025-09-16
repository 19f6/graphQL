const logoutBtn=document.getElementById("logout")
function handlelogout(){
sessionStorage.removeItem("token")
window.location.href="login.html"
}
logoutBtn.addEventListener("click",handlelogout)
async function fetchGraphQL(query) {
    const token=sessionStorage.getItem("token")
    if(!token){
        window.location.href="login.html"
        return
    }
    const response = await fetch (
        "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
        {
            method: "POST",
            headers:{
                Authorization: `Bearer ${token}`,
               Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!response.ok) throw new Error("Failed to fetch GraphQL data");
  return response.json();
}
async function fetchInfo() {
  try {
    const response = await fetchGraphQL(QUERIES.USER_INFO);
    const user = response.data.user[0];
    const labelsResponse = await fetchGraphQL(QUERIES.INFO);
    const labels = labelsResponse.data.user[0]?.labels || [];
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
    document.getElementById("info").textContent =
      "Error fetching profile data: " + error.message;
    sessionStorage.removeItem("token");
  }
}


fetchInfo();

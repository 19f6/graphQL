  const LEVEL_QUERY = `
  {
    transaction(
      order_by: {amount: desc}
      limit: 1
      where: {
        type: {_eq: "level"},
        path: {_like: "/bahrain/bh-module%"}
      }
    ) {
      amount
    }
  }`;

const USER_SKILLS_QUERY = ` {
  user {
    skills_prog: transactions(where: {type: {_eq: "skill_prog"}}, order_by: {amount: desc}, limit: 1) {
      amount
      type
    }
    skills_backend: transactions(where: {type: {_eq: "skill_back-end"}}, order_by: {amount: desc}, limit: 1) {
      amount
      type
    }
    skills_frontend: transactions(where: {type: {_eq: "skill_front-end"}}, order_by: {amount: desc}, limit: 1) {
      amount
      type
    }
    skills_go: transactions(where: {type: {_eq: "skill_go"}}, order_by: {amount: desc}, limit: 1) {
      amount
      type
    }
    skills_js: transactions(where: {type: {_eq: "skill_js"}}, order_by: {amount: desc}, limit: 1) {
      amount
      type
    }
    skills_html: transactions(where: {type: {_eq: "skill_html"}}, order_by: {amount: desc}, limit: 1) {
      amount
      type
    }
  }
}`;

const USER_INFO_QUERY = `
{
  user {
    id
    campus
    attrs
    login
    email
  }
}`;
const INFO_QUERY=`
{
user{
id
labels{
labelName
}
}
}`;

const AUDIT_RATIO_QUERY = `
{
  user {
    auditRatio
    totalUp
    totalDown
  }
}`;


const AUDIT_CHART_QUERY = `
{
  user {
    validAudits: audits_aggregate(where: {grade: {_gte: 1}}) {
      aggregate { count }
    }
    failedAudits: audits_aggregate(where: {grade: {_lt: 1}}) {
      aggregate { count }
    }
  }
}`;

const QUERIES  = {
  USER_INFO: USER_INFO_QUERY,
  USER_SKILLS: USER_SKILLS_QUERY,
  AUDIT_RATIO: AUDIT_RATIO_QUERY,
  INFO: INFO_QUERY,
  lEVEL: LEVEL_QUERY,
  AUDIT_CHART: AUDIT_CHART_QUERY
};

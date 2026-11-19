const pricingData = {
  freeTier: {
    computeHours: 750,
    storageGB: 5,
    databaseInstances: 1,
    egressGB: 100
  },
  rates: {
    computeOnDemandPerHour: 0.0416,
    computeReservedPerHour: 0.025,
    serverlessPerMillionReq: 0.20,
    storagePerGB: 0.023,
    databasePerInstanceMonth: 15.0,
    egressPerGB: 0.09
  }
};

const presets = {
  hobby: { serverHours: 700, storageGB: 5, dbInstances: 1, egressGB: 80, budgetLimit: 10 },
  startup: { serverHours: 950, storageGB: 120, dbInstances: 2, egressGB: 250, budgetLimit: 35 },
  enterprise: { serverHours: 2200, storageGB: 850, dbInstances: 4, egressGB: 1500, budgetLimit: 150 }
};

let latestReportMarkdown = "";

// Dismiss Preloader with smooth animation
function hidePreloader() {
  const preloader = document.getElementById("pagePreloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("preloader-hidden");
    }, 450);
  }
}

async function initPricing() {
  try {
    const res = await fetch("./pricing.json");
    if (res.ok) {
      const json = await res.json();
      if (json.freeTier) {
        pricingData.freeTier.computeHours = json.freeTier.computeHours ?? 750;
        pricingData.freeTier.storageGB = json.freeTier.storageGB ?? 5;
        pricingData.freeTier.databaseInstances = json.freeTier.databaseInstances ?? 1;
        pricingData.freeTier.egressGB = json.freeTier.egressGB ?? 100;
      }
      if (json.rates) {
        Object.assign(pricingData.rates, json.rates);
      }
    }
  } catch (err) {
    // Seamless fallback to built-in dataset when opened offline/locally
  }
  calculateCosts();
  hidePreloader();
}

function calculateCosts() {
  const serverHours = Math.max(0, parseFloat(document.getElementById("serverHours").value) || 0);
  const storageGB = Math.max(0, parseFloat(document.getElementById("storageGB").value) || 0);
  const dbInstances = Math.max(0, parseInt(document.getElementById("dbInstances").value, 10) || 0);
  const egressGB = Math.max(0, parseFloat(document.getElementById("egressGB").value) || 0);
  const budgetLimit = Math.max(1, parseFloat(document.getElementById("budgetLimit").value) || 25);

  const ft = pricingData.freeTier;
  const r = pricingData.rates;

  // Apply Free-Tier allowances first
  const billableCompute = Math.max(0, serverHours - ft.computeHours);
  const billableStorage = Math.max(0, storageGB - ft.storageGB);
  const billableDB = Math.max(0, dbInstances - ft.databaseInstances);
  const billableEgress = Math.max(0, egressGB - ft.egressGB);

  // Calculate individual monthly expenditures
  const computeCost = billableCompute * r.computeOnDemandPerHour;
  const storageCost = billableStorage * r.storagePerGB;
  const dbCost = billableDB * r.databasePerInstanceMonth;
  const egressCost = billableEgress * r.egressPerGB;

  const netTotal = computeCost + storageCost + dbCost + egressCost;

  // Gross cost without Free Tier
  const grossTotal =
    serverHours * r.computeOnDemandPerHour +
    storageGB * r.storagePerGB +
    dbInstances * r.databasePerInstanceMonth +
    egressGB * r.egressPerGB;
  const savedAmount = Math.max(0, grossTotal - netTotal);

  // Reserved (1-Year) vs On-Demand comparison
  const reservedComputeCost = billableCompute * r.computeReservedPerHour;
  const reservedTotal = reservedComputeCost + storageCost + dbCost + egressCost;
  const reservedSavings = Math.max(0, netTotal - reservedTotal);

  // Serverless vs Provisioned VM comparison
  const estimatedRequestsMillions = Math.max(0.5, (serverHours / 750) * 2.5);
  const serverlessComputeCost = estimatedRequestsMillions * r.serverlessPerMillionReq;
  const serverlessText =
    serverHours <= 850
      ? `Serverless (~$${serverlessComputeCost.toFixed(2)}/mo for ~${estimatedRequestsMillions.toFixed(1)}M reqs) is more cost-efficient for intermittent, bursty traffic patterns.`
      : `Provisioned VM ($${computeCost.toFixed(2)}/mo billed) offers significantly higher cost predictability and unit economics for 24/7 baseline compute workloads.`;

  // Update Primary Summary Metrics
  document.getElementById("netTotal").textContent = `$${netTotal.toFixed(2)}`;
  document.getElementById("freeTierSaved").innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
    Free Tier Saved: $${savedAmount.toFixed(2)}
  `;

  // Update Auxiliary Metric Displays
  const dailyEl = document.getElementById("dailyEstimate");
  if (dailyEl) dailyEl.textContent = `$${(netTotal / 30).toFixed(2)}`;

  const grossEl = document.getElementById("grossTotal");
  if (grossEl) grossEl.textContent = `$${grossTotal.toFixed(2)}`;

  // Update Visual Cost Distribution Bar & Percentages
  if (netTotal > 0) {
    const pCompute = ((computeCost / netTotal) * 100);
    const pStorage = ((storageCost / netTotal) * 100);
    const pDB = ((dbCost / netTotal) * 100);
    const pEgress = ((egressCost / netTotal) * 100);

    document.getElementById("barCompute").style.width = `${pCompute}%`;
    document.getElementById("barStorage").style.width = `${pStorage}%`;
    document.getElementById("barDB").style.width = `${pDB}%`;
    document.getElementById("barEgress").style.width = `${pEgress}%`;

    const pctCompEl = document.getElementById("pctCompute");
    if (pctCompEl) pctCompEl.textContent = `${Math.round(pCompute)}%`;
    const pctStorEl = document.getElementById("pctStorage");
    if (pctStorEl) pctStorEl.textContent = `${Math.round(pStorage)}%`;
    const pctDBEl = document.getElementById("pctDB");
    if (pctDBEl) pctDBEl.textContent = `${Math.round(pDB)}%`;
    const pctEgrEl = document.getElementById("pctEgress");
    if (pctEgrEl) pctEgrEl.textContent = `${Math.round(pEgress)}%`;
  } else {
    document.getElementById("barCompute").style.width = "25%";
    document.getElementById("barStorage").style.width = "25%";
    document.getElementById("barDB").style.width = "25%";
    document.getElementById("barEgress").style.width = "25%";

    const pctCompEl = document.getElementById("pctCompute");
    if (pctCompEl) pctCompEl.textContent = "0%";
    const pctStorEl = document.getElementById("pctStorage");
    if (pctStorEl) pctStorEl.textContent = "0%";
    const pctDBEl = document.getElementById("pctDB");
    if (pctDBEl) pctDBEl.textContent = "0%";
    const pctEgrEl = document.getElementById("pctEgress");
    if (pctEgrEl) pctEgrEl.textContent = "0%";
  }

  // Update Budget Alert Banner
  const alertBox = document.getElementById("budgetAlert");
  if (netTotal <= budgetLimit) {
    alertBox.className = "alert-box alert-ok";
    alertBox.innerHTML = `
      <span style="font-size: 1.15rem; margin-right: 0.6rem;">✅</span>
      <div>
        <strong>Within Budget Target:</strong> Estimated spend ($${netTotal.toFixed(2)}) is
        <strong>$${(budgetLimit - netTotal).toFixed(2)} below</strong> your $${budgetLimit.toFixed(2)} monthly ceiling.
      </div>
    `;
  } else {
    alertBox.className = "alert-box alert-warn";
    alertBox.innerHTML = `
      <span style="font-size: 1.15rem; margin-right: 0.6rem;">⚠️</span>
      <div>
        <strong>Budget Overrun Alert:</strong> Exceeds target ceiling by
        <strong>$${(netTotal - budgetLimit).toFixed(2)}</strong>. Consider 1-Yr Reserved commitments or routing static media through CloudFront/CDN caching.
      </div>
    `;
  }

  // Update Resource Breakdown Table
  document.getElementById("breakdownBody").innerHTML = `
    <tr>
      <td><strong>Virtual Compute</strong> (vCPU / RAM)</td>
      <td>${serverHours.toLocaleString()} hrs</td>
      <td>${billableCompute.toLocaleString()} hrs</td>
      <td><strong>$${computeCost.toFixed(2)}</strong></td>
    </tr>
    <tr>
      <td><strong>Cloud Storage</strong> (S3 / Block)</td>
      <td>${storageGB.toLocaleString()} GB</td>
      <td>${billableStorage.toLocaleString()} GB</td>
      <td><strong>$${storageCost.toFixed(2)}</strong></td>
    </tr>
    <tr>
      <td><strong>Database Instances</strong> (Managed)</td>
      <td>${dbInstances} node${dbInstances === 1 ? "" : "s"}</td>
      <td>${billableDB} node${billableDB === 1 ? "" : "s"}</td>
      <td><strong>$${dbCost.toFixed(2)}</strong></td>
    </tr>
    <tr>
      <td><strong>Outbound Egress</strong> (Public WAN)</td>
      <td>${egressGB.toLocaleString()} GB</td>
      <td>${billableEgress.toLocaleString()} GB</td>
      <td><strong>$${egressCost.toFixed(2)}</strong></td>
    </tr>
  `;

  // Update Comparison Cards
  document.getElementById("reservedCompare").textContent =
    `1-Year Reserved Commitment: $${reservedTotal.toFixed(2)}/mo (Saves $${reservedSavings.toFixed(2)}/mo compared to On-Demand compute pricing).`;
  document.getElementById("serverlessCompare").textContent = serverlessText;

  // Prepare Downloadable Markdown Report
  latestReportMarkdown = `# Cloud Infrastructure Cost Estimation Report
Generated on: ${new Date().toISOString().split("T")[0]}
Engine: CloudCostIQ Free-Tier Aware FinOps Modeling

## 1. Workload Parameters
- **Virtual Server Hours:** ${serverHours} hrs (Billable after 750h Free Tier: ${billableCompute} hrs)
- **Storage Volume:** ${storageGB} GB (Billable after 5GB Free Tier: ${billableStorage} GB)
- **Database Instances:** ${dbInstances} (Billable after 1 Free Tier instance: ${billableDB})
- **Egress Bandwidth:** ${egressGB} GB (Billable after 100GB Free Tier: ${billableEgress} GB)

## 2. Monthly Expenditure Breakdown
- **Virtual Compute Cost:** $${computeCost.toFixed(2)}
- **Cloud Storage Cost:** $${storageCost.toFixed(2)}
- **Managed Database Cost:** $${dbCost.toFixed(2)}
- **Egress Bandwidth Cost:** $${egressCost.toFixed(2)}
- **Net Billed Total (On-Demand):** $${netTotal.toFixed(2)} / month
- **Free-Tier Deduction Savings:** $${savedAmount.toFixed(2)} / month
- **1-Year Reserved Instance Total:** $${reservedTotal.toFixed(2)} / month

## 3. Budget Alert & Architecture Recommendations
- **Target Monthly Budget:** $${budgetLimit.toFixed(2)}
- **Budget Status:** ${netTotal <= budgetLimit ? "Within Budget" : `Over Budget by $${(netTotal - budgetLimit).toFixed(2)}`}
- **Compute Strategy:** ${serverlessText}
- **Optimization Action:** ${
    reservedSavings > 0
      ? `Commit to 1-Year Reserved Instances to save $${reservedSavings.toFixed(2)}/month.`
      : "Workload fits comfortably within Free Tier compute limits."
  }
`;
}

// Sync number inputs <-> range sliders & trigger live calculation
function bindInputPair(numberId, rangeId) {
  const numEl = document.getElementById(numberId);
  const rangeEl = document.getElementById(rangeId);

  numEl.addEventListener("input", () => {
    rangeEl.value = numEl.value;
    calculateCosts();
  });

  rangeEl.addEventListener("input", () => {
    numEl.value = rangeEl.value;
    calculateCosts();
  });
}

bindInputPair("serverHours", "serverHoursRange");
bindInputPair("storageGB", "storageGBRange");
bindInputPair("dbInstances", "dbInstancesRange");
bindInputPair("egressGB", "egressGBRange");

document.getElementById("budgetLimit").addEventListener("input", calculateCosts);

document.getElementById("calculateBtn").addEventListener("click", () => {
  calculateCosts();
  const badge = document.getElementById("liveSyncBadge");
  badge.innerHTML = `<span class="pulse-dot-green"></span> ✓ Updated`;
  setTimeout(() => {
    badge.innerHTML = `<span class="pulse-dot-green"></span> Live Sync`;
  }, 1200);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  applyPreset("startup");
});

function applyPreset(key) {
  const p = presets[key];
  if (!p) return;

  document.getElementById("serverHours").value = p.serverHours;
  document.getElementById("serverHoursRange").value = p.serverHours;
  document.getElementById("storageGB").value = p.storageGB;
  document.getElementById("storageGBRange").value = p.storageGB;
  document.getElementById("dbInstances").value = p.dbInstances;
  document.getElementById("dbInstancesRange").value = p.dbInstances;
  document.getElementById("egressGB").value = p.egressGB;
  document.getElementById("egressGBRange").value = p.egressGB;
  document.getElementById("budgetLimit").value = p.budgetLimit;

  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.preset === key);
  });

  calculateCosts();
}

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
});

// Theme Management with Persistence
const savedTheme = localStorage.getItem("cloudcost_theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
}

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const currentTheme = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("cloudcost_theme", currentTheme);
});

// Download Markdown FinOps Report
document.getElementById("downloadReportBtn").addEventListener("click", () => {
  const blob = new Blob([latestReportMarkdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cloud-infrastructure-budget-report.md";
  a.click();
  URL.revokeObjectURL(url);
});

// Interactive FAQ Accordion
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const wasActive = item.classList.contains("active");

    // Close any other open item
    document.querySelectorAll(".faq-item").forEach((el) => {
      el.classList.remove("active");
    });

    if (!wasActive) {
      item.classList.add("active");
    }
  });
});

// Fallback in case fetch hangs
window.addEventListener("load", () => {
  setTimeout(hidePreloader, 700);
});

initPricing();

# ☁️ CloudCostIQ — Cloud Infrastructure Cost Estimator & FinOps Engine

[![FinOps Engine](https://img.shields.io/badge/FinOps-2026%20Ready-38bdf8?style=for-the-badge&logo=googlecloud&logoColor=white)](https://github.com)
[![Zero Dependency](<https://img.shields.io/badge/Dependencies-0%20(Pure%20Vanilla)-10b981?style=for-the-badge>)](https://github.com)
[![Netlify Ready](https://img.shields.io/badge/Deploy-Netlify%20Ready-00c7b7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-818cf8?style=for-the-badge)](LICENSE)

> **Eliminate cloud bill surprises before you write a single line of Terraform or provision a virtual machine.**  
> **CloudCostIQ** is a modern, client-side cloud economics simulator with **automated Free-Tier deductions**, real-time **budget threshold alerts**, **multi-cloud comparison matrices**, and architectural **commitment trade-off analytics**.

Live Website URL :- https://cloudcostiq.netlify.app/
GitHub Repo URL :- https://github.com/JatinJoshi-JJ/Cloud-Cost-Estimator.git

---

## 🌟 Key Features

- **⚡ Real-Time Client-Side FinOps Simulator**: Instant recalculation (<5ms) as you adjust compute, storage, database, and egress bandwidth sliders.
- **🎁 Automated Free-Tier Deduction Engine**:
  - `750 hrs/mo` Compute allowance (AWS t2/t3.micro, GCP e2-micro, Azure B1s)
  - `5 GB/mo` Standard Object & Block storage
  - `1 Node/mo` Managed Relational Database
  - `100 GB/mo` Public Internet Data Egress
- **📊 Segmented Visual Cost Allocation**: Dynamic color-coded distribution bar showing percentage share per resource category in real-time.
- **🚨 Proactive Budget Overrun Alerts**: Contextual warning banners indicating whether your architecture is safely within budget or exceeding target ceilings, paired with cost-cutting recommendations.
- **⚖️ Architecture & Commitment Trade-Offs**:
  - **1-Year Reserved Commitment vs. On-Demand**: Automatic calculation of 35–40% compute discounts.
  - **Provisioned VM vs. Serverless**: Traffic-pattern intelligence comparing fixed compute with pay-per-execution functions.
  - **Edge CDN Bandwidth Shielding**: Actionable advice on routing egress through CloudFront or Cloudflare R2 to eliminate $0.09/GB egress tariffs.
- **📥 One-Click Markdown FinOps Report**: Export a structured `.md` budget audit report with complete workload parameters, billable breakdowns, and optimization playbooks.
- **🌓 Adaptive Theme Engine**: Native Dark and Light modes with seamless `localStorage` persistence and zero flash of unstyled content.
- **📱 Fully Responsive SaaS Experience**: Fluid layouts optimized for ultra-wide monitors, laptops, tablets, and mobile devices.
- **🔒 100% Private & Zero Telemetry**: Zero cookies, zero external trackers, and zero backend logging. All estimations execute entirely inside your local browser runtime.

---

## 🚀 Quick Architecture Presets

| Preset              | Target Workload                | Compute (hrs) | Storage (GB) | DB Nodes | Egress (GB) | Budget Target |
| :------------------ | :----------------------------- | :-----------: | :----------: | :------: | :---------: | :-----------: |
| 🌱 **Free Tier**    | Side projects & hobby dev      |     `700`     |     `5`      |   `1`    |    `80`     |     `$10`     |
| 🚀 **Startup App**  | Early-stage SaaS in production |     `950`     |    `120`     |   `2`    |    `250`    |     `$35`     |
| 🏢 **High Traffic** | Scaled microservices & media   |    `2,200`    |    `850`     |   `4`    |   `1,500`   |    `$150`     |

---

## 📁 Project Structure

```bash
cloud-cost-estimator/
├── 📄 index.html        # Semantic HTML5 SaaS landing page & interactive simulator
├── 🎨 style.css         # Modern design system, fluid grid, and animations
├── ⚡ script.js         # Reactive FinOps engine, bindings, markdown generator
├── 📊 pricing.json      # Configurable rate card & baseline free-tier quotas
├── 🌐 favicon.svg       # Custom vector brand mark and favicon
├── ⚙️ netlify.toml      # One-click Netlify production deployment config
└── 📖 README.md         # Project documentation & engineering manual
```

---

## 🏷️ Pricing Dataset Reference (`pricing.json`)

CloudCostIQ decouples rate logic from the UI. You can customize unit rates directly in `pricing.json`:

```json
{
  "currency": "USD",
  "freeTier": {
    "computeHours": 750,
    "storageGB": 5,
    "databaseHours": 750,
    "databaseInstances": 1,
    "egressGB": 100
  },
  "rates": {
    "computeOnDemandPerHour": 0.0416,
    "computeReservedPerHour": 0.025,
    "serverlessPerMillionReq": 0.2,
    "storagePerGB": 0.023,
    "databasePerInstanceMonth": 15.0,
    "egressPerGB": 0.09
  }
}
```

---

## 🛠️ Local Development & Quick Start

Since CloudCostIQ is built with zero build steps or heavy dependencies, you can run it locally with any static web server:

### Option 1: Python 3

```bash
python3 -m http.server 8080
```

Then navigate to: `http://localhost:8080`

### Option 2: Node.js (`npx serve`)

```bash
npx serve .
```

### Option 3: VS Code / IDE

Install the **Live Server** extension, right-click `index.html`, and choose **"Open with Live Server"**.

---

## 🚢 Production Deployment

### Deploy to Netlify

CloudCostIQ comes pre-configured with `netlify.toml`:

1. Push this repository to GitHub/GitLab.
2. Link the repository in [Netlify](https://app.netlify.com).
3. The build directory is `.` (root). Deploy immediately!

### Deploy to Vercel

```bash
npx vercel .
```

### Deploy to GitHub Pages

1. Go to your repository **Settings** → **Pages**.
2. Select the `main` branch and `/ (root)` folder.
3. Save to publish your live URL.

---

## 🧠 FinOps Architecture Best Practices Built-In

1. **Right-Size Before Scaling**: Over 80% of virtual machines run at less than 15% average CPU utilization. Migrating to ARM-based Graviton instances yields instant 20–40% cost reductions.
2. **Automate Storage Tiering**: Standard object storage costs $0.023/GB. Transitioning unaccessed media to Infrequent Access or Glacier after 30 days cuts storage expenses by 50–80%.
3. **Shield Public Egress with CDNs**: Public Internet egress at $0.09/GB adds up rapidly. Placing CloudFront or Cloudflare in front of storage reduces public data transfer fees to near zero.
4. **Co-Locate Inter-Service Traffic**: Cross-Availability-Zone data transfer is billed at $0.01/GB in each direction. Placing chatty services within the same AZ removes cross-subnet tolls.

---

## 🤝 Contributing

Contributions, feature requests, and rate-card updates are warmly welcomed!

1. Fork the Project (`git checkout -b feature/AmazingRateCard`)
2. Commit your Changes (`git commit -m 'Add Azure Arm64 pricing rates'`)
3. Push to the Branch (`git push origin feature/AmazingRateCard`)
4. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Crafted with ❤️ for Software Engineers, Cloud Architects, and FinOps Teams.
</p>
# Cloud-Cost-Estimator

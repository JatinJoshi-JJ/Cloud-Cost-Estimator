# Cloud Infrastructure Cost Estimation Report
Generated on: 2026-11-19
Engine: CloudCostIQ Free-Tier Aware FinOps Modeling

## 1. Workload Parameters
- **Virtual Server Hours:** 950 hrs (Billable after 750h Free Tier: 200 hrs)
- **Storage Volume:** 120 GB (Billable after 5GB Free Tier: 115 GB)
- **Database Instances:** 2 (Billable after 1 Free Tier instance: 1)
- **Egress Bandwidth:** 250 GB (Billable after 100GB Free Tier: 150 GB)

## 2. Monthly Expenditure Breakdown
- **Virtual Compute Cost:** $8.32
- **Cloud Storage Cost:** $2.65
- **Managed Database Cost:** $15.00
- **Egress Bandwidth Cost:** $13.50
- **Net Billed Total (On-Demand):** $39.47 / month
- **Free-Tier Deduction Savings:** $55.31 / month
- **1-Year Reserved Instance Total:** $36.14 / month

## 3. Budget Alert & Architecture Recommendations
- **Target Monthly Budget:** $35.00
- **Budget Status:** Over Budget by $4.47
- **Compute Strategy:** Provisioned VM ($8.32/mo billed) offers significantly higher cost predictability and unit economics for 24/7 baseline compute workloads.
- **Optimization Action:** Commit to 1-Year Reserved Instances to save $3.32/month.

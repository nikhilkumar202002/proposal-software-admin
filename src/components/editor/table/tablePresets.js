export const PROPOSAL_TABLE_PRESETS = {
  pricing: {
    name: 'Pricing Matrix',
    headers: ['Item #', 'Deliverable / Scope', 'Unit Price', 'Quantity', 'Total (INR)'],
    initialRows: [
      ['01', 'Cloud Infrastructure Setup & IaC', '₹2,50,000', '1', '₹2,50,000'],
      ['02', 'Kubernetes Orchestration Cluster', '₹3,20,000', '1', '₹3,20,000'],
      ['03', 'Database Modernization & Backup', '₹1,80,000', '1', '₹1,80,000'],
    ],
  },
  timeline: {
    name: 'Project Timeline',
    headers: ['Phase', 'Milestone Description', 'Duration', 'Deliverable Target'],
    initialRows: [
      ['Phase 1', 'Discovery & Architecture Blueprint', 'Weeks 1-2', 'Architecture Design Document'],
      ['Phase 2', 'Staging Environment & Clusters', 'Weeks 3-5', 'Live Staging Deployment'],
      ['Phase 3', 'Production Cutover & Verification', 'Weeks 6-7', 'Zero-Downtime Launch'],
    ],
  },
  deliverables: {
    name: 'Deliverables & Acceptance',
    headers: ['ID', 'Scope Deliverable', 'Acceptance Benchmark', 'Sign-Off Authority'],
    initialRows: [
      ['DEL-01', 'Terraform Script Repository', 'Successful dry-run in staging', 'Technical Lead'],
      ['DEL-02', 'SOC 2 Audit Telemetry', '100% policy pass compliance', 'Security Director'],
    ],
  },
}

export default PROPOSAL_TABLE_PRESETS

/**
 * Document content normalization and sample proposal generator
 */

/**
 * Generate a unique ID for document blocks
 */
let blockCounter = 0
export function generateBlockId(prefix = 'blk') {
  blockCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${blockCounter}`
}

/**
 * Normalize any input format (TipTap JSON, raw blocks, or HTML string)
 * into a consistent array of measurable blocks
 */
export function normalizeDocumentContent(content) {
  if (!content) return []

  // If already an array of structured blocks
  if (Array.isArray(content)) {
    return content.map((item, idx) => ({
      id: item.id || generateBlockId(`b${idx}`),
      type: item.type || 'paragraph',
      ...item,
    }))
  }

  // If TipTap doc JSON ({ type: 'doc', content: [...] })
  if (typeof content === 'object' && content.type === 'doc' && Array.isArray(content.content)) {
    return parseTipTapDoc(content.content)
  }

  // If plain HTML string, wrap in a block
  if (typeof content === 'string') {
    return [
      {
        id: generateBlockId('html'),
        type: 'html',
        html: content,
      },
    ]
  }

  return []
}

/**
 * Parse TipTap JSON content nodes into document blocks
 */
function parseTipTapDoc(nodes) {
  const blocks = []

  nodes.forEach((node, index) => {
    const id = generateBlockId(`tt-${index}`)

    if (node.type === 'heading') {
      const text = extractText(node)
      blocks.push({
        id,
        type: 'heading',
        level: node.attrs?.level || 1,
        text,
        attrs: node.attrs,
      })
    } else if (node.type === 'paragraph') {
      const text = extractText(node)
      // Check for empty paragraph
      if (!text.trim() && (!node.content || node.content.length === 0)) {
        blocks.push({ id, type: 'spacer', height: 16 })
      } else {
        blocks.push({
          id,
          type: 'paragraph',
          text,
          content: node.content,
        })
      }
    } else if (node.type === 'table') {
      blocks.push(parseTipTapTable(node, id))
    } else if (node.type === 'bulletList' || node.type === 'orderedList') {
      blocks.push({
        id,
        type: node.type,
        items: (node.content || []).map((li) => extractText(li)),
      })
    } else if (node.type === 'image') {
      blocks.push({
        id,
        type: 'image',
        src: node.attrs?.src,
        alt: node.attrs?.alt || '',
        title: node.attrs?.title || '',
        width: node.attrs?.width,
        height: node.attrs?.height,
      })
    } else if (node.type === 'blockquote') {
      blocks.push({
        id,
        type: 'blockquote',
        text: extractText(node),
      })
    } else if (node.type === 'pageBreak' || node.type === 'horizontalRule') {
      blocks.push({
        id,
        type: node.type === 'pageBreak' ? 'pageBreak' : 'divider',
      })
    } else {
      // Fallback
      blocks.push({
        id,
        type: 'custom',
        raw: node,
        text: extractText(node),
      })
    }
  })

  return blocks
}

/**
 * Extract plain text from TipTap node
 */
function extractText(node) {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.content)) {
    return node.content.map(extractText).join('')
  }
  return ''
}

/**
 * Parse TipTap table into header and data rows
 */
function parseTipTapTable(tableNode, id) {
  const rows = tableNode.content || []
  let headers = []
  const dataRows = []

  rows.forEach((rowNode, rIdx) => {
    const cells = (rowNode.content || []).map((cellNode) => ({
      text: extractText(cellNode),
      isHeader: cellNode.type === 'tableHeader',
      colspan: cellNode.attrs?.colspan || 1,
      rowspan: cellNode.attrs?.rowspan || 1,
    }))

    if (rIdx === 0 && cells.some((c) => c.isHeader)) {
      headers = cells.map((c) => c.text)
    } else {
      dataRows.push(cells.map((c) => c.text))
    }
  })

  return {
    id,
    type: 'table',
    headers,
    rows: dataRows,
  }
}

/**
 * Realistic Sample Proposal Document Content
 * Demonstrates multiple pages, pricing table continuation,
 * manual page break, headings, lists, and summary metrics.
 */
export const SAMPLE_PROPOSAL_DATA = {
  metadata: {
    title: 'Enterprise Cloud Infrastructure & SLA Migration',
    number: 'PROP-2026-089',
    date: 'November 18, 2026',
    validUntil: 'December 18, 2026',
    version: '1.2 Final',
    status: 'Pending',
    totalValue: '₹14,85,000',
  },
  company: {
    name: 'Domain Dude',
    tagline: 'Enterprise Document & Workflow Systems',
    address: 'Tower B, Suite 402, DLF CyberCity, Gurugram 122002',
    phone: '+91 98765 43210',
    email: 'contact@domaindude.in',
    website: 'www.domaindude.in',
    logoUrl: '/src/assets/Domine-Dude_black.png',
  },
  client: {
    name: 'Apex Global Enterprises Inc.',
    contactPerson: 'Mr. Rohan Mehta',
    designation: 'Chief Technology Officer',
    email: 'rohan.mehta@apexglobal.com',
    address: 'Level 14, Commercial Plaza, Bandra-Kurla Complex, Mumbai',
  },
  blocks: [
    {
      id: 'blk-title-section',
      type: 'hero',
      title: 'Enterprise Cloud Infrastructure & SLA Migration Proposal',
      subtitle: 'Prepared for Apex Global Enterprises Inc. • Confidential Document',
      lead: 'This comprehensive technical proposal outlines the cloud infrastructure modernization, automated Kubernetes migration, enterprise security compliance, and 99.99% uptime 24/7 SLA managed support for the financial year 2026-2027.',
    },
    {
      id: 'blk-divider-1',
      type: 'divider',
    },
    {
      id: 'blk-executive-summary',
      type: 'heading',
      level: 2,
      text: '1. Executive Summary',
    },
    {
      id: 'blk-summary-p1',
      type: 'paragraph',
      text: 'Apex Global has experienced phenomenal growth across its multi-region platforms. To sustain this momentum, modernize legacy monoliths, and meet stringent regulatory security benchmarks (ISO 27001 and SOC 2 Type II), ProposalOS has architected a zero-downtime transition strategy.',
    },
    {
      id: 'blk-summary-p2',
      type: 'paragraph',
      text: 'Our dedicated cloud engineers and security auditors will implement an automated Infrastructure-as-Code (Terraform) blueprint with containerized microservices, distributed CDN edge routing, and automated blue-green deployment pipelines.',
    },
    {
      id: 'blk-scope',
      type: 'heading',
      level: 2,
      text: '2. Scope of Deliverables',
    },
    {
      id: 'blk-list-deliverables',
      type: 'bulletList',
      items: [
        'Infrastructure Audit & Workload Modernization Assessment across 38 existing virtual instances.',
        'High-Availability Kubernetes Cluster Configuration with multi-zone automated failover.',
        'Database Clustering (PostgreSQL & Redis) with real-time replication and Point-In-Time Recovery.',
        'Automated CI/CD Deployment Pipelines with automated unit test verification & rollback.',
        'Zero-Trust Network Architecture with Cloudflare Enterprise Web Application Firewall (WAF).',
        '24/7 Priority SLA response with a guaranteed sub-15 minute critical incident resolution window.',
      ],
    },
    {
      id: 'blk-pagebreak-1',
      type: 'pageBreak', // Manual page break to start pricing on page 2
      label: 'Manual Page Break — Pricing & Commercial Terms',
    },
    {
      id: 'blk-pricing-heading',
      type: 'heading',
      level: 2,
      text: '3. Commercial Investment & Pricing Breakdown',
    },
    {
      id: 'blk-pricing-intro',
      type: 'paragraph',
      text: 'All pricing outlined below is inclusive of implementation, licensing configurations, dedicated security onboarding, and one year of 24/7 tier-1 managed operations.',
    },
    {
      id: 'blk-pricing-table',
      type: 'table',
      caption: 'Table 3.1: Detailed Investment Matrix',
      headers: ['Item #', 'Deliverable Module', 'Scope & Specifications', 'Timeline', 'Total (INR)'],
      rows: [
        ['01', 'Cloud Infrastructure Setup', 'Multi-region VPC, IAM, VPN & Terraform IaC provisioning', 'Weeks 1-3', '₹2,75,000'],
        ['02', 'Kubernetes Orchestration', 'EKS production clusters with ingress controllers and auto-scaling', 'Weeks 3-5', '₹3,40,000'],
        ['03', 'Database Modernization', 'Managed PostgreSQL HA cluster with geo-redundancy & encryption', 'Weeks 4-6', '₹2,60,000'],
        ['04', 'Security & SOC 2 Hardening', 'Vulnerability scanning, SIEM telemetry & Zero-Trust access policies', 'Weeks 6-8', '₹1,90,000'],
        ['05', 'CI/CD Automation Pipelines', 'GitLab CI / GitHub Actions blue-green zero-downtime releases', 'Weeks 7-9', '₹1,40,000'],
        ['06', 'Disaster Recovery Plan', 'Automated 15-minute RPO / 1-hour RTO backup verification drills', 'Week 10', '₹90,000'],
        ['07', 'Staff Training & Handover', 'Admin training workshops, architecture documentation & runbooks', 'Week 11', '₹70,000'],
        ['08', 'Annual 24/7 SLA Support', 'Enterprise SLA with 15-minute response & assigned Technical Account Manager', '12 Months', '₹1,20,000'],
      ],
      summaryRow: ['Total', 'Comprehensive Project Investment', 'Excluding applicable statutory GST (18%)', 'Full Term', '₹14,85,000'],
    },
    {
      id: 'blk-terms-heading',
      type: 'heading',
      level: 2,
      text: '4. Acceptance & Terms of Service',
    },
    {
      id: 'blk-terms-p1',
      type: 'paragraph',
      text: 'Payment milestones shall be released as: 30% upon signing, 40% on staging acceptance, and 30% on production go-live. Invoicing currency is Indian Rupees (INR).',
    },
    {
      id: 'blk-signature-box',
      type: 'signatures',
      partyA: {
        title: 'For ProposalOS Technologies Ltd.',
        name: 'Alex Morgan',
        role: 'Director of Enterprise Engineering',
        date: '18 Nov 2026',
      },
      partyB: {
        title: 'Accepted & Agreed by Apex Global',
        name: 'Rohan Mehta',
        role: 'Chief Technology Officer',
        date: '_______________',
      },
    },
  ],
}

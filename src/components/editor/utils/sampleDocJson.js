export const SAMPLE_PROPOSAL_DOC_JSON = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1, textAlign: 'left' },
      content: [
        {
          type: 'text',
          text: 'Enterprise Cloud Infrastructure & SLA Migration Proposal',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Prepared for ' },
        {
          type: 'text',
          marks: [{ type: 'bold' }],
          text: 'Apex Global Enterprises Inc.',
        },
        {
          type: 'text',
          text: ' • Document Ref: PROP-2026-089 • Version 1.2 Final',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '1. Executive Summary' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Apex Global has experienced phenomenal growth across its multi-region platforms. To sustain this momentum, modernize legacy monoliths, and meet stringent regulatory security benchmarks (ISO 27001 and SOC 2 Type II), ProposalOS has architected a zero-downtime transition strategy.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Our dedicated cloud engineers and security auditors will implement an automated Infrastructure-as-Code (Terraform) blueprint with containerized microservices, distributed CDN edge routing, and automated blue-green deployment pipelines.',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '2. Scope of Deliverables' }],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Infrastructure Audit & Workload Assessment across 38 existing virtual instances.',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'High-Availability Kubernetes Cluster Configuration with multi-zone failover.',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Database Clustering (PostgreSQL & Redis) with real-time replication and PITR.',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Automated CI/CD Deployment Pipelines with automated verification & rollback.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [
        { type: 'text', text: '3. Commercial Investment & Pricing Breakdown' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The commercial matrix below details initial deployment and the 12-month tier-1 SLA managed operations guarantee.',
        },
      ],
    },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Item #' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Scope & Specifications' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Timeline' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Investment (INR)' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '01' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Cloud Infrastructure Setup & IaC Provisioning',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Weeks 1-3' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '₹2,75,000' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '02' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Kubernetes Production Cluster Orchestration',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Weeks 3-5' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '₹3,40,000' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '03' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Database Modernization (PostgreSQL HA & Redis)',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Weeks 4-6' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '₹2,60,000' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '04' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Security Hardening & SOC 2 Compliance Audit',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Weeks 6-8' }],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '₹1,90,000' }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default SAMPLE_PROPOSAL_DOC_JSON

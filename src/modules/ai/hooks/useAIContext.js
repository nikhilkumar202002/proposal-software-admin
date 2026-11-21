/**
 * ProposalOS AI Module - useAIContext Hook
 * Pulls active context from Client, Proposal, and Settings stores to feed AI prompt builders.
 */

import { useEffect } from 'react'
import useAIStore from '../store/aiStore'
import useClientStore from '../../clients/store/clientStore'
import useProposalStore from '../../proposals/store/proposalStore'
import useSettingsStore from '../../settings/store/settingsStore'

export function useAIContext() {
  const { context, setContext, clearContext } = useAIStore()
  const { clients, fetchClients } = useClientStore()
  const { proposals, currentProposal, fetchProposals } = useProposalStore()
  const { company, loadSettings } = useSettingsStore()

  useEffect(() => {
    if (!clients?.length) fetchClients()
    if (!proposals?.length) fetchProposals()
    if (!company?.name) loadSettings()
  }, [clients?.length, proposals?.length, company?.name, fetchClients, fetchProposals, loadSettings])

  const selectClient = (clientId) => {
    const found = clients.find((c) => c.id === clientId) || null
    setContext({ selectedClientId: clientId, selectedClient: found })
  }

  const selectProposal = (proposalId) => {
    const found = proposals.find((p) => p.id === proposalId) || null
    setContext({ selectedProposalId: proposalId, selectedProposal: found })
  }

  const toggleIncludeCompany = () => {
    setContext({ includeCompanyDetails: !context.includeCompanyDetails })
  }

  return {
    context,
    clients,
    proposals,
    currentProposal,
    company,
    selectClient,
    selectProposal,
    toggleIncludeCompany,
    clearContext,
  }
}

export default useAIContext

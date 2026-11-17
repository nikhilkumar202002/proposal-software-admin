// Pages
export { default as ClientList } from './pages/ClientList'
export { default as CreateClient } from './pages/CreateClient'
export { default as EditClient } from './pages/EditClient'

// Components
export { default as ClientTable } from './components/ClientTable'
export { default as ClientForm } from './components/ClientForm'
export { default as ClientDetails } from './components/ClientDetails'
export { default as ClientCard } from './components/ClientCard'
export { default as ClientSearch } from './components/ClientSearch'
export { default as ClientActions } from './components/ClientActions'

// Hook, Service, Store, Utils
export { default as useClients } from './hooks/useClients'
export { default as clientService } from './services/clientService'
export { default as useClientStore } from './store/clientStore'
export * from './utils/clientHelpers'

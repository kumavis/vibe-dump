import { mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'
import shared from '../../vite.config.shared.js'

// Extend the shared config (which sets base: './') with the React plugin.
export default mergeConfig(shared, { plugins: [react()] })

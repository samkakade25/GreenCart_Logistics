import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Grommet } from "grommet";


const theme = {
  global: {
    font: { family: "Arial" },
  },
};


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Grommet full theme={theme}>
    <App />
    </Grommet>
  </StrictMode>,
)

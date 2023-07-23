import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App/App'
import Docs from './Components/Docs/Docs'
import Login from './Components/Login/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Logout from './Components/Logout/Logout'
import { StyledEngineProvider } from '@mui/material/styles'

const root = document.getElementById('root')

ReactDOM.createRoot(root!).render(
	<StyledEngineProvider injectFirst>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/docs/" element={<Navigate to={"/docs/" + uuidv4()} />} />
				<Route path="/docs/new" element={<Navigate to={"/docs/" + uuidv4()} />} />
				<Route path="/docs/:pageId" element={<Docs />} />
				<Route path="/login" element={<Login />} />
				<Route path="/logout" element={<Logout />} />
			</Routes>
		</BrowserRouter>
	</StyledEngineProvider>
)

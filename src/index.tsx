import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App/App'
import Docs from './Components/Docs/Docs'
import Login from './Components/Login/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Logout from './Components/Logout/Logout'
import { StyledEngineProvider } from '@mui/material/styles'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const root = document.getElementById('root')
const queryClient = new QueryClient()

ReactDOM.createRoot(root!).render(
	<QueryClientProvider client={queryClient}>
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<StyledEngineProvider injectFirst>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<App />} />
						<Route path='/docs/:pageId' element={<Docs />} />
						<Route path='/login' element={<Login />} />
						<Route path='/logout' element={<Logout />} />
					</Routes>
				</BrowserRouter>
			</StyledEngineProvider>
		</GoogleOAuthProvider>
        <ReactQueryDevtools />
	</QueryClientProvider>
)

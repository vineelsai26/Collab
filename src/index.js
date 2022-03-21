import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App/App'
import Docs from './Components/Docs/Docs'
import Login from './Components/Login/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route exact path="/" element={<App />} />
				<Route path="/docs/:pageId" element={<Docs />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
)

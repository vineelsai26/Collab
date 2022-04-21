import { Paper } from "@mui/material"
import { Box } from "@mui/system"
import Navbar from "../Navbar/Navbar"
import { useState, useEffect } from 'react'

const SERVER = process.env.REACT_APP_BACKEND_URL

function App() {
	const user = JSON.parse(localStorage.getItem('user'))
	if (!!!user) {
		window.location.href = '/login'
	}

	const [docs, setDocs] = useState([])

	useEffect(() => {
		fetch(SERVER + '/myDocs', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: user.profileObj.email })
		}).then(async (res) => {
			if (res.status === 200) {
				const data = await res.json()
				if (!!data) {
					setDocs(data)
				}
			}
		}).catch(err => {
			console.log(err)
		})
	}, [])

	return (
		<div style={{ backgroundColor: '#F5F5F5' }}>
			<Navbar user={user} />
			<Box sx={{ width: '80%', margin: 'auto', minHeight: '100vh' }}>
				<Paper sx={{ width: '150px', height: '200px', margin: '20px', cursor: 'pointer', float: 'left' }} onClick={() => window.location.href = '/docs'}>
					<img style={{
						width: '100%', position: 'relative',
						top: '50%',
						transform: 'translateY(-50%)',
					}} src={'/new.webp'} />
				</Paper>
				{docs.map((doc) => {
					return (
						<Paper key={doc.id} sx={{ width: '150px', height: '200px', margin: '20px', cursor: 'pointer', textAlign: 'inherit', float: 'left', position: 'relative' }} onClick={() => window.location.href = `/docs/${doc.id}`}>
							<p style={{ textAlign: 'center', bottom: 0, position: 'absolute', width: '100%' }}>
								{doc.id}
							</p>
						</Paper>
					)
				})}
			</Box>
		</div>
	)
}

export default App

import { IconButton, Paper } from "@mui/material"
import { Box } from "@mui/system"
import Navbar from "../Navbar/Navbar"
import { useState, useEffect } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const SERVER = import.meta.env.VITE_BACKEND_URL

function App() {
	const user = JSON.parse(localStorage.getItem('user'))
	if (!!!user) {
		window.location.href = '/login'
	}

	const [deleteVisible, setDeleteVisible] = useState({})

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

	const handleMouseOver = (id) => {
		setDeleteVisible({ ...deleteVisible, [id]: true })
	}

	const handleMouseLeave = (id) => {
		setDeleteVisible({ ...deleteVisible, [id]: false })
	}

	const handleDocDelete = (e, id) => {
		e.stopPropagation()
		fetch(SERVER + '/deleteDoc', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: id })
		}).then(async (res) => {
			if (res.status === 200) {
				const data = await res.json()
				if (!!data) {
					setDocs(docs.filter(doc => doc.id !== id))
				}
			}
		}).catch(err => {
			console.log(err)
		})
	}

	const handleDocEdit = (e, id) => {
		e.stopPropagation()
		window.location.href = `/docs/${id}`
	}

	return (
		<div style={{ backgroundColor: '#F5F5F5' }}>
			<Navbar user={user} />
			<Box sx={{ width: '80%', margin: 'auto', minHeight: '100vh' }}>
				<Paper sx={{ width: '150px', height: '200px', margin: '20px', cursor: 'pointer', float: 'left' }} onClick={() => window.location.href = '/docs'}>
					<img style={{
						width: '100%', position: 'relative',
						top: '50%',
						transform: 'translateY(-50%)',
					}} src={'/public/new.webp'} />
				</Paper>
				{docs.map((doc) => {
					return (
						<Paper key={doc.id} sx={{ width: '150px', height: '200px', margin: '20px', cursor: 'pointer', textAlign: 'inherit', float: 'left', position: 'relative' }} onClick={() => window.location.href = `/docs/${doc.id}`}>
							<img style={{ position: 'absolute', width: '100%' }} src="/public/icon.png" ></img>
							<Box onMouseOver={() => handleMouseOver(doc.id)} onMouseLeave={() => handleMouseLeave(doc.id)}>
								<p style={{ textAlign: 'center', bottom: 0, position: 'absolute', width: '100%' }}>
									{doc.title}
								</p>
								<IconButton style={{ zIndex: 1000, position: 'absolute', bottom: 0, left: 0, visibility: deleteVisible[doc.id] ? 'visible' : 'hidden' }} onClick={(e) => handleDocEdit(e, doc.id)}>
									<EditIcon />
								</IconButton>
								<IconButton style={{ zIndex: 1000, position: 'absolute', bottom: 0, right: 0, visibility: deleteVisible[doc.id] ? 'visible' : 'hidden' }} onClick={(e) => handleDocDelete(e, doc.id)}>
									<DeleteIcon />
								</IconButton>
							</Box>
						</Paper>
					)
				})}
			</Box>
		</div>
	)
}

export default App

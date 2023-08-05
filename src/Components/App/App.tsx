import { IconButton, Paper } from "@mui/material"
import { Box } from "@mui/material"
import Navbar from "../Navbar/Navbar"
import { useState, useEffect } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'

const SERVER = import.meta.env.VITE_BACKEND_URL

type Docs = {
	id: string,
	title: string,
	content: string,
	owner: string,
	shared: string[]
}

type DeleteVisible = {
	[key: string]: boolean
}

function App() {
	const userStorage = localStorage.getItem('user')
	if (!userStorage) {
		window.location.href = '/login'
		return
	}
	const user = JSON.parse(userStorage)
	if (!!!user) {
		window.location.href = '/login'
	}

	const [deleteVisible, setDeleteVisible] = useState<DeleteVisible>({})

	const [docs, setDocs] = useState<Docs[]>([])

	useEffect(() => {
		fetch(`${SERVER}/docs/me`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${user.tokenObj.id_token}`
			}
		}).then(async (res) => {
			if (res.status === 200) {
				const data = await res.json()
				if (!!data) {
					setDocs(data)
				}
			} else if (res.status === 401) {
				window.location.href = '/logout'
			}
		}).catch(err => {
			console.log(err)
		})
	}, [])

	const handleMouseOver = (id: any) => {
		setDeleteVisible({ ...deleteVisible, [id]: true })
	}

	const handleMouseLeave = (id: any) => {
		setDeleteVisible({ ...deleteVisible, [id]: false })
	}

	const handleDocDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
		e.stopPropagation()
		fetch(`${SERVER}/doc`, {
			method: 'DELETE',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${user.tokenObj.id_token}`
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

	const handleDocEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
		e.stopPropagation()
		window.location.href = `/docs/${id}`
	}

	const handleCreateDoc = async () => {
		const response = await fetch(`${SERVER}/doc`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${user.tokenObj.id_token}`
			},
			body: JSON.stringify({ title: 'Untitled' })
		})

		if (response.status === 200) {
			const data = await response.json()
			if (!!data) {
				window.location.href = `/docs/${data.id}`
			}
		} else if (response.status === 401) {
			window.location.href = '/logout'
		}
	}

	return (
		<div style={{ backgroundColor: '#F5F5F5' }}>
			<Navbar user={user} page={undefined} handleSave={undefined} handleEmailChange={undefined} emailList={undefined} handleTitleChange={undefined} title={undefined} publicAccess={undefined} setPublicAccess={undefined} />
			<Box sx={{ width: '80%', margin: 'auto', minHeight: '100vh' }}>
				<Paper sx={{ width: '150px', height: '200px', margin: '20px', cursor: 'pointer', float: 'left' }} onClick={handleCreateDoc}>
					<img style={{
						width: '100%', position: 'relative',
						top: '50%',
						transform: 'translateY(-50%)',
					}} src={'/new.webp'} />
				</Paper>
				{docs.map((doc) => {
					return (
						<Paper key={doc.id} sx={{ width: '150px', height: '200px', margin: '20px', cursor: 'pointer', textAlign: 'inherit', float: 'left', position: 'relative' }} onClick={() => window.location.href = `/docs/${doc.id}`}>
							<img style={{ position: 'absolute', width: '100%' }} src="/icon.png" ></img>
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

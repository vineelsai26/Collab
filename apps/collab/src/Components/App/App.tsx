import Navbar from "../Navbar/Navbar"
import { useState, useEffect } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'
import { CredentialResponse } from '@react-oauth/google'
import { Button, Card, IconButton } from '@vstack/ui'

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
	const userStorage = localStorage.getItem('auth')
	if (!userStorage) {
		window.location.href = '/login'
		return
	}
	const user: CredentialResponse = JSON.parse(userStorage)
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
				'Authorization': `Bearer ${user.credential}`
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
				'Authorization': `Bearer ${user.credential}`
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
				'Authorization': `Bearer ${user.credential}`
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
		<div className='vstack-app-shell vstack-grid-shell'>
			<Navbar user={user} page={undefined} handleEmailChange={undefined} emailList={undefined} handleTitleChange={undefined} title={undefined} publicAccess={undefined} setPublicAccess={undefined} />
			<main className='vstack-container vstack-section'>
				<section className='vstack-section-heading'>
					<span className='vstack-tag vstack-eyebrow'>Workspace</span>
					<h1 className='vstack-title'>Collab Docs</h1>
					<div className='vstack-divider' />
					<p className='vstack-copy'>
						Create, edit, and share documents from the same shared VStack surface used across the frontend apps.
					</p>
				</section>
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
					gap: '24px',
					minHeight: '52vh',
				}}>
				<Card
					className='vstack-stack'
					onClick={handleCreateDoc}
					style={{
						alignItems: 'center',
						cursor: 'pointer',
						minHeight: '240px',
						padding: '20px',
						placeContent: 'center',
					}}>
					<img
						alt=''
						src='/new.webp'
						style={{ maxWidth: '120px', width: '70%' }}
					/>
					<Button className='vstack-button'>New Doc</Button>
				</Card>
				{docs.map((doc) => {
					return (
						<Card
							key={doc.id}
							onClick={() => window.location.href = `/docs/${doc.id}`}
							style={{
								cursor: 'pointer',
								minHeight: '240px',
								overflow: 'hidden',
								padding: '16px',
								position: 'relative',
							}}>
							<img
								alt=''
								src='/icon.png'
								style={{ display: 'block', margin: '12px auto 0', width: '80%' }}
							/>
							<div onMouseOver={() => handleMouseOver(doc.id)} onMouseLeave={() => handleMouseLeave(doc.id)}>
								<p style={{
									background: 'var(--vstack-surface)',
									borderTop: '2px solid var(--vstack-border)',
									bottom: 0,
									fontWeight: 800,
									left: 0,
									margin: 0,
									padding: '12px 44px',
									position: 'absolute',
									right: 0,
									textAlign: 'center',
								}}>
									{doc.title}
								</p>
								<IconButton label={`Edit ${doc.title}`} style={{ zIndex: 1000, position: 'absolute', bottom: 6, left: 6, visibility: deleteVisible[doc.id] ? 'visible' : 'hidden' }} onClick={(e) => handleDocEdit(e, doc.id)}>
									<EditIcon />
								</IconButton>
								<IconButton label={`Delete ${doc.title}`} style={{ zIndex: 1000, position: 'absolute', bottom: 6, right: 6, visibility: deleteVisible[doc.id] ? 'visible' : 'hidden' }} onClick={(e) => handleDocDelete(e, doc.id)}>
									<DeleteIcon />
								</IconButton>
							</div>
						</Card>
					)
				})}
				</div>
			</main>
		</div>
	)
}

export default App

import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import io, { Socket } from "socket.io-client"
import Navbar from '../Navbar/Navbar'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Editor } from '@monaco-editor/react'

const Alert = React.forwardRef(function Alert(
	props: any,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const SERVER = import.meta.env.VITE_BACKEND_URL
let socket: Socket

export default function Docs() {
	const [emailList, setEmailList] = useState<string[]>([])
	const { pageId } = useParams()

	const userStorage = localStorage.getItem('user')
	if (!userStorage) {
		window.location.href = '/login'
		return
	}
	const user = JSON.parse(userStorage)
	if (!!!user) {
		window.location.href = '/login'
	}

	const [title, setTitle] = useState('')
	const [publicAccess, setPublicAccess] = useState(false)

	const [editorContent, setEditorContent] = useState<string[]>([])
	const [editorPrevContent, setEditorPrevContent] = useState<string[]>(editorContent)

	const [snackBarState, setSnackBarState] = useState(false)

	useEffect(() => {
		fetch(SERVER + '/dbGet', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ pageId: pageId, email: user.profileObj.email })
		}).then(async (res) => {
			const data = await res.json()
			if (data && data.error) {
				window.location.href = '/'
				console.log(data.error)
			} if (data && data.content) {
				setEditorContent(data.content.split('\n'))
			} if (data && data.accessList) {
				setEmailList(data.accessList)
				setPublicAccess(data.accessType === 'public')
			} if (data && data.title) {
				setTitle(data.title)
			} else {
				console.log("No data")
			}
		}).catch(err => {
			console.log(err)
		})

		socket = io(SERVER, { query: { id: pageId } })
		socket.on('connect', () => {
			console.log('connected')
			socket.on('receive', async ({ message, index }: {message: string, index: number}) => {
				if (index === -1) {
					setEditorContent(message.split('\n'))
				} else {
					if (index >= editorContent.length) {
						for (let i = editorContent.length; i < index; i++) {
							editorContent.push('')
						}
					}
					editorContent[index] = message
					setEditorContent([...editorContent])
				}
			})
			socket.emit('join')
		})
	}, [])

	useEffect(() => {
		socket.on('join', () => {
			socket.emit('send', { message: editorContent.join('\n'), index: -1 })
		})
	}, [editorContent])

	useEffect(() => {
		document.title = title
	}, [title])

	const handleSnackBarClose = () => {
		setSnackBarState(false)
	}

	const handleSave = () => {
		fetch(SERVER + '/dbGet', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pageId: pageId,
				email: user.profileObj.email,
				title: title,
				content: editorContent.join('\n'),
				accessType: publicAccess ? "public" : "private",
				addEmail: emailList
			})
		}).then(async (res) => {
			const data = await res.json()
			if (data && data.error) {
				console.log(data.error)
				window.location.href = '/'
			} else if (data && data.content) {
				setEditorContent(data.content.split('\n'))
				setTitle(data.title)
				setSnackBarState(true)
			} else {
				console.log("No data")
			}
		}).catch(err => {
			console.log(err)
		})
	}

	const handleEmailChange = (e: any) => {
		let emails = e.target.value.split(',') as string[]
		emails = emails.map((email) => email.trim())
		setEmailList(emails)
	}

	const onEditorStateChange = (value: string | undefined) => {
		if (value) {
			const newEditorContent = [...value.split('\n')]
			setEditorContent(newEditorContent)
			if (editorPrevContent.join('\n') === value) {
				return
			}

			socket.emit('send', { message: newEditorContent.join('\n'), index: -1 })

			setEditorPrevContent(editorContent)
		}
	}

	const handleTitleChange = (e: any) => {
		setTitle(e.target.value)
	}

	return (
		<div>
			<Navbar user={user} page={"docs"} handleSave={handleSave} handleEmailChange={handleEmailChange} emailList={emailList} handleTitleChange={handleTitleChange} title={title} publicAccess={publicAccess} setPublicAccess={setPublicAccess} />
			<div style={{ backgroundColor: '#F1F1F1', justifyContent: 'center', display: 'flex' }}>
				<div className='editor' style={{ width: '100vw', backgroundColor: '#F1F1F1', minHeight: '100vh' }}>
					<Editor
						height="100vh"
						defaultLanguage="markdown"
						defaultValue=""
						value={editorContent.join('\n')}
						options={{
							minimap: {
								enabled: false
							}
						}}
						onChange={onEditorStateChange}
					/>
					<Snackbar open={snackBarState} autoHideDuration={5000} onClose={handleSnackBarClose}>
						<Alert severity="success" sx={{ width: '100%' }}>
							Saved successfully
						</Alert>
					</Snackbar>
				</div>
			</div>
		</div>
	)
}

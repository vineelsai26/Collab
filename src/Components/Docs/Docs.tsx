import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import io, { Socket } from "socket.io-client"
import Navbar from '../Navbar/Navbar'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Editor } from '@monaco-editor/react'
import CryptoJS from 'crypto-js'

const Alert = React.forwardRef(function Alert(
	props: any,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const SERVER = import.meta.env.VITE_BACKEND_URL
let socket: Socket

function generateHash(message: string) {
	const hash = CryptoJS.SHA256(message)
	return hash.toString()
}

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
			socket.on('receive', async ({ message, index }: { message: string, index: number, length: number }) => {
				console.log("received lines", index, message)
				if (index === -1) {
					setEditorContent(message.split('\n'))
				} else {
					setEditorContent((editorContent) => {
						const newEditorContent = [...editorContent]
						newEditorContent[index] = message
						return newEditorContent
					})
				}
			})

			socket.on('title', async (title: string) => {
				setTitle(title)
			})
			socket.emit('join')
		})
	}, [])

	useEffect(() => {
		if (editorContent && editorContent.length > 0 && socket && socket.connected) {
			socket.on('join', () => {
				socket.emit('send', { message: editorContent.join('\n'), index: -1, length: editorContent.length })
			})

			socket.on('receive_hash', async ({ hash, index }: { hash: string, index: number }) => {
				console.log("received hash", index, hash)
				if (index > editorContent.length || generateHash(editorContent[index]) !== hash) {
					socket.emit('request', { hash: hash, index: index })
				}
			})

			socket.on('requested_lines', async ({ hash, index }: { hash: string, index: number }) => {
				if (generateHash(editorContent[index]) == hash) {
					console.log("requested lines", index)
					socket.emit('send', { message: editorContent[index], index: index, length: editorContent.length })
				}
			})

			return () => {
				socket.off("receive_hash")
				socket.off("requested_lines")
			}
		}
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

	const onEditorStateChange = async (value: string | undefined) => {
		if (value) {
			const newEditorContent = [...value.split('\n')]
			setEditorContent(newEditorContent)

			for (let i = 0; i < newEditorContent.length; i++) {
				if (i >= editorContent.length || generateHash(newEditorContent[i]) !== generateHash(editorContent[i])) {
					socket.emit('send_hash', {
						hash: generateHash(newEditorContent[i]),
						index: i,
						length: newEditorContent.length
					})
				}
			}
		}
	}

	const handleTitleChange = (e: any) => {
		setTitle(e.target.value)
		socket.emit('title', e.target.value)
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

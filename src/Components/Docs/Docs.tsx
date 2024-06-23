import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import io, { Socket } from 'socket.io-client'
import Navbar from '../Navbar/Navbar'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Editor } from '@monaco-editor/react'
import CryptoJS from 'crypto-js'
import { CredentialResponse } from '@react-oauth/google'
import { useMutation, useQuery } from '@tanstack/react-query'

const Alert = React.forwardRef(function Alert(props: any, ref) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const SERVER = import.meta.env.VITE_BACKEND_URL
let socket: Socket

function generateHash(message: string) {
	const hash = CryptoJS.SHA256(message)
	return hash.toString()
}

async function getDocContent(user: CredentialResponse, pageId: string) {
	const doc = await fetch(`${SERVER}/doc/${pageId}`, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${user.credential}`,
		},
	})

	return doc.json()
}

async function patchDocContent({
	user,
	pageId,
	title,
	editorContent,
	emailList,
	publicAccess,
}: {
	user: CredentialResponse
	pageId: string
	title: string
	editorContent: string[]
	emailList: string[]
	publicAccess: boolean
}) {
	return fetch(`${SERVER}/doc`, {
		method: 'PATCH',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${user.credential}`,
		},
		body: JSON.stringify({
			pageId: pageId,
			title: title,
			content: editorContent.join('\n'),
			accessType: publicAccess ? 'public' : 'private',
			addEmail: emailList,
		}),
	})
}

export default function Docs() {
	const [emailList, setEmailList] = useState<string[]>([])
	const { pageId } = useParams()

	const userStorage = localStorage.getItem('auth')
	if (!userStorage) {
		window.location.href = '/login'
		return
	}
	const user: CredentialResponse = JSON.parse(userStorage)
	if (!!!user) {
		window.location.href = '/login'
	}

	const [title, setTitle] = useState('')
	const [publicAccess, setPublicAccess] = useState(false)

	const [editorContent, setEditorContent] = useState<string[]>([])

	const handleSave = useMutation({
		mutationFn: patchDocContent,
	})

	useEffect(() => {
		document.title = title
	}, [title])

	if (user && pageId) {
		const { isPending, error, data, isFetching } = useQuery({
			queryKey: [pageId],
			queryFn: () => getDocContent(user, pageId),
		})

		useEffect(() => {
			if (!isPending && !isFetching && !error) {
				if (data && data.content) {
					setEditorContent(data.content.split('\n'))
				}
				if (data && data.accessList) {
					setEmailList(data.accessList)
					setPublicAccess(data.accessType === 'public')
				}
				if (data && data.title) {
					setTitle(data.title)
				}

				if (!data) {
					console.log('No data')
				}
			}
		}, [data])

		useEffect(() => {
			socket = io(SERVER, { query: { id: pageId } })
			socket.on('connect', () => {
				console.log('connected')
				socket.on(
					'receive',
					async ({
						message,
						index,
					}: {
						message: string
						index: number
						length: number
					}) => {
						console.log('received lines', index, message)
						if (index === -1) {
							setEditorContent(message.split('\n'))
						} else {
							setEditorContent((editorContent) => {
								const newEditorContent = [...editorContent]
								newEditorContent[index] = message
								return newEditorContent
							})
						}
					}
				)

				socket.on('title', async (title: string) => {
					setTitle(title)
				})
				socket.emit('join')
			})
		}, [])

		useEffect(() => {
			if (
				editorContent &&
				editorContent.length > 0 &&
				socket &&
				socket.connected
			) {
				socket.on('join', () => {
					socket.emit('send', {
						message: editorContent.join('\n'),
						index: -1,
						length: editorContent.length,
					})
				})

				socket.on(
					'receive_hash',
					async ({
						hash,
						index,
					}: {
						hash: string
						index: number
					}) => {
						console.log('received hash', index, hash)
						if (
							index > editorContent.length ||
							generateHash(editorContent[index]) !== hash
						) {
							socket.emit('request', { hash: hash, index: index })
						}
					}
				)

				socket.on(
					'requested_lines',
					async ({
						hash,
						index,
					}: {
						hash: string
						index: number
					}) => {
						if (generateHash(editorContent[index]) == hash) {
							console.log('requested lines', index)
							socket.emit('send', {
								message: editorContent[index],
								index: index,
								length: editorContent.length,
							})
						}
					}
				)

				return () => {
					socket.off('receive_hash')
					socket.off('requested_lines')
				}
			}
		}, [editorContent])

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
					if (
						i >= editorContent.length ||
						generateHash(newEditorContent[i]) !==
							generateHash(editorContent[i])
					) {
						socket.emit('send_hash', {
							hash: generateHash(newEditorContent[i]),
							index: i,
							length: newEditorContent.length,
						})
					}
				}

				handleSave.mutate({
					user,
					pageId,
					title,
					editorContent: newEditorContent,
					emailList,
					publicAccess,
				})
			}
		}

		const handleTitleChange = (e: any) => {
			setTitle(e.target.value)
			socket.emit('title', e.target.value)
		}

		return (
			<div>
				<Navbar
					user={user}
					page={'docs'}
					handleEmailChange={handleEmailChange}
					emailList={emailList}
					handleTitleChange={handleTitleChange}
					title={title}
					publicAccess={publicAccess}
					setPublicAccess={setPublicAccess}
				/>
				<div
					style={{
						backgroundColor: '#F1F1F1',
						justifyContent: 'center',
						display: 'flex',
					}}>
					<div
						className='editor'
						style={{
							width: '100vw',
							backgroundColor: '#F1F1F1',
							minHeight: '100vh',
						}}>
						{isFetching || isPending ? (
							<div>Loading...</div>
						) : (
							<Editor
								height='100vh'
								defaultLanguage='markdown'
								defaultValue=''
								value={editorContent.join('\n')}
								options={{
									minimap: {
										enabled: false,
									},
								}}
								onChange={onEditorStateChange}
							/>
						)}
						<Snackbar
							open={handleSave.isSuccess}
							autoHideDuration={5000}>
							<Alert
								severity={
									handleSave.isSuccess
										? 'success'
										: handleSave.isError
										? 'error'
										: ''
								}
								sx={{ width: '100%' }}>
								Saved
							</Alert>
						</Snackbar>
					</div>
				</div>
			</div>
		)
	} else {
		return <div>Loading...</div>
	}
}

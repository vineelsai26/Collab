import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import Navbar from '../Navbar/Navbar'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Editor } from '@monaco-editor/react'
import { CredentialResponse } from '@react-oauth/google'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getStoredUser } from '../../lib/auth'

const Alert = React.forwardRef(function Alert(props: any, ref) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const SERVER = import.meta.env.VITE_BACKEND_URL
// Editing intentionally uses the authenticated REST API only. The legacy
// realtime socket server is outside this repository and has no auditable
// handshake/document-ACL enforcement, so it must not receive document data.

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
	const { pageId } = useParams()

	// Compute the current user once, with defensive parsing/expiry handling.
	// All hooks below run unconditionally to satisfy the Rules of Hooks; access
	// is gated via `enabled`/internal guards and a render-time early return.
	const user = useMemo(() => getStoredUser(), [])

	const [emailList, setEmailList] = useState<string[]>([])
	const [title, setTitle] = useState('')
	const [publicAccess, setPublicAccess] = useState(false)
	const [editorContent, setEditorContent] = useState<string[]>([])

	const handleSave = useMutation({
		mutationFn: patchDocContent,
	})

	useEffect(() => {
		if (!user) {
			window.location.href = '/login'
		}
	}, [user])

	useEffect(() => {
		document.title = title
	}, [title])

	const { isPending, error, data, isFetching } = useQuery({
		queryKey: [pageId],
		queryFn: () =>
			getDocContent(user as CredentialResponse, pageId as string),
		enabled: !!user && !!pageId,
	})

	useEffect(() => {
		if (!user || !pageId) {
			return
		}
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

	if (!user || !pageId) {
		return <div>Loading...</div>
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
		const nextTitle = e.target.value
		setTitle(nextTitle)
		handleSave.mutate({
			user,
			pageId,
			title: nextTitle,
			editorContent,
			emailList,
			publicAccess,
		})
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
}

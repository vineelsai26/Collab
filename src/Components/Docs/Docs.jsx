import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import io from "socket.io-client"
import Navbar from '../Navbar/Navbar'
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg"
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SERVER = process.env.REACT_APP_BACKEND_URL
let socket

export default function Docs() {
	const [emailList, setEmailList] = useState([])
	const { pageId } = useParams()
	const user = JSON.parse(localStorage.getItem('user'))
	if (!!!user) {
		window.location.href = '/login'
	}

	const [editorState, setEditorState] = useState(EditorState.createEmpty());
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
				setEditorState(
					EditorState.createWithContent(
						convertFromRaw(JSON.parse(data.content))
					)
				)
			} if (data && data.accessList) {
				setEmailList(data.accessList)
			} else {
				console.log("No data")
			}
		}).catch(err => {
			console.log(err)
		})

		socket = io(SERVER, { query: { id: pageId } })
		socket.on('connect', () => {
			socket.emit('join')
			socket.on('receive', ({ message }) => {
				setEditorState(
					EditorState.createWithContent(
						convertFromRaw(JSON.parse(JSON.stringify(message)))
					)
				)
			})
		})
	}, [])

	useEffect(() => {
		const content = convertToRaw(editorState.getCurrentContent())
		socket.on('join', () => {
			socket.emit('send', { message: content })
		})
	}, [editorState])

	const handleSnackBarClose = () => {
		setSnackBarState(false);
	};

	const handleSave = () => {
		const content = convertToRaw(editorState.getCurrentContent())
		fetch(SERVER + '/dbGet', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ pageId: pageId, email: user.profileObj.email, content: content, addEmail: emailList })
		}).then(async (res) => {
			const data = await res.json()
			if (data && data.error) {
				console.log(data.error)
				window.location.href = '/'
			} else if (data && data.content) {
				setEditorState(
					EditorState.createWithContent(
						convertFromRaw(JSON.parse(data.content))
					)
				)
				setSnackBarState(true)
			} else {
				console.log("No data")
			}
		}).catch(err => {
			console.log(err)
		})
	}

	const handleEmailChange = (e) => {
		let emails = e.target.value.split(',')
		emails = emails.map((email) => email.trim())
		setEmailList(emails)
	}

	const onEditorStateChange = (editorState) => {
		setEditorState(editorState)

		const content = convertToRaw(editorState.getCurrentContent())
		socket.emit('send', { message: content })
	}

	return (
		<div>
			<Navbar user={user} page={"docs"} handleSave={handleSave} handleEmailChange={handleEmailChange} emailList={emailList} />
			<div style={{ backgroundColor: '#F1F1F1', justifyContent: 'center', display: 'flex' }}>
				<div className='editor' style={{ width: '100vw', backgroundColor: '#F1F1F1', minHeight: '100vh' }}>
					<Editor
						editorState={editorState}
						onEditorStateChange={onEditorStateChange}
						toolbarStyle={{
							position: 'sticky',
							top: 0,
							zIndex: 1000,
						}}
						editorStyle={{
							minHeight: '100vh',
							padding: '20px',
							backgroundColor: 'white',
							border: '1px solid #F1F1F1',
							borderRadius: '5px',
							boxShadow: '0px 0px 10px #F1F1F1',
							width: '80%',
							margin: 'auto',
							marginBottom: '20px',
						}}
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

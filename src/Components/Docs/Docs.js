import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import io from "socket.io-client"

const SERVER = process.env.REACT_APP_BACKEND_URL
let socket

export default function Docs() {
	const [docs, setDocs] = useState("")
	const [emailList, setEmailList] = useState([])
	const { pageId } = useParams()
	const user = JSON.parse(localStorage.getItem('user'))
	if (!!!user) {
		window.location.href = '/login'
	}

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
				setDocs(data.content)
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
				console.log(message)
				setDocs(message)
			})
		})
	}, [])

	useEffect(() => {
		socket.on('join', () => {
			socket.emit('send', { message: docs })
		})
	}, [docs])

	const handleSave = () => {
		fetch(SERVER + '/dbGet', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ pageId: pageId, email: user.profileObj.email, content: docs, addEmail: emailList })
		}).then(async (res) => {
			const data = await res.json()
			if (data && data.error) {
				console.log(data.error)
				window.location.href = '/'
			} else if (data && data.content) {
				setDocs(data.content)
			} else {
				console.log("No data")
			}
		}).catch(err => {
			console.log(err)
		})
	}

	const handleChange = (e) => {
		setDocs(e.target.value)
		socket.emit('send', { message: e.target.value })
	}

	const handleEmailChange = (e) => {
		let emails = e.target.value.split(',')
		emails = emails.map((email) => email.trim())
		setEmailList(emails)
	}

	return (
		<div className="App">
			<textarea
				value={docs}
				style={{ width: '100%', height: '70vh' }}
				onChange={(e) => handleChange(e)} /> <br></br>
			<button onClick={handleSave}>
				Save
			</button><br></br>

			<input style={{ width: '100%' }} value={emailList} onChange={(e) => handleEmailChange(e)} /><br></br>
			<button onClick={handleSave}>
				Save Email List
			</button>
		</div>
	)
}

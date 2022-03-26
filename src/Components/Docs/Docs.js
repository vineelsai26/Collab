import './Docs.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import io from "socket.io-client"

const SERVER = "http://127.0.0.1:5000"
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
		fetch('http://localhost:7000/dbGet', {
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
			} else if (data && data.content) {
				setDocs(data.content)
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
		fetch('http://localhost:7000/dbGet', {
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
				onChange={(e) => handleChange(e)} /> <br></br>
			<button onClick={handleSave}>
				Save
			</button><br></br>

			<input value={emailList} onChange={(e) => handleEmailChange(e)} /><br></br>
			<button onClick={handleSave}>
				Save Email List
			</button>
		</div>
	)
}

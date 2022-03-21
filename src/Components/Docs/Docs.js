import './Docs.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import io from "socket.io-client"

const SERVER = "http://127.0.0.1:5000"
let socket

export default function Docs() {
	const { pageId } = useParams()
	const [docs, setDocs] = useState("")

	useEffect(() => {
		socket = io(SERVER, { query: { id: pageId } })
		socket.on('connect', () => {
			console.log("connected")
			socket.emit('join')
			socket.on('memberCount', ({ count }) => {
				console.log(count)
			})
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

	return (
		<div className="App">
			<input
				value={docs}
				onChange={
					(e) => {
						setDocs(e.target.value)
						socket.emit('send', { message: e.target.value })
					}
				}>
			</input>
		</div>
	)
}

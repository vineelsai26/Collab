function App() {
	const user = JSON.parse(localStorage.getItem('user'))
	if (!!!user) {
		window.location.href = '/login'
	}
	return (
		<div>
			{user.profileObj.name}
		</div>
	)
}

export default App

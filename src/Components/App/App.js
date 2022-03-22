import './App.css'


function App() {
	const user = JSON.parse(localStorage.getItem('user'))
	return (
		<div className="App">
			{user.profileObj.name}
		</div>
	)
}

export default App

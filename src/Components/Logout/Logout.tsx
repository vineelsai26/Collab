export default function Logout() {
	localStorage.removeItem('auth')
	window.location.href = '/'
	return (
		<div>
			Logging you out...
		</div>
	)
}

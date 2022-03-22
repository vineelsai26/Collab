import './Login.css'
import { GoogleLogin } from 'react-google-login'

export default function Login() {
	const user = localStorage.getItem('user')
	if (
		user !== null && user !== undefined &&
		user !== "" &&
		JSON.parse(user).profileObj !== null &&
		JSON.parse(user).profileObj !== undefined
	) {
		window.location.href = '/'
		return (
			<div></div>
		)
	} else {
		const responseGoogle = (response) => {
			console.log(response)
			localStorage.setItem('user', JSON.stringify(response))
			window.location.href = "/"
		}
		return (
			<GoogleLogin
				clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
				buttonText="Login"
				accessType="offline"
				redirectUri="http://localhost:3000"
				onSuccess={responseGoogle}
				onFailure={responseGoogle}
			/>
		)
	}
}
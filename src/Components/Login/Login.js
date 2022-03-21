import './Login.css'
import { GoogleLogin } from 'react-google-login';
import env from "react-dotenv";



export default function Login() {
	const responseGoogle = (response) => {
		console.log(response)
	}
	return (
		<GoogleLogin
			clientId={env.GOOGLE_CLIENT_ID}
			buttonText="Login"
			accessType="offline"
			redirectUri="http://localhost:3000"
			onSuccess={responseGoogle}
			onFailure={responseGoogle}
		/>
	)
}

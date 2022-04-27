import { GoogleLogin } from 'react-google-login'
import { Paper, Typography } from "@mui/material"
import { Box } from '@mui/system'

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
			<div>Redirecting...</div>
		)
	} else {
		const responseGoogle = (response) => {
			console.log(response)
			localStorage.setItem('user', JSON.stringify(response))
			window.location.href = "/"
		}
		return (
			<div style={{ backgroundImage: `url('/background.webp')`, backgroundSize: '100%', height: '100vh', display: 'flex' }}>
				<Paper sx={{ width: '30%', margin: 'auto', height: '40vh', padding: '20px', display: 'flex', }} elevation={3}>
					<Box sx={{ margin: 'auto', height: '100%' }}>
						<Typography variant="h5" style={{ textAlign: 'center' }}>
							Login/Signup
						</Typography>
						<Box sx={{ marginTop: '100px' }}>
							<GoogleLogin
								clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
								buttonText="Sign in with Google"
								accessType="offline"
								redirectUri={process.env.REACT_APP_URL}
								onSuccess={responseGoogle}
								onFailure={responseGoogle}
							/>
						</Box>
					</Box>
				</Paper>
			</div>
		)
	}
}
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login'
import { Paper, Typography } from "@mui/material"
import { Box } from '@mui/material'
import React from 'react'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_URL

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
		const responseGoogle = (response: GoogleLoginResponse | any) => {
			if (response.profileObj !== null && response.profileObj !== undefined) {
				localStorage.setItem('user', JSON.stringify(response))
				window.location.href = '/'
			} else if (response.error !== null && response.error !== undefined) {
				if (response.error === "popup_closed_by_user") {
					window.location.href = '/login'
				}
				alert(response.details)
			}
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
								clientId={GOOGLE_CLIENT_ID}
								buttonText="Sign in with Google"
								accessType="offline"
								redirectUri={GOOGLE_REDIRECT_URI}
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

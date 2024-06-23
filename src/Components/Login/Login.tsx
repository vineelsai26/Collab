import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { Paper, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'

export default function Login() {
	const user = localStorage.getItem('auth')
	if (
		user !== null &&
		user !== undefined &&
		user !== '' &&
		JSON.parse(user).profileObj !== null &&
		JSON.parse(user).profileObj !== undefined
	) {
		window.location.href = '/'
		return <div>Redirecting...</div>
	} else {
		const responseGoogle = (response: CredentialResponse) => {
			localStorage.setItem('auth', JSON.stringify(response))
			window.location.href = '/'
		}

		return (
			<div
				style={{
					backgroundImage: `url('/background.webp')`,
					backgroundSize: '100%',
					height: '100vh',
					display: 'flex',
				}}>
				<Paper
					sx={{
						width: '30%',
						margin: 'auto',
						height: '40vh',
						padding: '20px',
						display: 'flex',
					}}
					elevation={3}>
					<Box
						sx={{
							margin: 'auto',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-evenly',
						}}>
						<Typography
							variant='h5'
							style={{ textAlign: 'center' }}>
							Login/Signup
						</Typography>
						<Box>
							<GoogleLogin
								onSuccess={responseGoogle}
								onError={() => {
									alert('Error logging in')
								}}
							/>
						</Box>
					</Box>
				</Paper>
			</div>
		)
	}
}

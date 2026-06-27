import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { Paper, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
import { Navigate } from 'react-router-dom'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()

function hasStoredAuth() {
	const user = localStorage.getItem('auth')
	if (!user) {
		return false
	}

	try {
		const parsed = JSON.parse(user)
		return Boolean(parsed?.credential)
	} catch {
		localStorage.removeItem('auth')
		return false
	}
}

export default function Login() {
	if (hasStoredAuth()) {
		return <Navigate to='/' replace />
	}

	const responseGoogle = (response: CredentialResponse) => {
		localStorage.setItem('auth', JSON.stringify(response))
		window.location.href = '/'
	}

	return (
		<main
			style={{
				alignItems: 'center',
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.28)), url('/background.webp')`,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				display: 'flex',
				minHeight: '100vh',
				padding: '24px',
			}}>
			<Paper
				sx={{
					display: 'flex',
					margin: 'auto',
					maxWidth: '420px',
					minHeight: '280px',
					padding: { xs: '28px 22px', sm: '36px' },
					width: '100%',
				}}
				elevation={3}>
				<Box
					sx={{
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'column',
						gap: 3,
						justifyContent: 'center',
						margin: 'auto',
						textAlign: 'center',
					}}>
					<Typography component='h1' variant='h5'>
						Login/Signup
					</Typography>
					{googleClientId ? (
						<Box>
							<GoogleLogin
								onSuccess={responseGoogle}
								onError={() => {
									alert('Error logging in')
								}}
							/>
						</Box>
					) : (
						<Typography color='text.secondary' variant='body2'>
							Add VITE_GOOGLE_CLIENT_ID to your local environment to enable Google sign-in.
						</Typography>
					)}
				</Box>
			</Paper>
		</main>
	)
}
